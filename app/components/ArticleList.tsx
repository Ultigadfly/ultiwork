import Link from "next/link";
import { type Article, formatDate } from "@/lib/articles";

export default function ArticleList({ articles }: { articles: Article[] }) {
  return (
    <ul className="space-y-10">
      {articles.map((a) => (
        <li key={a.slug}>
          <Link href={`/articles/${a.slug}`} className="group block">
            <p className="text-sm text-muted mb-1">
              {formatDate(a.date)}
              {a.draft && <span className="ml-3 text-neon-fuchsia uppercase tracking-wider">Draft</span>}
            </p>
            <h3 className="font-heading text-xl md:text-2xl text-white group-hover:text-neon-cyan transition-colors mb-2">
              {a.title}
            </h3>
            <p className="text-ink/80 leading-relaxed">{a.summary}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
