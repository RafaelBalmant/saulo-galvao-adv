import site from '../data/site.json';

export function linkWhatsapp(mensagem: string = site.mensagemWhatsapp) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

export const linkTelefone = `tel:+${site.whatsapp}`;
