import axios from "axios";
import crypto from "crypto";
import https from "https";

const EXPECTED_KEY = "only4premium";

function jsonExit(res, data, httpCode = 200) {
  res.status(httpCode).setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

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

export default async function handler(req, res) {
  try {
    // ✅ Vercel automatically gives parsed query params here
    const number = req.query.number?.trim();
    const key = req.query.key?.trim();

    if (!number) {
      return jsonExit(res, { status: "error", message: "Number is required" }, 400);
    }

    if (!key || !keysEqual(EXPECTED_KEY, key)) {
      return jsonExit(res, { status: "error", message: "Key expired or invalid" }, 401);
    }

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

    // ✅ Replace unwanted text in response
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
