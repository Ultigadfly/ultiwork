import fs from "node:fs";
import path from "node:path";
import type { ComponentType } from "react";

// The special-content faces from the brand book, one per article, used for
// its title and pull quotes. Body text is always Nunito.
export const SPECIAL_FONTS = {
  handwriting: "var(--font-caveat)",
  comic: "var(--font-comic-neue)",
  typewriter: "var(--font-courier-prime)",
  script: "var(--font-euphoria-script)", // short lines only
  bubble: "var(--font-bangers)", // speech bubbles only — never a title
} as const;

export type SpecialFont = keyof typeof SPECIAL_FONTS;

export type ArticleMeta = {
  title: string;
  summary: string;
  date: string; // YYYY-MM-DD, the publication date
  draft?: boolean;
  font?: Exclude<SpecialFont, "bubble">;
};

export type Article = ArticleMeta & { slug: string };

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

// Drafts render in local builds and Vercel preview deployments, never in
// production. Merging to master is therefore not, by itself, publishing: an
// article goes live only when its `draft` flag is removed.
const SHOW_DRAFTS = process.env.VERCEL_ENV !== "production";

function slugs(): string[] {
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.slice(0, -".mdx".length));
}

const TITLE_FONTS = Object.keys(SPECIAL_FONTS).filter((f) => f !== "bubble");

function isRealDate(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const d = new Date(`${iso}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(iso);
}

// Throws on any metadata an article page could not render correctly, so a
// mistake fails the build instead of shipping "Invalid Date" or a wrong face.
function validate(slug: string, meta: Partial<ArticleMeta> | undefined): asserts meta is ArticleMeta {
  const problems = [
    !meta?.title && "title is missing",
    !meta?.summary && "summary is missing",
    !isRealDate(meta?.date ?? "") && `date "${meta?.date}" is not a real YYYY-MM-DD date`,
    meta?.font !== undefined &&
      !TITLE_FONTS.includes(meta.font) &&
      `font "${meta.font}" must be one of ${TITLE_FONTS.join(", ")}`,
  ].filter(Boolean);
  if (problems.length) {
    throw new Error(`content/articles/${slug}.mdx: ${problems.join("; ")}`);
  }
}

async function importArticle(slug: string) {
  const mod = await import(`@/content/articles/${slug}.mdx`);
  return { meta: mod.metadata as Partial<ArticleMeta> | undefined, Body: mod.default as ComponentType };
}

export async function loadArticle(slug: string): Promise<{ meta: Article; Body: ComponentType }> {
  const { meta, Body } = await importArticle(slug);
  validate(slug, meta);
  return { meta: { ...meta, slug }, Body };
}

export async function listArticles(): Promise<Article[]> {
  const shown: Article[] = [];
  for (const slug of slugs()) {
    const { meta } = await importArticle(slug);
    // A draft is skipped before validation in production, so an unfinished
    // draft can never break a production deploy. In previews it is validated.
    if (meta?.draft && !SHOW_DRAFTS) continue;
    validate(slug, meta);
    shown.push({ ...meta, slug });
  }
  return shown.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export function formatDate(iso: string): string {
  // Parse as UTC so the build machine's timezone cannot shift the day.
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
