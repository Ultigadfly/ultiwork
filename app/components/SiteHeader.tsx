import Image from "next/image";
import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="mx-auto max-w-3xl px-4 pt-8 pb-4">
      <Link href="/" aria-label="Ultiwork.io home" className="inline-block">
        <Image src="/logo.png" alt="Ultiwork" width={720} height={138} sizes="160px" className="w-40 h-auto" />
      </Link>
    </header>
  );
}
