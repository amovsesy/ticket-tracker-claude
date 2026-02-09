# Browser Scraper Service

Headless browser scraping service using Puppeteer, deployed to GCP Cloud Run.

## Features

- Full JavaScript rendering with Puppeteer
- Handles dynamic content (SPAs like StubHub, Ticketmaster)
- Auto-scales from 0 to 5 instances
- ~$0-5/month for typical usage (within GCP free tier)

## Local Development

```bash
# Install dependencies
npm install

# Start server
npm run dev

# Test endpoint
curl -X POST http://localhost:8080/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.stubhub.com/some-event"}'
```

## Deployment to GCP Cloud Run

### Prerequisites

1. Install Google Cloud SDK:

```bash
# macOS
brew install --cask google-cloud-sdk

# Or download from: https://cloud.google.com/sdk/docs/install
```

2. Login and set project:

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

3. Enable required APIs:

```bash
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### Deploy

```bash
# From browser-scraper directory
npm run deploy

# Or manually:
gcloud run deploy browser-scraper \
  --source . \
  --region us-central1 \
  --memory 1Gi \
  --cpu 1 \
  --timeout 30s \
  --min-instances 0 \
  --max-instances 5 \
  --allow-unauthenticated
```

After deployment, you'll get a URL like:

```
https://browser-scraper-XXXXX-uc.a.run.app
```

Save this URL to your main app's environment variables:

```bash
# In your main app's .dev.vars or .env
BROWSER_SCRAPER_URL=https://browser-scraper-XXXXX-uc.a.run.app
```

## API Endpoints

### POST /scrape

Scrape a URL and return fully rendered HTML.

**Request:**

```json
{
	"url": "https://www.stubhub.com/event/123456",
	"waitForSelector": "[data-testid='listing']", // Optional
	"timeout": 30000 // Optional, default 30s
}
```

**Response:**

```json
{
	"success": true,
	"html": "<!DOCTYPE html>...",
	"title": "Event Name | StubHub",
	"url": "https://www.stubhub.com/event/123456",
	"length": 245678,
	"scrapedAt": "2024-01-01T12:00:00.000Z"
}
```

### POST /extract

Execute custom JavaScript in the browser to extract structured data.

**Request:**

```json
{
	"url": "https://www.stubhub.com/event/123456",
	"extractorFunction": "() => { return Array.from(document.querySelectorAll('.price')).map(el => el.textContent); }"
}
```

**Response:**

```json
{
	"success": true,
	"data": ["$125.00", "$150.00", "$200.00"],
	"url": "https://www.stubhub.com/event/123456"
}
```

### GET /health

Health check endpoint.

**Response:**

```json
{
	"status": "healthy",
	"timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Cost Estimates

**GCP Cloud Run Free Tier:**

- 2M requests/month
- 360k GB-seconds/month
- 180k vCPU-seconds/month

**Typical usage (100k scrapes/month @ 10s each):**

- Requests: 100k (well under 2M limit)
- Compute: ~100k scrapes × 1GB × 10s = 1M GB-seconds (under 360k limit after first ~36k scrapes)
- **Cost: $0-5/month**

**At scale (1M scrapes/month):**

- **Cost: ~$40-50/month**

## Monitoring

View logs:

```bash
gcloud run logs read browser-scraper --region us-central1
```

View metrics:

```bash
# Open in browser
gcloud run services describe browser-scraper --region us-central1 --format="value(status.url)"
```

## Troubleshooting

**Out of Memory errors:**

```bash
# Increase memory
gcloud run deploy browser-scraper --memory 2Gi --region us-central1
```

**Timeout errors:**

```bash
# Increase timeout
gcloud run deploy browser-scraper --timeout 60s --region us-central1
```

**Cold start issues:**

```bash
# Keep 1 instance always warm
gcloud run deploy browser-scraper --min-instances 1 --region us-central1
# Note: This will increase costs (~$5/month for 1 always-on instance)
```

## Security Considerations

- Currently allows unauthenticated requests (`--allow-unauthenticated`)
- For production, add authentication:
  ```bash
  gcloud run deploy browser-scraper --no-allow-unauthenticated
  ```
- Then use IAM tokens or API keys to authenticate requests
- Consider rate limiting to prevent abuse
