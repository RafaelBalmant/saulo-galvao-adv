# Saulo Galvão Advogados: site institucional

Site estático em **Astro + Tailwind**, hospedado na **Cloudflare Pages** (plano grátis), feito para captar clientes com Google Ads.

## Estrutura

| Caminho | O que é |
|---|---|
| `src/data/site.json` | Contatos, OAB, WhatsApp, ID do GTM (editável pelo painel `/admin`) |
| `src/content/areas/*.md` | Áreas de atuação. Cada arquivo gera um item na home e uma landing page em `/areas/<arquivo>` |
| `src/components/` | Seções da home (Hero, Quem Somos, Valores, Áreas, Contato) |
| `src/pages/areas/[slug].astro` | Template das landing pages para os anúncios |
| `src/pages/obrigado.astro` | Página de agradecimento do formulário (dispara a conversão `generate_lead`) |
| `functions/api/contato.ts` | Cloudflare Function que envia o formulário por e-mail (Resend) |
| `public/admin/` | Painel de edição (Sveltia CMS) |

## Rodar localmente

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # gera dist/
```

## Publicar na Cloudflare Pages

1. Cloudflare > Workers & Pages > Create > Pages > Connect to Git > este repositório.
2. Framework preset **Astro**, build command `npm run build`, output `dist`.
3. Em Settings > Variables and Secrets, adicione:
   - `RESEND_API_KEY`: chave do [Resend](https://resend.com) (grátis até 3 mil e-mails/mês)
   - `EMAIL_DESTINO`: quem recebe os contatos (ex.: galvaoadvg@gmail.com)
   - `EMAIL_REMETENTE`: ex.: `Site <onboarding@resend.dev>` até verificar o domínio próprio no Resend
4. Domínio: registrar o `.adv.br` no registro.br, apontar os nameservers para a Cloudflare e adicionar em Pages > Custom domains. Depois, atualizar `site` em `astro.config.mjs` e o `Sitemap` em `public/robots.txt`.

## Rastreamento (GTM + GA4 + Google Ads)

Preencha `gtmId` em `src/data/site.json`. O site já envia para o `dataLayer`:

| Evento | Quando |
|---|---|
| `whatsapp_click` | Clique em qualquer botão de WhatsApp (`cta_local` indica qual) |
| `email_click` | Clique no e-mail |
| `generate_lead` | Envio do formulário concluído (com `user_data` para conversões otimizadas) |
| `consentimento_aceito` / `consentimento_recusado` | Escolha no banner de cookies |

Todos levam `area_atuacao` quando disparados numa landing page. O Consent Mode v2 começa **negado** e só libera após o aceite (LGPD).

No GTM: tag Google (GA4), tag de conversão do Google Ads para `whatsapp_click` e `generate_lead` (acionador "Evento personalizado"), e o Conversion Linker.

## Painel de edição (/admin)

O Sveltia CMS faz login pelo GitHub. Na Cloudflare, publique o Worker grátis [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth), crie um OAuth App no GitHub e preencha `base_url` em `public/admin/config.yml`.

## Publicidade (Provimento 205/2021 da OAB)

Textos informativos e sóbrios. Não usar promessa de resultado, superlativos ("o melhor"), preços como chamariz, nem citar clientes ou casos, tanto no site quanto nos anúncios.
