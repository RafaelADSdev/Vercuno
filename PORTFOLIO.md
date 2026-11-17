# Adicionar um case ao Vercuno

1. Salve as capturas WebP em `public/assets/cases/`, com o slug e a versão no nome. Registre as dimensões, o texto alternativo e as legendas. Para usar o comparador, inclua imagens anteriores reais.
2. Adicione um objeto em `src/lib/cases.ts`. Preencha o serviço, o cliente, o setor, o ano documentado, o escopo, os recursos e a nota de evidência. Informe o link do sistema ou site e do repositório público quando disponíveis. Inclua a tecnologia quando comprovada.
3. Rode `npm run typecheck` e `npm run build`. Confira o card, os filtros, a página do case e os links. O catálogo e o sitemap usam o mesmo cadastro.

Na publicação, as URLs usam `NEXT_PUBLIC_SITE_URL` ou o domínio de produção informado pela Vercel.
