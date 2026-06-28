// netlify/functions/vote.js
// 정치듀스 101 — 우승자가 정해지면 호출되는 함수.
// Netlify Blobs(내장 키-값 저장소)에 후보별 득표수를 누적한다.
const { getStore } = require("@netlify/blobs");

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json"
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: CORS_HEADERS, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  let winnerId;
  try {
    const body = JSON.parse(event.body || "{}");
    winnerId = body.winnerId;
  } catch (e) {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: "Invalid JSON body" }) };
  }

  if (winnerId === undefined || winnerId === null) {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: "winnerId is required" }) };
  }

  try {
    const store = getStore("jeongdeuce101");
    const key = "winner-counts";

    let counts = {};
    const existing = await store.get(key, { type: "json" });
    if (existing) counts = existing;

    const idStr = String(winnerId);
    counts[idStr] = (counts[idStr] || 0) + 1;

    await store.setJSON(key, counts);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ ok: true, count: counts[idStr] })
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "internal error", detail: String(e && e.message || e) })
    };
  }
};
