import axios from "axios";
import crypto from "crypto";
import querystring from "querystring";
import https from "https";

// ✅ Expected Key
const EXPECTED_KEY = "only4premium";

// ✅ Utility function: JSON Response
function jsonExit(res, data, httpCode = 200) {
  res.status(httpCode).setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

// ✅ Safe comparison
function keysEqual(a, b) {
  try {
    const bufA = Buffer.from(String(a));
    const bufB = Buffer.from(String(b));
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

// ✅ Main Handler
export default async function handler(req, res) {
  try {
    const orig = req.url || "";
    const idx = orig.indexOf("?");
    const rawQs = idx >= 0 ? orig.slice(idx + 1) : "";
    const cleanQs = rawQs.replace(/\s+/g, "");
    const params = querystring.parse(cleanQs);

    const number = params.number || null;
    const key = params.key || null;

    if (!number)
      return jsonExit(res, { status: "error", message: "Number is required" }, 400);

    if (!key || !keysEqual(EXPECTED_KEY, key))
      return jsonExit(res, { status: "error", message: "Key expired or invalid" }, 401);

    const apiUrl = `https://ox.taitaninfo.workers.dev/?mobile=${encodeURIComponent(number)}`;
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });

    let upstreamResp;
    try {
      upstreamResp = await axios.get(apiUrl, {
        httpsAgent,
        maxRedirects: 5,
        validateStatus: null,
        responseType: "text",
        timeout: 20000,
      });
    } catch (err) {
      const msg = err?.message || String(err);
      return jsonExit(res, { status: "error", message: "Request Error: " + msg }, 502);
    }

    let body = upstreamResp.data ?? "";
    if (typeof body !== "string") body = JSON.stringify(body);

    body = body
      .replaceAll("by @ffloveryt", "by api https://t.me/divine_rbbot")
      .replaceAll('"join_backup": "https://t.me/+XfrJPF7l9sY0YjZl",', '"by api https://t.me/divine_rbbot"')
      .replaceAll('"join_main": "https://t.me/+nRN7ZYqpRog4OGU9"', '"by api https://t.me/divine_rbbot"');

    res.status(upstreamResp.status || 200).setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(body);
  } catch (e) {
    const msg = e?.message || String(e);
    jsonExit(res, { status: "error", message: "Server Error: " + msg }, 500);
  }
}
