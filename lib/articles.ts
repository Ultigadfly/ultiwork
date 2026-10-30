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
// production. Merging to main is therefore not, by itself, publishing: an
// article goes live only when its `draft` flag is removed.
const SHOW_DRAFTS = process.env.VERCEL_ENV !== "production";

function slugs(): string[] {
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.slice(0, -".mdx".length));
}

export async function loadArticle(slug: string): Promise<{
  meta: Article;
  Body: ComponentType;
}> {
  const mod = await import(`@/content/articles/${slug}.mdx`);
  const meta = mod.metadata as ArticleMeta | undefined;
  if (!meta?.title || !meta?.summary || !/^\d{4}-\d{2}-\d{2}$/.test(meta?.date ?? "")) {
    throw new Error(
      `content/articles/${slug}.mdx: export const metadata needs title, summary and date (YYYY-MM-DD)`,
    );
  }
  return { meta: { ...meta, slug }, Body: mod.default };
}

export async function listArticles(): Promise<Article[]> {
  const all = await Promise.all(slugs().map(async (s) => (await loadArticle(s)).meta));
  return all
    .filter((a) => SHOW_DRAFTS || !a.draft)
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
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
