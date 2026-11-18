import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const safeUrl = z
  .url()
  .refine((url) => url.startsWith('https://') || url.startsWith('mailto:'), 'Use an https: or mailto: URL');

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      highlight: z.string().optional(),
      kicker: z.string(),
      summary: z.string(),
      tags: z.array(z.string()).min(1),
      categories: z.array(z.enum(['client', 'game', 'xr', 'tool'])).min(1),
      platform: z.enum(['itchio', 'steam', 'playstore', 'github']).optional(),
      url: safeUrl.optional(),
      client: z.string().optional(),
      role: z.string().optional(),
      period: z.string().optional(),
      platforms: z.string(),
      engine: z.string(),
      trailer: z.string().regex(/^[\w-]{11}$/, 'Use a YouTube video ID').optional(),
      cover: image().optional(),
      screenshots: z.array(image()).default([]),
      released: z.coerce.date().optional(),
      featured: z.boolean().default(false),
      order: z.number().int(),
    }),
});

const profile = defineCollection({
  loader: file('./src/data/profile.yaml'),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    headline: z.string(),
    highlight: z.string(),
    lead: z.string(),
    cv: safeUrl.optional(),
    stats: z.array(z.object({ value: z.string(), label: z.string() })).length(4),
    about: z.array(z.string()).min(1),
  }),
});

const experience = defineCollection({
  loader: file('./src/data/experience.yaml'),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    period: z.string(),
    description: z.string(),
    order: z.number().int(),
  }),
});

const links = defineCollection({
  loader: file('./src/data/links.yaml'),
  schema: z.object({
    label: z.string(),
    url: safeUrl,
    contact: z.boolean().default(false),
    primary: z.boolean().default(false),
    highlight: z.boolean().default(false),
    order: z.number().int(),
  }),
});

const repos = defineCollection({
  loader: file('./src/data/repos.yaml'),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    url: safeUrl,
    language: z.string(),
    stars: z.number().int().nonnegative(),
    topics: z.array(z.string()).default([]),
    pinned: z.boolean().default(false),
    order: z.number().int(),
  }),
});

export const collections = { projects, profile, experience, links, repos };
