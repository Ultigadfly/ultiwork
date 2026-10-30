import type { Metadata } from "next";
import {
  Bangers,
  Caveat,
  Comfortaa,
  Comic_Neue,
  Courier_Prime,
  Euphoria_Script,
  Nunito,
} from "next/font/google";
import "./globals.css";

// Site-wide faces (brand book): Comfortaa headings, Nunito body.
const comfortaa = Comfortaa({ subsets: ["latin"], variable: "--font-comfortaa" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });

// Special-content faces, chosen per article. Caveat is preloaded for the
// homepage tagline; the rest are not, since most pages use one or none.
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });
const comicNeue = Comic_Neue({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-comic-neue",
  preload: false,
});
const courierPrime = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-courier-prime",
  preload: false,
});
const euphoriaScript = Euphoria_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-euphoria-script",
  preload: false,
});
const bangers = Bangers({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bangers",
  preload: false,
});

const fontVariables = [comfortaa, nunito, caveat, comicNeue, courierPrime, euphoriaScript, bangers]
  .map((f) => f.variable)
  .join(" ");

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ultiwork.io"),
  title: { default: "Ultiwork.io", template: "%s · Ultiwork.io" },
  description:
    "Short histories and near futures of how the human role changes as technology shifts underneath it.",
  openGraph: { siteName: "Ultiwork.io", type: "website" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fontVariables} bg-black text-ink font-body antialiased`}>
        {children}
      </body>
    </html>
  );
}
