import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteConfig } from "@/data/site";

export const alt = `${siteConfig.name} — assinatura cinza e roxa em fundo grafite`;
export const size = { width: 1920, height: 1080 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const cover = await readFile(join(process.cwd(), "public/assets/brand/vercuno-cover.png"));
  return new Response(new Uint8Array(cover), {
    headers: { "Content-Type": contentType },
  });
}
