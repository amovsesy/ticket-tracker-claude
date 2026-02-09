# 🚀 Browser Scraper - Start Here

Your local browser scraper is ready to use! This guide will get you up and running in 2 minutes.

## What This Is

A Puppeteer-powered headless browser service that renders JavaScript-heavy sites like StubHub, Ticketmaster, and SeatGeek. Without this, bot detection will block your scrapers.

## Quick Start (2 minutes)

### Step 1: Start the Scraper

```bash
cd browser-scraper
npm run dev
```

Wait for: `Browser scraper service running on port 8080`

### Step 2: Test It (Optional)

```bash
# In a new terminal
cd browser-scraper
npm test
```

You should see green checkmarks ✓ if everything works.

### Step 3: Connect Your Main App

```bash
# In your main project root
echo "BROWSER_SCRAPER_URL=http://localhost:8080" >> .dev.vars

# Start your main app
pnpm run dev
```

### Step 4: Try It Out

1. Go to `http://localhost:5173/add` (or your dev server port)
2. Add a StubHub event URL
3. Watch the scraper terminal - you'll see it working!

## That's It! 🎉

Your app now uses the local browser scraper instead of direct HTTP requests.

---

## What's Included

📁 **Files Created:**

- `index.js` - Main server (already existed)
- `test.js` - Automated test suite ✨ NEW
- `package.json` - Updated with test scripts ✨ UPDATED
- `.env.example` - Configuration template ✨ NEW
- `LOCAL_SETUP.md` - Detailed setup guide ✨ NEW
- `LOCAL_TEST_GUIDE.md` - Quick testing guide ✨ NEW
- `START_HERE.md` - This file ✨ NEW

📦 **Dependencies:**

- express - Web server
- puppeteer - Headless Chrome
- node-fetch - For testing

🛠️ **New Commands:**

```bash
npm run dev        # Start with auto-reload
npm test           # Run test suite
npm run test:watch # Run tests on file changes
npm run deploy     # Deploy to GCP (when ready)
```

---

## API Endpoints

### GET /health

Health check endpoint

```bash
curl http://localhost:8080/health
```

### POST /scrape

Scrape a URL and return full HTML

```bash
curl -X POST http://localhost:8080/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.stubhub.com/event/123"}'
```

**Request body:**

```json
{
	"url": "https://...", // Required
	"waitForSelector": ".price", // Optional
	"timeout": 30000 // Optional (ms)
}
```

**Response:**

```json
{
	"success": true,
	"html": "<!DOCTYPE html>...",
	"title": "Event Name | StubHub",
	"url": "https://...",
	"length": 245678,
	"scrapedAt": "2024-01-01T12:00:00.000Z"
}
```

### POST /extract

Execute custom JavaScript in the browser

```bash
curl -X POST http://localhost:8080/extract \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.stubhub.com/event/123",
    "extractorFunction": "() => { return document.querySelectorAll(\".price\").length; }"
  }'
```

**Response:**

```json
{
	"success": true,
	"data": 42,
	"url": "https://..."
}
```

---

## How It Works

1. Your main app calls `BROWSER_SCRAPER_URL/scrape` with a URL
2. Puppeteer launches headless Chrome
3. Navigates to the URL and waits for JavaScript to render
4. Returns the fully rendered HTML
5. Your app parses the HTML to extract prices

**Why is this needed?**

- Sites like StubHub use Cloudflare bot protection
- They render content with JavaScript (React/Next.js)
- Direct HTTP requests get blocked or return empty pages
- Puppeteer bypasses this by using a real browser

---

## Performance

**Local (your machine):**

- First request: ~8-15 seconds (Chrome startup)
- Subsequent requests: ~5-10 seconds
- Memory: ~200-400MB per instance

**GCP Cloud Run (after deployment):**

- Cold start: ~10-20 seconds
- Warm: ~5-10 seconds
- Auto-scales 0-5 instances
- Cost: ~$0-5/month (within free tier)

---

## Troubleshooting

### Server won't start

```bash
# Check if port 8080 is in use
lsof -ti:8080 | xargs kill -9

# Try again
npm run dev
```

### Tests fail with ECONNREFUSED

Make sure server is running in another terminal:

```bash
# Terminal 1
npm run dev

# Terminal 2
npm test
```

### Puppeteer installation failed

```bash
# Reinstall
rm -rf node_modules
npm install
```

### Main app not using scraper

Check `.dev.vars` has:

```bash
BROWSER_SCRAPER_URL=http://localhost:8080
```

Then restart your main app.

---

## Next Steps

### 1. Test Locally (Do This First!)

- Start the scraper: `npm run dev`
- Run tests: `npm test`
- Try different StubHub URLs
- Monitor performance and errors

### 2. Enhance (Optional)

See `/docs/BROWSER_SCRAPER_ENHANCEMENTS.md` for ideas:

- Add stealth mode to avoid detection
- Implement request caching
- Add rate limiting
- Create platform-specific extractors

### 3. Deploy to GCP (When Ready)

```bash
# Make sure everything works locally first!
npm run deploy
```

See `DEPLOYMENT_GUIDE.md` for full deployment instructions.

---

## Getting Help

📖 **Documentation:**

- `LOCAL_SETUP.md` - Detailed local setup guide
- `LOCAL_TEST_GUIDE.md` - Quick testing guide
- `README.md` - API documentation
- `DEPLOYMENT_GUIDE.md` - GCP deployment guide
- `QUICK_START.md` - Fast GCP deployment

🐛 **Common Issues:**

- Check server logs for errors
- Ensure port 8080 is available
- Verify Puppeteer installed correctly
- Test health endpoint first: `curl http://localhost:8080/health`

💡 **Tips:**

- Keep server running while developing
- Use `npm run test:watch` to test on changes
- Monitor memory usage with Activity Monitor
- Check scraper logs to see what's happening

---

## Project Structure

```
browser-scraper/
├── START_HERE.md          ← You are here
├── LOCAL_SETUP.md         ← Detailed setup guide
├── LOCAL_TEST_GUIDE.md    ← Quick testing guide
├── index.js               ← Main server code
├── test.js                ← Test suite
├── package.json           ← Dependencies & scripts
├── Dockerfile             ← For GCP deployment
├── README.md              ← API documentation
├── DEPLOYMENT_GUIDE.md    ← GCP deployment guide
└── QUICK_START.md         ← Fast GCP deployment
```

---

## You're All Set! 🎉

Your browser scraper is configured and ready to use locally.

**To start using it:**

1. Run `npm run dev` in this directory
2. Set `BROWSER_SCRAPER_URL=http://localhost:8080` in your main app
3. Start testing!

When you're ready to deploy to production, run `npm run deploy`.

Questions? Check the documentation files or review the server logs for detailed error messages.

Happy scraping! 🚀
