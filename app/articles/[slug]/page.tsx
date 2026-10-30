import type { Metadata } from "next";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import { SPECIAL_FONTS, formatDate, listArticles, loadArticle } from "@/lib/articles";

type Props = { params: Promise<{ slug: string }> };

// Only listed articles exist: drafts are absent from production, so their
// URLs 404 there rather than rendering.
export async function generateStaticParams() {
  return (await listArticles()).map((a) => ({ slug: a.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { meta } = await loadArticle((await params).slug);
  return {
    title: meta.title,
    description: meta.summary,
    openGraph: {
      type: "article",
      title: meta.title,
      description: meta.summary,
      publishedTime: meta.date,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { meta, Body } = await loadArticle((await params).slug);
  const articleFont = SPECIAL_FONTS[meta.font ?? "handwriting"];

  return (
    <>
      <SiteHeader />
      <main
        className="mx-auto max-w-[68ch] px-4 py-10"
        style={{ "--article-font": articleFont } as React.CSSProperties}
      >
        <header className="mb-12">
          <p className="text-sm text-muted mb-3">
            {formatDate(meta.date)}
            {meta.draft && <span className="ml-3 text-neon-fuchsia uppercase tracking-wider">Draft</span>}
          </p>
          <h1
            className="text-4xl md:text-5xl leading-tight text-white neon-glow mb-5"
            style={{ fontFamily: "var(--article-font)" }}
          >
            {meta.title}
          </h1>
          <p className="text-xl text-ink/80 leading-relaxed">{meta.summary}</p>
        </header>
        <article>
          <Body />
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
