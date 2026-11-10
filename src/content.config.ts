import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const areas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/areas' }),
  schema: z.object({
    titulo: z.string(),
    ordem: z.number().default(99),
    icone: z.enum(['predio', 'banco', 'escudo', 'contrato']).default('predio'),
    resumo: z.string(),
    // Landing page (Google Ads)
    h1: z.string(),
    subtitulo: z.string(),
    seoTitle: z.string(),
    seoDescription: z.string(),
    mensagemWhatsapp: z.string(),
    topicos: z.array(z.object({ titulo: z.string(), texto: z.string() })),
    faq: z.array(z.object({ pergunta: z.string(), resposta: z.string() })).default([]),
  }),
});

export const collections = { areas };
