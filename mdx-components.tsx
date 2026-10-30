import type { MDXComponents } from "mdx/types";
import Figure from "@/app/components/Figure";
import PullQuote from "@/app/components/PullQuote";

// Article typography. Body is Nunito at reading size; headings are Comfortaa.
const components: MDXComponents = {
  h2: (props) => (
    <h2 className="font-heading text-2xl md:text-3xl text-neon-cyan mt-14 mb-5 leading-snug" {...props} />
  ),
  h3: (props) => (
    <h3 className="font-heading text-xl md:text-2xl text-neon-green mt-10 mb-4 leading-snug" {...props} />
  ),
  p: (props) => <p className="text-lg leading-relaxed mb-6" {...props} />,
  a: (props) => (
    <a
      className="text-neon-cyan underline decoration-neon-cyan/40 underline-offset-4 hover:decoration-neon-cyan"
      {...props}
    />
  ),
  ul: (props) => <ul className="text-lg leading-relaxed mb-6 pl-6 list-disc marker:text-neon-violet" {...props} />,
  ol: (props) => <ol className="text-lg leading-relaxed mb-6 pl-6 list-decimal marker:text-neon-violet" {...props} />,
  li: (props) => <li className="mb-2" {...props} />,
  blockquote: (props) => (
    <blockquote className="border-l-4 border-neon-fuchsia pl-5 my-8 text-pastel-pink italic" {...props} />
  ),
  hr: () => <hr className="my-12 border-0 h-px bg-gradient-to-r from-transparent via-neon-violet to-transparent" />,
  strong: (props) => <strong className="text-white font-bold" {...props} />,
  Figure,
  PullQuote,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
