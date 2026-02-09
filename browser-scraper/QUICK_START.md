# Quick Start - 5 Minute Setup

Get your browser scraper running on GCP in 5 minutes.

## TL;DR

```bash
# 1. Install gcloud CLI
brew install --cask google-cloud-sdk  # macOS
# Or: https://cloud.google.com/sdk/docs/install

# 2. Login
gcloud auth login

# 3. Create project
gcloud projects create ticket-scraper-$(date +%s) --name="Ticket Scraper"
gcloud config set project ticket-scraper-XXXXX  # Use actual project ID from above

# 4. Enable billing (required, but free tier covers ~100k scrapes/month)
gcloud billing accounts list
gcloud billing projects link ticket-scraper-XXXXX --billing-account=BILLING_ACCOUNT_ID

# 5. Enable APIs
gcloud services enable run.googleapis.com cloudbuild.googleapis.com

# 6. Deploy (from browser-scraper directory)
cd browser-scraper
gcloud run deploy browser-scraper \
  --source . \
  --region us-central1 \
  --memory 1Gi \
  --timeout 30s \
  --min-instances 0 \
  --max-instances 5 \
  --allow-unauthenticated

# 7. Save the URL that's returned
# Example: https://browser-scraper-abc123-uc.a.run.app

# 8. Add to your app's environment
cd ..
echo "BROWSER_SCRAPER_URL=https://browser-scraper-abc123-uc.a.run.app" >> .dev.vars

# 9. Test it!
pnpm run dev
# Now try scraping a StubHub URL - it should work!
```

## That's it!

**First deployment:** ~10 minutes (Docker build)
**Future deployments:** ~2 minutes (code updates only)

**Cost:** ~$0-5/month for typical usage (within GCP free tier)

---

## Test Your Deployment

```bash
# Health check
curl https://your-url-here.run.app/health

# Test scrape
curl -X POST https://your-url-here.run.app/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.stubhub.com/some-event"}'
```

---

## Need More Details?

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for:

- Detailed step-by-step instructions
- Troubleshooting guide
- Cost optimization tips
- Security recommendations
- Monitoring setup

---

## Common Issues

**"Billing must be enabled":**

```bash
gcloud billing projects link YOUR_PROJECT_ID --billing-account=BILLING_ACCOUNT_ID
```

**Deployment timeout:**
First deployment can take 5-10 minutes. Be patient!

**"Permission denied":**

```bash
gcloud auth login
gcloud auth application-default login
```

**Can't find project ID:**

```bash
gcloud projects list
```
