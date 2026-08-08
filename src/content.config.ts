import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const localizedText = z.object({
  "zh-CN": z.string(),
  en: z.string(),
});

const workData = defineCollection({
  loader: glob({ base: "./src/content/works", pattern: "**/data.yaml" }),
  schema: z
    .object({
      name: z.string(),
      summary: localizedText,
      type: z.enum(["plugin", "core", "tool", "component"]),
      accessModel: z.enum(["free", "paid", "freemium"]),
      lifecycle: z.enum(["early-access", "active", "archived"]),
      featured: z.boolean().default(false),
      publishedAt: z.coerce.string(),
      icon: z.string(),
      iconSrc: z.string().optional(),
      cover: z.object({
        src: z.string(),
        alt: localizedText.optional(),
      }),
      compatibility: z
        .object({
          minecraft: z.array(z.string()).optional(),
          platforms: z.array(z.string()).optional(),
        })
        .optional(),
      docs: z.object({ root: z.string() }).optional(),
      archive: z
        .object({
          archivedAt: z.coerce.string().nullable().optional(),
          note: localizedText.nullable().optional(),
          replacement: z.string().nullable().optional(),
        })
        .optional(),
    })
    .passthrough(),
});

const workPages = defineCollection({
  loader: glob({ base: "./src/content/works", pattern: "**/index.mdx" }),
  schema: z
    .object({
      github: z.string().url().optional(),
      license: z
        .object({
          name: z.string(),
          url: z.string().optional(),
        })
        .optional(),
      links: z
        .array(
          z.object({
            text: localizedText,
            icon: z.string(),
            url: z.string(),
          }),
        )
        .optional(),
      gallery: z
        .array(
          z.object({
            src: z.string(),
            alt: localizedText,
            title: localizedText.optional(),
            description: localizedText.optional(),
          }),
        )
        .optional(),
      acquisition: z
        .array(
          z.object({
            id: z.string(),
            name: localizedText,
            access: z.enum(["free", "paid"]),
            description: localizedText,
            priceText: localizedText.optional(),
            recommended: z.boolean().optional(),
            benefits: z.array(localizedText).optional(),
            channels: z.array(
              z.object({
                name: z.string(),
                url: z.string(),
                actionLabel: localizedText.optional(),
                note: localizedText.optional(),
              }),
            ),
          }),
        )
        .optional(),
    })
    .passthrough(),
});

const docs = defineCollection({
  loader: glob({ base: "./docs", pattern: "**/{zh-CN,en}/**/*.{md,mdx}" }),
  schema: z
    .object({
      title: z.string(),
      description: z.string().optional(),
      icon: z.string().nullable().optional(),
      link: z.string().optional(),
      layout: z.enum(["default", "wide"]).default("default"),
      draft: z.boolean().default(false),
      sidebar: z
        .object({
          label: z.string().optional(),
          order: z.number().int().optional(),
          hidden: z.boolean().default(false),
        })
        .optional(),
      documentSet: z
        .object({
          order: z.number().int().default(0),
          status: z.enum(["active", "archived"]).default("active"),
        })
        .optional(),
    })
    .passthrough(),
});

export const collections = { workData, workPages, docs };
