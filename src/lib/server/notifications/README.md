# Notification System

Complete email and SMS notification system for price drop alerts.

## Architecture

```
notificationManager.ts
├── email/
│   ├── templates.ts    - HTML email templates
│   └── sender.ts       - Resend email integration
└── sms/
    └── sender.ts       - Plivo SMS integration
```

## Email Notifications (Resend)

### Setup

1. Sign up for Resend at https://resend.com
2. Add your domain and verify it
3. Generate an API key
4. Add to `.dev.vars` for local development:
   ```
   RESEND_API_KEY=re_xxxxx
   ```
5. Add to Cloudflare Workers secrets for production:
   ```bash
   wrangler secret put RESEND_API_KEY
   ```

### Templates

Two email templates available:

1. **Price Drop Alert** - Individual price drop notification
   - Beautiful gradient design
   - Shows old/new prices with percentage savings
   - Clear call-to-action button
   - Event details (venue, date, section)

2. **Daily Digest** - Summary of all price changes
   - Table format showing multiple events
   - Price comparisons with savings

### Usage

```typescript
import { sendPriceDropEmail } from '$lib/server/notifications/email/sender';

await sendPriceDropEmail({
	to: 'user@example.com',
	userName: 'John',
	eventName: 'Taylor Swift | The Eras Tour',
	venue: 'BC Place, Vancouver',
	date: 'Dec 08, 2026',
	oldPrice: 450,
	newPrice: 389,
	targetPrice: 400,
	section: 'Floor Section A',
	eventUrl: 'https://pricetracker.com/events/123',
	percentageChange: -13.6
});
```

## SMS Notifications (Plivo)

### Setup

1. Sign up for Plivo at https://www.plivo.com
2. Purchase a phone number
3. Get your Auth ID and Auth Token
4. Add to `.dev.vars`:
   ```
   PLIVO_AUTH_ID=your_auth_id
   PLIVO_AUTH_TOKEN=your_auth_token
   PLIVO_PHONE_NUMBER=+1234567890
   ```
5. Add to Cloudflare Workers secrets:
   ```bash
   wrangler secret put PLIVO_AUTH_ID
   wrangler secret put PLIVO_AUTH_TOKEN
   wrangler secret put PLIVO_PHONE_NUMBER
   ```

### Format

SMS messages are automatically formatted for brevity:

```
🎉 Price Alert! Taylor Swift | The Eras Tour dropped to $389 (Target: $400). View: https://pricetracker.com/events/123
```

### Usage

```typescript
import { sendPriceDropSMS } from '$lib/server/notifications/sms/sender';

await sendPriceDropSMS({
	to: '+12345678901',
	eventName: 'Taylor Swift | The Eras Tour',
	newPrice: 389,
	targetPrice: 400,
	eventUrl: 'https://pricetracker.com/events/123'
});
```

### Phone Number Formatting

Automatic E.164 formatting for US/Canada numbers:

```typescript
import { formatPhoneNumber } from '$lib/server/notifications/sms/sender';

formatPhoneNumber('2345678901'); // -> '+12345678901'
formatPhoneNumber('12345678901'); // -> '+12345678901'
formatPhoneNumber('+12345678901'); // -> '+12345678901'
```

## Notification Manager

Central orchestration of all notifications.

### Features

- Respects user notification preferences (email/SMS toggles)
- Sends to multiple channels simultaneously
- Logs all notifications to database
- Error handling and retry logic
- Returns detailed status report

### Usage

```typescript
import { sendPriceDropNotification } from '$lib/server/notifications/notificationManager';
import { getDb } from '$lib/server/db';

const db = getDb(platform.env.DB);

const result = await sendPriceDropNotification(
	db,
	{
		user: {
			id: 1,
			email: 'user@example.com',
			phone: '+12345678901',
			emailNotifications: true,
			smsNotifications: true
		},
		event: {
			id: 123,
			name: 'Taylor Swift | The Eras Tour',
			venue: 'BC Place, Vancouver',
			date: new Date('2026-12-08')
		},
		trackedEvent: {
			id: 456,
			userId: 1,
			eventId: 123,
			targetPrice: 400,
			section: 'Floor Section A'
		},
		oldPrice: 450,
		newPrice: 389,
		percentageChange: -13.6,
		eventUrl: 'https://pricetracker.com/events/123'
	},
	{ RESEND_API_KEY: platform.env.RESEND_API_KEY }
);

// Result: { emailSent: true, smsSent: true, errors: [] }
```

## Integration with Price Checking

Notifications are automatically sent by the cron job when:

1. Price drops below user's target price
2. Price drops >10% from previous check
3. Tracking is active and not paused
4. At least 24 hours since last notification

See `/api/cron/check-prices` for implementation.

## Database Logging

All notifications are logged to the `notifications` table:

```sql
INSERT INTO notifications (
  user_id,
  tracked_event_id,
  type,           -- 'email' or 'sms'
  recipient,      -- email address or phone number
  subject,        -- email subject (null for SMS)
  message,        -- notification content
  was_successful, -- true/false
  error_message   -- error details if failed
) VALUES (...);
```

## Testing

### Local Testing

```bash
# Test email sending
curl -X POST http://localhost:8788/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.stubhub.com/event/..."}'

# Then check logs for notification status
```

### Manual Testing

Create a test endpoint:

```typescript
// src/routes/api/test-notification/+server.ts
import { sendPriceDropEmail } from '$lib/server/notifications/email/sender';

export async function GET({ platform }) {
	const result = await sendPriceDropEmail(
		{
			to: 'your-email@example.com',
			userName: 'Test User',
			eventName: 'Test Event',
			venue: 'Test Venue',
			date: new Date().toLocaleString(),
			newPrice: 100,
			targetPrice: 150
		},
		platform?.env?.RESEND_API_KEY
	);

	return json(result);
}
```

## Cost Estimates

### Resend

- Free tier: 3,000 emails/month
- Paid: $20/month for 50,000 emails
- $0.0001 per email after

### Plivo

- SMS: $0.0079/SMS (US/Canada)
- $10 minimum balance
- ~1,265 SMS per $10

### Typical Usage

For 1,000 active users tracking 3 events each:

- ~100 price drop notifications/day
- ~3,000 emails/month (within free tier)
- ~$24/month for SMS if all users opt in

## Monitoring

Check notification success rates:

```sql
-- Email success rate
SELECT
  COUNT(*) FILTER (WHERE was_successful) * 100.0 / COUNT(*) as success_rate
FROM notifications
WHERE type = 'email'
AND sent_at > datetime('now', '-7 days');

-- Failed notifications
SELECT *
FROM notifications
WHERE was_successful = false
ORDER BY sent_at DESC
LIMIT 10;
```

## Troubleshooting

### Email Not Sending

1. Check Resend dashboard for errors
2. Verify domain is verified in Resend
3. Check API key is correct
4. Review Cloudflare Worker logs

### SMS Not Sending

1. Check Plivo dashboard for errors
2. Verify phone number is active
3. Verify auth credentials
4. Check phone number format (E.164)
5. Verify sufficient Plivo balance

### Rate Limiting

Both services have rate limits:

- Resend: 1,000 requests/second
- Plivo: 1,000 requests/minute

The cron job processes events sequentially to stay within limits.
