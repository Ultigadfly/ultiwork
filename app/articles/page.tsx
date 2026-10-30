import type { Metadata } from "next";
import ArticleList from "../components/ArticleList";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { listArticles } from "@/lib/articles";

export const metadata: Metadata = { title: "Articles" };

export default async function ArticlesIndex() {
  const articles = await listArticles();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-heading text-3xl md:text-4xl text-neon-cyan mb-10">Articles</h1>
        {articles.length > 0 ? (
          <ArticleList articles={articles} />
        ) : (
          <p className="text-lg text-muted">The first one is on its way.</p>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
