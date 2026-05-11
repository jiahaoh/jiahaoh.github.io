# Visits Worker

Small Cloudflare Worker backing the landing-page `/visits` command.

It stores only aggregate counts in KV:

- total views
- today's views, counted in UTC
- country-level counts from Cloudflare's `request.cf.country`
- last updated timestamp

It does not store IP addresses, user agents, referrers, or city-level location.
KV increments are approximate under concurrent traffic, which is fine for this
ambient display. Use D1 or a Durable Object if exact counters ever matter.

## Deploy

```bash
cd workers/visits
cp wrangler.toml.example wrangler.toml
wrangler kv namespace create VISITS_KV
```

Paste the created namespace id into `wrangler.toml`, then deploy:

```bash
wrangler deploy
```

After deploy, put the Worker URL into `_config.yml`:

```yaml
plain_visits_endpoint: https://jiahaoh-visits.your-subdomain.workers.dev
```

The same endpoint accepts `POST` pageview beacons and `GET` summary requests.
