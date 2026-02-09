# Price Check Cron Endpoint

This endpoint is triggered automatically by Cloudflare Cron Triggers every 15 minutes.

## Configuration

The cron schedule is configured in `wrangler.jsonc`:

```jsonc
"triggers": {
  "crons": ["*/15 * * * *"]  // Every 15 minutes
}
```

## How It Works

1. **Cron Trigger**: Cloudflare automatically calls this endpoint every 15 minutes
2. **Fetch Active Events**: Gets all active, non-paused tracked events
3. **Check Tier**: Determines scraping frequency based on user tier:
   - Free: Every 15 minutes
   - Pro: Every 1 minute
4. **Scrape Prices**: For each platform source, scrapes current prices
5. **Compare Prices**: Compares with previous prices
6. **Queue Notifications**: If price drops below target or drops significantly
7. **Store History**: Saves price history for trending

## Testing Locally

You can test the endpoint manually:

```bash
# With wrangler dev
curl http://localhost:8788/api/cron/check-prices

# Or visit in browser
open http://localhost:8788/api/cron/check-prices
```

## Testing Cron Triggers Locally

Cloudflare Workers supports testing scheduled events locally:

```bash
# Start dev server with scheduled event testing
pnpm run dev -- --test-scheduled

# Then trigger the cron manually
curl http://localhost:8788/__scheduled
```

## Response Format

```json
{
	"success": true,
	"result": {
		"checked": 10,
		"updated": 8,
		"notificationsQueued": 2,
		"errors": 0
	},
	"timestamp": "2026-02-06T10:30:00.000Z"
}
```

## Deployment

Once deployed to Cloudflare, the cron will run automatically. You can view cron logs in the Cloudflare dashboard under Workers > Your Worker > Logs.

## Monitoring

- Check Cloudflare dashboard for cron execution logs
- Monitor error rates in Sentry
- Review `scraping_logs` table for scraping failures
