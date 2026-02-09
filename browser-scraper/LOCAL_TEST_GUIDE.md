# Quick Local Testing Guide

## Start the Server

```bash
cd browser-scraper
npm run dev
```

You should see:

```
Browser scraper service running on port 8080
Health check: http://localhost:8080/health
```

## Run the Test Suite

**In a new terminal:**

```bash
cd browser-scraper
npm test
```

Expected output:

```
╔════════════════════════════════════════╗
║   Browser Scraper Local Test Suite   ║
╚════════════════════════════════════════╝

=== Testing Health Check ===
✓ Health check passed
  Timestamp: 2024-01-01T12:00:00.000Z

=== Testing STUBHUB Scrape ===
URL: https://www.stubhub.com/...
✓ Scrape successful
  Duration: 8234ms
  Title: The Eagles Tickets | StubHub
  HTML Length: 245,678 bytes
  Scraped At: 2024-01-01T12:00:00.000Z
  Indicators:
    ✓ Has price data
    ✓ Has JSON data
    ✓ Has event info
    ✓ Not blocked

╔════════════════════════════════════════╗
║           Test Summary                ║
╚════════════════════════════════════════╝

Tests Passed: 1/1
Average Duration: 8234ms

✓ All tests passed! Browser scraper is working correctly.
```

## Connect to Your Main App

### 1. Set Environment Variable

```bash
# In your main project root (not browser-scraper)
echo "BROWSER_SCRAPER_URL=http://localhost:8080" >> .dev.vars
```

### 2. Restart Your Main App

```bash
# In your main project root
pnpm run dev
```

### 3. Test It

1. Navigate to `http://localhost:5173/add`
2. Paste a StubHub event URL
3. Submit the form
4. Watch the browser-scraper terminal - you should see scraping logs!

## Quick Manual Tests

### Health Check

```bash
curl http://localhost:8080/health
```

### Scrape a URL

```bash
curl -X POST http://localhost:8080/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.stubhub.com/the-eagles-las-vegas-tickets-3-20-2026/event/159831948/"
  }'
```

### Extract Prices (Advanced)

```bash
curl -X POST http://localhost:8080/extract \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.stubhub.com/the-eagles-las-vegas-tickets-3-20-2026/event/159831948/",
    "extractorFunction": "() => { return Array.from(document.querySelectorAll(\".price\")).map(el => el.textContent).slice(0, 5); }"
  }'
```

## Troubleshooting

### "ECONNREFUSED" error

→ Server not running. Run `npm run dev` in the browser-scraper directory.

### "Port 8080 already in use"

```bash
# Kill the process
lsof -ti:8080 | xargs kill -9

# Then restart
npm run dev
```

### Timeout errors

- Default timeout is 30 seconds
- Some pages take longer - increase timeout in request:

```bash
curl -X POST http://localhost:8080/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "...", "timeout": 60000}'
```

## Next Steps

Once everything works locally:

1. Test with multiple different event URLs
2. Monitor performance and memory usage
3. When ready, deploy to GCP: `npm run deploy`

See `LOCAL_SETUP.md` for detailed documentation.
