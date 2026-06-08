import { H3Event } from "h3";

const MAX_SIZE = 5 * 1024 * 1024;

export default eventHandler(async (event: H3Event) => {
  const { url } = getQuery(event);

  if (typeof url !== "string") {
    throw createError({ statusCode: 400, statusMessage: "URL should be a string" });
  }

  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DMV-DIY/1.0)' },
  });

  if (!response.ok) {
    throw createError({ statusCode: response.status, statusMessage: "Failed to fetch image" });
  }

  const type = response.headers.get("content-type");
  if (!type?.startsWith("image/")) {
    throw createError({ statusCode: 400, statusMessage: "URL does not point to an image" });
  }

  const buffer = await response.arrayBuffer();
  if (buffer.byteLength > MAX_SIZE) {
    throw createError({ statusCode: 413, statusMessage: "Image exceeds 5MB limit" });
  }

  setHeader(event, "content-type", type);
  setHeader(event, "Cache-Control", "public, max-age=31536000, immutable");

  return Buffer.from(buffer);
});
