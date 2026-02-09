# GCP Cloud Run Deployment Guide

Step-by-step guide to deploy the browser scraper service to Google Cloud Platform.

## Prerequisites

- Google account
- Credit card (for GCP, but free tier covers most usage)
- Terminal access

---

## Step 1: Install Google Cloud SDK

### macOS:

```bash
brew install --cask google-cloud-sdk
```

### Linux:

```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

### Windows:

Download from: https://cloud.google.com/sdk/docs/install

Verify installation:

```bash
gcloud --version
```

---

## Step 2: Set Up GCP Project

### 2.1 Login to Google Cloud:

```bash
gcloud auth login
```

This will open your browser for authentication.

### 2.2 Create a new project:

```bash
# Replace 'ticket-tracker-scraper' with your preferred project name
gcloud projects create ticket-tracker-scraper --name="Ticket Tracker Scraper"
```

### 2.3 Set as active project:

```bash
gcloud config set project ticket-tracker-scraper
```

### 2.4 Link billing account (required for Cloud Run):

```bash
# List available billing accounts
gcloud billing accounts list

# Link billing to project
gcloud billing projects link ticket-tracker-scraper \
  --billing-account=YOUR_BILLING_ACCOUNT_ID
```

**Note:** Even with billing enabled, the free tier covers:

- 2M requests/month
- 360k GB-seconds/month
- 180k vCPU-seconds/month

Your typical usage will be **$0-5/month**.

---

## Step 3: Enable Required APIs

```bash
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

This may take 1-2 minutes.

---

## Step 4: Deploy to Cloud Run

### 4.1 Navigate to browser-scraper directory:

```bash
cd browser-scraper
```

### 4.2 Deploy (first time):

```bash
gcloud run deploy browser-scraper \
  --source . \
  --region us-central1 \
  --memory 1Gi \
  --cpu 1 \
  --timeout 30s \
  --min-instances 0 \
  --max-instances 5 \
  --allow-unauthenticated \
  --platform managed
```

**What this does:**

- `--source .` - Builds from current directory
- `--region us-central1` - Deploys to US Central (cheapest)
- `--memory 1Gi` - 1GB RAM (enough for Puppeteer)
- `--timeout 30s` - Max 30 seconds per request
- `--min-instances 0` - Scales to zero when not in use
- `--max-instances 5` - Max 5 concurrent instances
- `--allow-unauthenticated` - Public access (no auth required)

**First deployment takes ~5-10 minutes** (building Docker image).

### 4.3 Note the service URL:

After deployment, you'll see output like:

```
Service URL: https://browser-scraper-xxxxx-uc.a.run.app
```

**Save this URL!** You'll need it for the next step.

---

## Step 5: Configure Your Main App

### 5.1 Update environment variables:

**For local development (.dev.vars):**

```bash
# In your main app directory (not browser-scraper)
echo "BROWSER_SCRAPER_URL=https://browser-scraper-xxxxx-uc.a.run.app" >> .dev.vars
```

**For production (Cloudflare):**

```bash
# Set Cloudflare Workers secret
wrangler secret put BROWSER_SCRAPER_URL
# When prompted, paste: https://browser-scraper-xxxxx-uc.a.run.app
```

---

## Step 6: Test the Service

### 6.1 Health check:

```bash
curl https://browser-scraper-xxxxx-uc.a.run.app/health
```

Expected response:

```json
{
	"status": "healthy",
	"timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 6.2 Test scraping:

```bash
curl -X POST https://browser-scraper-xxxxx-uc.a.run.app/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.stubhub.com/the-eagles-las-vegas-tickets-3-20-2026/event/159831948/"
  }'
```

Expected response (truncated):

```json
{
	"success": true,
	"html": "<!DOCTYPE html><html>...",
	"title": "The Eagles Tickets | StubHub",
	"url": "https://www.stubhub.com/...",
	"length": 245678,
	"scrapedAt": "2024-01-01T12:00:00.000Z"
}
```

### 6.3 Test from your main app:

```bash
# In your main app directory
pnpm run dev

# Then try scraping a StubHub URL
# It should now work!
```

---

## Step 7: Monitor Usage & Costs

### View logs:

```bash
gcloud run logs read browser-scraper --region us-central1 --limit 50
```

### View real-time logs:

```bash
gcloud run logs tail browser-scraper --region us-central1
```

### Check metrics (requests, latency, errors):

```bash
# Open in browser
gcloud run services describe browser-scraper \
  --region us-central1 \
  --format="value(status.url)"
```

Then go to: https://console.cloud.google.com/run/detail/us-central1/browser-scraper/metrics

### Check costs:

Go to: https://console.cloud.google.com/billing

**Typical costs for 100k scrapes/month: $0-5**

---

## Future Deployments (Updates)

After the initial setup, deployments are much faster:

```bash
cd browser-scraper
npm run deploy
```

Or manually:

```bash
gcloud run deploy browser-scraper \
  --source . \
  --region us-central1
```

Deployment takes ~2-3 minutes (just rebuilding the code, not the base image).

---

## Troubleshooting

### Out of Memory Errors:

```bash
# Increase memory to 2GB
gcloud run deploy browser-scraper --memory 2Gi --region us-central1
```

### Timeout Errors:

```bash
# Increase timeout to 60s
gcloud run deploy browser-scraper --timeout 60s --region us-central1
```

### Cold Start Issues:

```bash
# Keep 1 instance always warm (adds ~$5/month)
gcloud run deploy browser-scraper --min-instances 1 --region us-central1
```

### View Service Configuration:

```bash
gcloud run services describe browser-scraper --region us-central1
```

### Delete Service (cleanup):

```bash
gcloud run services delete browser-scraper --region us-central1
```

---

## Cost Optimization Tips

1. **Use free tier wisely**: 2M requests/month is plenty for early stage
2. **Scale to zero**: With `--min-instances 0`, you only pay when scraping
3. **Use smaller memory**: Start with 1GB, only increase if needed
4. **Monitor usage**: Set up billing alerts in GCP Console
5. **Use timeouts**: 30s timeout prevents hanging requests from racking up costs

---

## Security Recommendations

### For Production:

1. **Require authentication:**

```bash
gcloud run deploy browser-scraper --no-allow-unauthenticated --region us-central1
```

Then use IAM service account tokens to authenticate.

2. **Add rate limiting:**
   Install rate limiter in the Express app:

```bash
cd browser-scraper
npm install express-rate-limit
```

Update `index.js`:

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

3. **Set up alerts:**

- Go to GCP Console > Monitoring
- Create alert for high request volume
- Create alert for high error rate

---

## Next Steps

✅ Your browser scraper is now deployed!

**Test it out:**

1. Try scraping a StubHub URL from your main app
2. Monitor the logs to see it working
3. Check GCP billing after a day to see costs

**Need help?** Check the main README.md for API documentation.
