# Local Development Setup

Quick guide to run and test the browser scraper locally before deploying to GCP.

## Prerequisites

- Node.js 18+ installed
- ~500MB free disk space for Puppeteer/Chrome

## Quick Start

```bash
# 1. Navigate to browser-scraper directory
cd browser-scraper

# 2. Install dependencies (if not already installed)
npm install

# 3. Start the server
npm run dev

# 4. In a new terminal, run tests
npm test
```

That's it! The scraper should be running on `http://localhost:8080`.

---

## Step-by-Step Guide

### 1. Install Dependencies

```bash
cd browser-scraper
npm install
```

This installs:

- **Express** - Web server
- **Puppeteer** - Headless Chrome browser
- **node-fetch** - For testing

First install takes ~2-3 minutes (downloads Chromium).

### 2. Start the Development Server

```bash
npm run dev
```

You should see:

```
Browser scraper service running on port 8080
Health check: http://localhost:8080/health
```

The `--watch` flag automatically restarts when you edit `index.js`.

### 3. Test the Server

**Option A: Run automated tests**

```bash
# In a new terminal
npm test
```

This runs the full test suite and shows:

- ✓ Health check status
- ✓ Scraping results for StubHub
- Performance metrics
- HTML content analysis

**Option B: Manual curl tests**

```bash
# Health check
curl http://localhost:8080/health

# Scrape a URL
curl -X POST http://localhost:8080/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.stubhub.com/the-eagles-las-vegas-tickets-3-20-2026/event/159831948/"}'
```

**Option C: Use with your main app**

```bash
# In your main app's .dev.vars file
echo "BROWSER_SCRAPER_URL=http://localhost:8080" >> ../.dev.vars

# Start your main app
cd ..
pnpm run dev

# Now try tracking a StubHub event - it will use your local scraper!
```

---

## Testing Different Scenarios

### Test Basic Scraping

```bash
npm test
```

### Test with Custom URL

```javascript
// Edit test.js and change TEST_URLS.stubhub to your desired URL
const TEST_URLS = {
  stubhub: 'https://www.stubhub.com/your-event-url-here'
};

npm test
```

### Test Extract Endpoint

```bash
curl -X POST http://localhost:8080/extract \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.stubhub.com/event/123",
    "extractorFunction": "() => { return document.querySelectorAll(\".price\").length; }"
  }'
```

---

## Troubleshooting

### Port Already in Use

```bash
# Change port in index.js or set environment variable
PORT=8081 npm run dev
```

### Puppeteer Installation Issues

```bash
# macOS - Install Chromium dependencies
brew install chromium

# Linux - Install dependencies
sudo apt-get install -y \
  ca-certificates fonts-liberation \
  libappindicator3-1 libasound2 libatk-bridge2.0-0 \
  libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
  libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 \
  libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 \
  libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 \
  libxcb1 libxcomposite1 libxcursor1 libxdamage1 \
  libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 \
  libxss1 libxtst6 lsb-release wget xdg-utils
```

### Memory Issues

```bash
# Reduce concurrent requests in index.js
# Or run with more memory:
NODE_OPTIONS="--max-old-space-size=4096" npm run dev
```

### Timeout Errors

```bash
# Increase timeout in test
curl -X POST http://localhost:8080/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://...", "timeout": 60000}'
```

---

## Performance Tips

### Speed Up Local Testing

1. **Reduce timeout**: Default is 30s, you can use 15s for fast sites
2. **Skip images**: Add `args: ['--blink-settings=imagesEnabled=false']` to Puppeteer launch
3. **Use caching**: Test same URL multiple times to see cached results

### Monitor Performance

```bash
# Watch server logs in real-time
npm run dev

# In another terminal
npm test

# Check output for:
# - Request duration
# - HTML size
# - Memory usage
```

---

## Integration with Main App

### 1. Set Environment Variable

```bash
# In your main app's .dev.vars
BROWSER_SCRAPER_URL=http://localhost:8080
```

### 2. Restart Main App

```bash
cd ..
pnpm run dev
```

### 3. Test Scraping

1. Go to `http://localhost:5173/add` (or your dev port)
2. Add a StubHub event URL
3. Check the server logs - you should see:
   ```
   [2024-01-01T12:00:00.000Z] Scraping: https://www.stubhub.com/...
   [2024-01-01T12:00:10.000Z] Success: https://www.stubhub.com/... (245678 bytes)
   ```

---

## Next Steps

Once local testing is working:

1. **Test with real events**: Try multiple StubHub URLs to ensure reliability
2. **Check error handling**: Test with invalid URLs to see error responses
3. **Monitor performance**: Ensure scrapes complete in <30 seconds
4. **Deploy to GCP**: When ready, run `npm run deploy`

---

## Development Workflow

```bash
# Terminal 1: Run server with auto-reload
npm run dev

# Terminal 2: Run tests on changes
npm run test:watch

# Terminal 3: Manually test endpoints
curl http://localhost:8080/health
```

---

## File Structure

```
browser-scraper/
├── index.js              # Main server code
├── test.js              # Automated test suite
├── package.json         # Dependencies and scripts
├── Dockerfile           # For GCP deployment
├── .env.example         # Example configuration
├── LOCAL_SETUP.md       # This file
├── README.md            # General documentation
├── DEPLOYMENT_GUIDE.md  # GCP deployment guide
└── QUICK_START.md       # Quick GCP deployment
```

---

## Common Issues & Solutions

### "Cannot find module 'node-fetch'"

```bash
npm install node-fetch
```

### "Port 8080 is already in use"

```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9

# Or use a different port
PORT=8081 npm run dev
```

### "Browser scraper returned 500"

- Check server logs in Terminal 1
- Ensure Puppeteer installed correctly: `npm install puppeteer`
- Try restarting the server

### Tests fail with "ECONNREFUSED"

- Make sure server is running: `npm run dev`
- Check server is on correct port: `http://localhost:8080/health`

---

## Need Help?

- Check server logs for detailed error messages
- Try the example curl commands above
- Review `README.md` for API documentation
- Check `DEPLOYMENT_GUIDE.md` for production setup
