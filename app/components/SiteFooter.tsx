import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mx-auto max-w-3xl px-4 py-12 text-sm text-muted text-center">
      <p>Ultiwork.io is a property of Ultimate Workforce Solutions.</p>
      <p className="mt-2 space-x-4">
        <Link href="/articles" className="hover:text-neon-cyan">Articles</Link>
        <Link href="/privacy" className="hover:text-neon-cyan">Privacy</Link>
      </p>
    </footer>
  );
}
