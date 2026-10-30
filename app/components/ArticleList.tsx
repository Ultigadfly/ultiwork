import Link from "next/link";
import { type Article, formatDate } from "@/lib/articles";

// `headingLevel` follows the page: h3 under the homepage's "Latest" h2, h2 under the index's h1.
export default function ArticleList({
  articles,
  headingLevel = "h3",
}: {
  articles: Article[];
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <ul className="space-y-10">
      {articles.map((a) => (
        <li key={a.slug}>
          <Link href={`/articles/${a.slug}`} className="group block">
            <p className="text-sm text-muted mb-1">
              {formatDate(a.date)}
              {a.draft && <span className="ml-3 text-neon-fuchsia uppercase tracking-wider">Draft</span>}
            </p>
            <Heading className="font-heading text-xl md:text-2xl text-white group-hover:text-neon-cyan transition-colors mb-2">
              {a.title}
            </Heading>
            <p className="text-ink/80 leading-relaxed">{a.summary}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
