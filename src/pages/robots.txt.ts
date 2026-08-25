export function GET({ site }: { site: URL | undefined }) {
  const base = site ?? new URL('https://blog.lxp520.top');
  return new Response(`User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap-index.xml', base)}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}
