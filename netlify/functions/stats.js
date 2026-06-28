// netlify/functions/stats.js
// 정치듀스 101 — 전체 후보별 누적 득표수를 돌려주는 함수.
const { getStore } = require("@netlify/blobs");

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Content-Type": "application/json"
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: CORS_HEADERS, body: "" };
  }
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    const store = getStore("jeongdeuce101");
    const counts = (await store.get("winner-counts", { type: "json" })) || {};
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ counts })
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "internal error", detail: String(e && e.message || e) })
    };
  }
};
