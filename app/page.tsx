import TaglineAnimation from "./components/TaglineAnimation";
import ArticleList from "./components/ArticleList";
import SiteFooter from "./components/SiteFooter";
import { listArticles } from "@/lib/articles";

export default async function Home() {
  const articles = await listArticles();

  // The animated hero fills the first screen untouched; articles sit below the
  // fold, and with none published the homepage looks exactly as it did.
  return (
    <>
      <TaglineAnimation />
      {articles.length > 0 && (
        <main className="mx-auto max-w-3xl px-4 pb-8">
          <h2 className="font-heading text-2xl text-neon-cyan mb-8">Latest</h2>
          <ArticleList articles={articles.slice(0, 6)} />
        </main>
      )}
      <SiteFooter />
    </>
  );
}
