// Cloudflare Pages Function: recebe o formulário e envia por e-mail via Resend.
// Variáveis de ambiente (Cloudflare > Pages > Settings > Variables):
//   RESEND_API_KEY      chave da API do Resend (resend.com, plano grátis)
//   EMAIL_DESTINO       e-mail que recebe os contatos
//   EMAIL_REMETENTE     remetente verificado no Resend, ex.: "Site <site@saulogalvao.adv.br>"

interface Env { RESEND_API_KEY: string; EMAIL_DESTINO: string; EMAIL_REMETENTE: string }

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const querJson = (request.headers.get('accept') || '').includes('application/json');
  const responder = (ok: boolean, status = 200) =>
    querJson
      ? Response.json({ ok }, { status })
      : Response.redirect(new URL(ok ? '/obrigado' : '/#contato', request.url).toString(), 303);

  const f = await request.formData();
  const campo = (n: string) => String(f.get(n) ?? '').trim().slice(0, 4000);

  // Honeypot anti-spam: robôs preenchem o campo oculto
  if (campo('site_url')) return responder(true);

  const dados = { nome: campo('nome'), email: campo('email'), telefone: campo('telefone'), empresa: campo('empresa'), mensagem: campo('mensagem'), area: campo('area') };
  if (!dados.nome || !dados.email || !dados.telefone || !dados.mensagem) return responder(false, 400);

  const linhas = [
    ['Nome', dados.nome], ['E-mail', dados.email], ['Telefone', dados.telefone],
    ['Empresa', dados.empresa || '-'], ['Página / área', dados.area || 'Home'], ['Mensagem', dados.mensagem],
  ];
  const html = `<h2>Novo contato pelo site</h2><table cellpadding="6">${linhas
    .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${esc(v).replace(/\n/g, '<br>')}</td></tr>`)
    .join('')}</table>`;

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.EMAIL_REMETENTE,
      to: [env.EMAIL_DESTINO],
      reply_to: dados.email,
      subject: `Contato pelo site: ${dados.nome}${dados.empresa ? ` (${dados.empresa})` : ''}`,
      html,
    }),
  });

  return responder(r.ok, r.ok ? 200 : 502);
};
