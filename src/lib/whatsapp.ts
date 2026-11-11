import site from '../data/site.json';

export function linkWhatsapp(mensagem: string = site.mensagemWhatsapp, numero: string = site.whatsapp) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}

export const linkWhatsapp2 = () => linkWhatsapp(site.mensagemWhatsapp, site.telefone2);
