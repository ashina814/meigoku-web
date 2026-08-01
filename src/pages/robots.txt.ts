import type { APIRoute } from "astro";
import { siteConfig } from "../data/site";

export const GET: APIRoute = () =>
  new Response(
    `User-agent: *\n${siteConfig.robots.includes("noindex") ? "Disallow: /" : "Allow: /"}\n`,
    { headers: { "Content-Type": "text/plain; charset=utf-8" } }
  );
