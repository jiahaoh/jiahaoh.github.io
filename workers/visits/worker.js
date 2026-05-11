const COUNTRY_NAMES = {
  AE: "United Arab Emirates",
  AR: "Argentina",
  AT: "Austria",
  AU: "Australia",
  BE: "Belgium",
  BR: "Brazil",
  CA: "Canada",
  CH: "Switzerland",
  CL: "Chile",
  CN: "China",
  CO: "Colombia",
  CZ: "Czechia",
  DE: "Germany",
  DK: "Denmark",
  EG: "Egypt",
  ES: "Spain",
  FI: "Finland",
  FR: "France",
  GB: "United Kingdom",
  HK: "Hong Kong",
  ID: "Indonesia",
  IE: "Ireland",
  IL: "Israel",
  IN: "India",
  IT: "Italy",
  JP: "Japan",
  KE: "Kenya",
  KR: "South Korea",
  MX: "Mexico",
  MY: "Malaysia",
  NG: "Nigeria",
  NL: "Netherlands",
  NO: "Norway",
  NZ: "New Zealand",
  PH: "Philippines",
  PL: "Poland",
  PT: "Portugal",
  RU: "Russia",
  SA: "Saudi Arabia",
  SE: "Sweden",
  SG: "Singapore",
  TH: "Thailand",
  TR: "Turkey",
  TW: "Taiwan",
  US: "United States",
  VN: "Vietnam",
  ZA: "South Africa",
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(request, env) });
    }

    if (!isAllowedOrigin(request, env)) {
      return json({ error: "origin not allowed" }, 403, request, env);
    }

    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return json({ ok: true }, 200, request, env);
    }

    if (!env.VISITS_KV) {
      return json({ error: "VISITS_KV binding is missing" }, 500, request, env);
    }

    if (request.method === "POST") {
      return recordVisit(request, env);
    }

    if (request.method === "GET") {
      return visitSummary(request, env);
    }

    return json({ error: "method not allowed" }, 405, request, env);
  },
};

async function recordVisit(request, env) {
  const now = new Date();
  const day = now.toISOString().slice(0, 10);
  const siteKey = env.SITE_KEY || "jiahaoh";
  const countryCode = cleanCountryCode(request.cf && request.cf.country);
  const countryName = countryLabel(countryCode);

  await Promise.all([
    increment(env.VISITS_KV, `${siteKey}:total`),
    increment(env.VISITS_KV, `${siteKey}:day:${day}`),
    increment(env.VISITS_KV, `${siteKey}:country:${countryCode}`),
    env.VISITS_KV.put(`${siteKey}:lastUpdated`, now.toISOString()),
  ]);

  return json({ ok: true, country: countryCode, name: countryName }, 200, request, env);
}

async function visitSummary(request, env) {
  const today = new Date().toISOString().slice(0, 10);
  const siteKey = env.SITE_KEY || "jiahaoh";
  const countryPrefix = `${siteKey}:country:`;
  const countryList = await env.VISITS_KV.list({ prefix: countryPrefix });
  const countries = await Promise.all(
    countryList.keys.map(async (item) => {
      const code = item.name.replace(countryPrefix, "");
      return {
        code,
        name: countryLabel(code),
        count: numberValue(await env.VISITS_KV.get(item.name)),
      };
    })
  );

  countries.sort((a, b) => b.count - a.count);

  const [total, todayViews, lastUpdated] = await Promise.all([
    env.VISITS_KV.get(`${siteKey}:total`),
    env.VISITS_KV.get(`${siteKey}:day:${today}`),
    env.VISITS_KV.get(`${siteKey}:lastUpdated`),
  ]);

  return json(
    {
      mode: "live",
      total: numberValue(total),
      today: numberValue(todayViews),
      regions: countries.length,
      lastUpdated: lastUpdated || new Date().toISOString(),
      countries,
    },
    200,
    request,
    env
  );
}

async function increment(kv, key) {
  const next = numberValue(await kv.get(key)) + 1;
  await kv.put(key, String(next));
  return next;
}

function cleanCountryCode(value) {
  const code = (value || "XX").toString().trim().toUpperCase();
  return /^[A-Z]{2}$/.test(code) ? code : "XX";
}

function countryLabel(code) {
  if (!code || code === "XX") return "Unknown";
  return COUNTRY_NAMES[code] || code;
}

function numberValue(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function json(payload, status, request, env) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders(request, env),
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function corsHeaders(request, env) {
  const origin = request.headers.get("origin");
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  const allowOrigin = !origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin) ? origin || "*" : allowedOrigins[0] || "*";

  return {
    "access-control-allow-origin": allowOrigin,
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    vary: "Origin",
  };
}

function isAllowedOrigin(request, env) {
  const origin = request.headers.get("origin");
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);

  return !origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin);
}

function parseAllowedOrigins(value) {
  return (value || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}
