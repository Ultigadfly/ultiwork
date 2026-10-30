// A large display quote set in the article's special face (inherited from
// the article wrapper's --article-font).
export default function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <aside
      className="my-12 text-center text-3xl md:text-4xl leading-snug text-white neon-glow"
      style={{ fontFamily: "var(--article-font, var(--font-caveat))" }}
    >
      {children}
    </aside>
  );
}
