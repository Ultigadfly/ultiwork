# Ultiwork.io

The content site: a Next.js app deployed by Vercel from this repo. Pushing to `main` deploys
production; any other branch gets a preview URL.

```bash
npm ci
npm run dev     # http://localhost:3000
npm run build   # what Vercel runs
```

## Adding an article

1. Create `content/articles/<slug>.mdx`. The file name is the URL: `/articles/<slug>`.
2. Start it with its metadata:

   ```mdx
   export const metadata = {
     title: "A Short History of Energy",
     summary: "One or two sentences. Used on the index, in search results and link previews.",
     date: "2026-11-07",          // publication date, YYYY-MM-DD
     draft: true,                 // remove this line to publish
     font: "handwriting",         // handwriting | comic | typewriter | script
   }
   ```

3. Write the body in Markdown. Use `##` and `###` for headings (the title is the page's only `#`).
4. Images: put files in `public/articles/<slug>/` and use
   `<Figure src="/articles/<slug>/x.jpg" alt="..." width={1600} height={900} caption="..." credit="..." />`.
   A sourced image's licence attribution goes in `credit`.
5. A line worth pulling out: `<PullQuote>...</PullQuote>`, set in the article's `font`.

**Drafts** show in local builds and on Vercel preview deployments, marked *Draft*, and are left out
of production entirely: they are not listed and their URLs return 404. Publishing an article is
deleting its `draft` line and merging to `main`.

**Fonts** follow the brand book: Comfortaa headings and Nunito body site-wide. An article's `font`
sets its title and pull quotes. `script` (Euphoria Script) suits short lines only. Bangers is
loaded for comic speech bubbles and is never a title face.
