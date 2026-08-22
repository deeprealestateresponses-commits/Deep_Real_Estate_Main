/*
  Public articles — the index and one article, in one function.

  Optional catch-all so both URLs resolve here (the Hobby 12-function cap):
    GET /api/blogs        → the published index, bodies omitted
    GET /api/blogs/:slug  → one published article, with its body
*/
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '../_lib/db.js';
import { handler, json, methodNotAllowed, notFound, publicCache } from '../_lib/http.js';
import { toBlog, toBlogSummary } from '../_lib/shape.js';

export default handler(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);

  // [[...slug]] arrives as an array of path segments, or undefined at the root.
  const segments = req.query.slug;
  const slug = Array.isArray(segments) ? segments[0] : segments;

  if (!slug) {
    const rows = await sql`
      SELECT * FROM blogs
      WHERE published = true
      ORDER BY COALESCE(published_at, created_at) DESC
    `;
    publicCache(res, 60);
    return json(res, 200, { blogs: rows.map(toBlogSummary) });
  }

  const rows = await sql`
    SELECT * FROM blogs WHERE slug = ${slug} AND published = true LIMIT 1
  `;
  if (rows.length === 0) throw notFound('Article not found');

  publicCache(res, 60);
  json(res, 200, { blog: toBlog(rows[0]) });
});
