#!/usr/bin/env bash
set -euo pipefail

readonly root=/srv/vercuno
readonly state="$root/.deploy"
readonly repository="$state/repository.git"
readonly remote=https://github.com/RafaelADSdev/Vercuno.git
readonly tracked_ref=refs/heads/main
readonly release_env="$root/release.env"
readonly image_repo=vercuno-site
readonly probe_name=vercuno-release-check
readonly probe_label=br.com.vercuno.release-check

docker=(sudo -n docker)
compose=("${docker[@]}" compose --project-directory "$root" --file "$root/compose.yaml")

log() {
  printf '%s\n' "$*"
}

selected_release() {
  sed -n 's/^VERCUNO_RELEASE=//p' "$release_env"
}

start_site() {
  "${compose[@]}" --env-file "$1" up -d --no-deps --no-build --pull never --wait --wait-timeout 90 site
}

site_healthy() {
  local container actual
  container=$("${compose[@]}" --env-file "$release_env" ps --all -q site) || return 1
  [[ -n "$container" ]] || return 1
  actual=$("${docker[@]}" inspect --format '{{.Config.Image}} {{if .State.Health}}{{.State.Health.Status}}{{end}}' "$container") || return 1
  [[ "$actual" == "$image_repo:$1 healthy" ]]
}

check_site() {
  local path status
  for path in / /portfolio /sitemap.xml; do
    status=$(curl --fail --silent --show-error --max-time 5 --output /dev/null --write-out '%{http_code}' "http://127.0.0.1:3100$path") || return 1
    [[ "$status" == 200 ]] || return 1
  done
}

remove_probe() {
  local marker
  marker=$("${docker[@]}" container inspect --format "{{index .Config.Labels \"$probe_label\"}}" "$probe_name" 2>/dev/null) || return 0
  if [[ "$marker" != true ]]; then
    log "Container $probe_name is reserved by another workload."
    return 1
  fi
  "${docker[@]}" container rm --force "$probe_name" >/dev/null
}

validate_image() {
  local attempt
  remove_probe || return 1
  "${docker[@]}" run --detach --name "$probe_name" --label "$probe_label=true" "$1" >/dev/null || return 1
  for ((attempt = 1; attempt <= 30; attempt++)); do
    if "${docker[@]}" exec "$probe_name" node -e '
      Promise.all(["/", "/portfolio", "/sitemap.xml"].map(async (path) => {
        const response = await fetch("http://127.0.0.1:3000" + path, {
          redirect: "manual",
          signal: AbortSignal.timeout(2000),
        });
        if (response.status !== 200) throw new Error(path);
      })).catch(() => { process.exitCode = 1; });
    ' 2>/dev/null; then
      return 0
    fi
    sleep 1
  done
  "${docker[@]}" logs --tail 25 "$probe_name" >&2
  return 1
}

retain_images() {
  local tag
  while IFS= read -r tag; do
    [[ "$tag" =~ ^[0-9a-f]{12,40}$ && "$tag" != "$1" && "$tag" != "$2" ]] || continue
    "${docker[@]}" image rm --no-prune "$image_repo:$tag" >/dev/null ||
      log "Kept image $image_repo:$tag."
  done < <("${docker[@]}" image ls --filter "reference=$image_repo:*" --format '{{.Tag}}')
}

mkdir -p "$state"
exec 9>"$state/deploy.lock"
flock -n 9 || exit 0

previous=$(selected_release)
if [[ ! "$previous" =~ ^[0-9a-f]{12,40}$ ]]; then
  log "No valid release selected in $release_env."
  exit 1
fi

# Recover the last selected release before processing Git, including after a host restart.
if ! site_healthy "$previous"; then
  log "Restoring selected release $previous."
  start_site "$release_env"
  site_healthy "$previous"
fi

if [[ ! -f "$repository/HEAD" ]]; then
  git init --quiet --bare "$repository"
fi

timeout 45 env GIT_TERMINAL_PROMPT=0 git -c credential.helper= --git-dir "$repository" fetch --quiet --no-tags "$remote" "+$tracked_ref:$tracked_ref"
commit=$(git --git-dir "$repository" rev-parse --verify "$tracked_ref^{commit}")
release=$(git --git-dir "$repository" rev-parse --short=12 "$commit")
if [[ "$commit" == "$previous"* ]] &&
  [[ "$(git --git-dir "$repository" rev-parse --verify "$previous^{commit}")" == "$commit" ]]; then
  exit 0
fi
if ! git --git-dir "$repository" merge-base --is-ancestor "$previous" "$commit"; then
  log "Refusing to replace $previous with $commit outside its Git history."
  exit 1
fi

failure_record="$state/last-failure"
if [[ -f "$failure_record" ]]; then
  read -r failed_commit failed_at < "$failure_record" || :
  if [[ "$failed_commit" == "$commit" && "$failed_at" =~ ^[0-9]{1,10}$ ]] &&
    (( $(date +%s) - failed_at < 300 )); then
    exit 0
  fi
fi

candidate_env=
promoting=false
probe_started=false
finish() {
  local status=$?
  if [[ "$status" != 0 ]]; then
    printf '%s %s\n' "$commit" "$(date +%s)" > "$failure_record" || :
    if [[ "$promoting" == true && "$(selected_release)" == "$previous" ]]; then
      log "Restoring $previous after failed promotion of $release."
      if ! start_site "$release_env" || ! site_healthy "$previous" || ! check_site; then
        log "Rollback of $previous did not pass the health check."
      fi
    fi
  fi
  if [[ "$probe_started" == true ]]; then
    remove_probe || :
  fi
  if [[ -n "$candidate_env" ]]; then
    rm -f -- "$candidate_env"
  fi
  exit "$status"
}
trap finish EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

image="$image_repo:$release"
log "Building $commit."
git --git-dir "$repository" archive "$commit" |
  "${docker[@]}" build --file deploy/aws/Dockerfile --label "org.opencontainers.image.revision=$commit" --tag "$image" -

probe_started=true
if ! validate_image "$image"; then
  log "Candidate $release failed the smoke test."
  exit 1
fi
remove_probe
probe_started=false

candidate_env=$(mktemp "$root/.release.env.XXXXXX")
printf 'VERCUNO_RELEASE=%s\n' "$release" > "$candidate_env"
log "Promoting $release."
promoting=true
if ! start_site "$candidate_env" || ! site_healthy "$release" || ! check_site; then
  log "Production smoke test failed for $release."
  exit 1
fi
mv -f -- "$candidate_env" "$release_env"
candidate_env=
promoting=false
rm -f -- "$failure_record"
log "Deployed $commit."
retain_images "$release" "$previous"
