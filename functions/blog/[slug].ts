// Cloudflare Pages Function: injects per-post Open Graph / Twitter meta tags
// into the HTML shell for /blog/:slug requests, so link previews (Discord,
// Slack, iMessage, X, etc.) show the post's title, excerpt and cover image
// instead of the generic site tags. Crawlers for these previews don't run
// the client-side React app, so the tags have to be present in the raw HTML.

interface Env {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_PUBLISHABLE_KEY: string;
}

interface PostMeta {
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published: boolean;
}

interface EventContext {
  request: Request;
  env: Env;
  params: Record<string, string | string[]>;
  next: () => Promise<Response>;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const onRequestGet = async (context: EventContext): Promise<Response> => {
  const response = await context.next();

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    return response;
  }

  const slug = context.params.slug;
  const { VITE_SUPABASE_URL: supabaseUrl, VITE_SUPABASE_PUBLISHABLE_KEY: supabaseKey } = context.env;

  if (!supabaseUrl || !supabaseKey || typeof slug !== "string") {
    return response;
  }

  try {
    const apiUrl = `${supabaseUrl}/rest/v1/blog_posts?slug=eq.${encodeURIComponent(slug)}&select=title,excerpt,cover_image_url,published&limit=1`;
    const apiRes = await fetch(apiUrl, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    if (!apiRes.ok) {
      return response;
    }

    const posts = (await apiRes.json()) as PostMeta[];
    const post = posts[0];

    if (!post || !post.published) {
      return response;
    }

    const html = await response.text();
    const pageUrl = context.request.url;
    const title = escapeHtml(post.title);
    const description = escapeHtml(post.excerpt || "Read this post on Stephen's blog.");
    const image = post.cover_image_url ? escapeHtml(post.cover_image_url) : null;

    const tags = [
      `<meta name="description" content="${description}" />`,
      `<meta property="og:type" content="article" />`,
      `<meta property="og:title" content="${title}" />`,
      `<meta property="og:description" content="${description}" />`,
      `<meta property="og:url" content="${escapeHtml(pageUrl)}" />`,
      image ? `<meta property="og:image" content="${image}" />` : null,
      `<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}" />`,
      `<meta name="twitter:title" content="${title}" />`,
      `<meta name="twitter:description" content="${description}" />`,
      image ? `<meta name="twitter:image" content="${image}" />` : null,
    ]
      .filter((tag): tag is string => tag !== null)
      .join("\n    ");

    const newHtml = html
      .replace(/<title>.*?<\/title>/i, `<title>${title}</title>`)
      .replace("</head>", `    ${tags}\n  </head>`);

    const headers = new Headers(response.headers);
    headers.delete("content-length");

    return new Response(newHtml, {
      status: response.status,
      headers,
    });
  } catch {
    return response;
  }
};
