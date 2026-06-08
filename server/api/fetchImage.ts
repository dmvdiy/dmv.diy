import { H3Event } from "h3";
import axios from "axios";

const MAX_SIZE = 5 * 1024 * 1024;
const requestHeaders = { 'User-Agent': 'Mozilla/5.0 (compatible; DMV-DIY/1.0)' };

export default eventHandler(async (event: H3Event) => {
  const { url } = getQuery(event);

  if (typeof url !== "string") {
    throw createError({
      statusCode: 400,
      statusMessage: "URL should be a string",
    });
  }

  // Try HEAD to check size before fetching
  try {
    const sizeResponse = await axios.head(url, { headers: requestHeaders });
    const size = Number(sizeResponse.headers["content-length"]);
    if (size && size > MAX_SIZE) {
      throw createError({
        statusCode: 413,
        statusMessage: "The specified image is too large.",
      });
    }
  } catch (e: any) {
    if (e?.statusCode === 413) throw e;
    // HEAD failed (405, network issue, etc.) — skip size pre-check and proceed to GET
  }

  const response = await axios.get(url, {
    responseType: "arraybuffer",
    headers: requestHeaders,
    maxContentLength: MAX_SIZE,
  });

  const type = response.headers["content-type"];
  if (!type?.startsWith("image/")) {
    throw createError({
      statusCode: 400,
      statusMessage: "Specified URL does not point to an image.",
    });
  }

  setHeader(event, "content-type", type);
  setHeader(event, "Cache-Control", "public, max-age=31536000, immutable");

  return Buffer.from(response.data, "binary");
});
