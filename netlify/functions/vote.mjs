// netlify/functions/vote.mjs
// 정치듀스 101 — 우승자가 정해지면 호출되는 함수 (Netlify Functions v2 방식)
// v2 방식이어야 Netlify Blobs 접속 정보(siteID, token)가 자동으로 주입된다.
import { getStore } from "@netlify/blobs";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json"
};

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("", { status: 200, headers: CORS_HEADERS });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), { status: 405, headers: CORS_HEADERS });
  }

  let winnerId;
  try {
    const body = await req.json();
    winnerId = body.winnerId;
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400, headers: CORS_HEADERS });
  }

  if (winnerId === undefined || winnerId === null) {
    return new Response(JSON.stringify({ error: "winnerId is required" }), { status: 400, headers: CORS_HEADERS });
  }

  try {
    const store = getStore("jeongdeuce101");
    const key = "winner-counts";

    let counts = (await store.get(key, { type: "json" })) || {};
    const idStr = String(winnerId);
    counts[idStr] = (counts[idStr] || 0) + 1;
    await store.setJSON(key, counts);

    return new Response(JSON.stringify({ ok: true, count: counts[idStr] }), { status: 200, headers: CORS_HEADERS });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "internal error", detail: String((e && e.message) || e) }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
};
