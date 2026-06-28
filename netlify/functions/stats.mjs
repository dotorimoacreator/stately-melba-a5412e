// netlify/functions/stats.mjs
// 정치듀스 101 — 전체 후보별 누적 득표수 조회 (Netlify Functions v2 방식)
import { getStore } from "@netlify/blobs";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Content-Type": "application/json"
};

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("", { status: 200, headers: CORS_HEADERS });
  }
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), { status: 405, headers: CORS_HEADERS });
  }

  try {
    const store = getStore("jeongdeuce101");
    const counts = (await store.get("winner-counts", { type: "json" })) || {};
    return new Response(JSON.stringify({ counts }), { status: 200, headers: CORS_HEADERS });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "internal error", detail: String((e && e.message) || e) }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
};
