import type { Metadata } from "next";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

export const metadata: Metadata = { title: "Privacy" };

// Keep this true to the site: if analytics, forms or embeds are ever added,
// this page changes in the same commit.
export default function Privacy() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[68ch] px-4 py-10 text-lg leading-relaxed space-y-6">
        <h1 className="font-heading text-3xl md:text-4xl text-neon-cyan mb-4">Privacy</h1>
        <p>
          Ultiwork.io does not use cookies, analytics or tracking scripts, and it does not ask for
          or collect personal information.
        </p>
        <p>
          The site is hosted by Vercel, which keeps standard server logs, such as IP addresses and
          request times, to deliver and secure the site.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
