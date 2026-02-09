# Feature Flags with Statsig

SMS notifications and other premium features are controlled via Statsig feature flags.

## Setup

### 1. Statsig Account

1. Sign up at https://statsig.com
2. Create a new project
3. Get your API keys:
   - **Client SDK Key** - Used in browser (already configured)
   - **Server Secret Key** - Used in Workers/backend

### 2. Environment Configuration

Add to `.dev.vars` for local development:

```bash
# Client-side (already configured)
PUBLIC_STATSIG_SDK_KEY=client-xxxxx
PUBLIC_STATSIG_TIER=development

# Server-side (NEW)
STATSIG_SERVER_KEY=secret-xxxxx
```

Add to Cloudflare Workers secrets:

```bash
wrangler secret put STATSIG_SERVER_KEY
# Paste your server secret key when prompted
```

### 3. Create Feature Gates in Statsig Dashboard

Go to **Feature Gates** in Statsig dashboard and create:

#### `sms_notifications_enabled`

**Purpose**: Control SMS notification rollout

**Configuration**:

- **Enabled**: true/false globally
- **Targeting Rules** (examples):
  ```
  - userID in ["user123", "user456"]  // Specific users
  - OR email ends with "@pricetracker.com"  // Internal team
  - OR custom.tier == "pro"  // Pro users only
  ```

**Rollout Strategy**:

1. Start: 0% enabled (disabled for all)
2. Internal: Enable for team emails
3. Beta: 10% rollout to pro users
4. Gradual: 25% → 50% → 100%

#### `daily_digest_enabled` (Future)

**Purpose**: Enable daily digest emails

**Configuration**:

- Enable for users with `emailNotifications: true`

#### `premium_features_enabled` (Future)

**Purpose**: Control access to pro-tier features

**Configuration**:

- Enable for `custom.tier == "pro"`

## Usage

### Server-Side (Worker/API Routes)

```typescript
import { initializeStatsig, checkFeatureGate, FeatureFlags } from '$lib/server/statsig';

// Initialize once (in cron job or API handler)
await initializeStatsig(platform?.env?.STATSIG_SERVER_KEY);

// Check feature flag
const smsEnabled = checkFeatureGate(
  FeatureFlags.SMS_NOTIFICATIONS,
  userId.toString()
);

if (smsEnabled) {
  await sendSMS(...);
}
```

### Available Functions

```typescript
// Initialize Statsig (call once per Worker execution)
await initializeStatsig(apiKey?: string): Promise<void>

// Check if a feature is enabled for a user
checkFeatureGate(
  gateName: string,
  userId: string,
  customIds?: Record<string, string>
): boolean

// Get dynamic config value
getDynamicConfig(
  configName: string,
  userId: string,
  customIds?: Record<string, string>
): any

// Log custom event
logEvent(
  eventName: string,
  userId: string,
  value?: string | number,
  metadata?: Record<string, any>
): void

// Shutdown (cleanup)
await shutdownStatsig(): Promise<void>
```

### Feature Flag Constants

```typescript
export const FeatureFlags = {
	SMS_NOTIFICATIONS: 'sms_notifications_enabled',
	DAILY_DIGEST: 'daily_digest_enabled',
	PREMIUM_FEATURES: 'premium_features_enabled'
} as const;
```

## How SMS Feature Flag Works

### In Notification Manager

```typescript
// Check if SMS is enabled for this user
const smsEnabled = checkFeatureGate(
  FeatureFlags.SMS_NOTIFICATIONS,
  data.user.id.toString()
);

if (!smsEnabled) {
  console.log(`SMS disabled by feature flag for user ${data.user.id}`);
  smsSkipped = true;
  // SMS not sent, but no error logged
} else {
  // Send SMS normally
  await sendPriceDropSMS(...);
}
```

### Response

The notification result includes `smsSkipped` flag:

```typescript
{
  emailSent: true,
  smsSent: false,
  smsSkipped: true,  // Feature flag disabled
  errors: []
}
```

## Testing Feature Flags

### Local Testing

1. Set `STATSIG_SERVER_KEY` in `.dev.vars`
2. Create feature gate in Statsig dashboard
3. Enable for your test user ID
4. Run cron job:
   ```bash
   curl http://localhost:8788/api/cron/check-prices
   ```
5. Check logs for "SMS skipped by feature flag" or "SMS sent"

### Testing Without Statsig

If `STATSIG_SERVER_KEY` is not set:

- Feature flags default to `false` (disabled)
- Warning logged: "Statsig not initialized - feature gate defaulting to false"
- SMS notifications will be skipped for all users

## Monitoring

### Check Feature Flag Usage

```sql
-- SMS notifications sent vs skipped
SELECT
  COUNT(*) FILTER (WHERE type = 'sms' AND was_successful) as sms_sent,
  COUNT(*) FILTER (WHERE type = 'sms' AND was_successful = false) as sms_failed
FROM notifications
WHERE sent_at > datetime('now', '-7 days');
```

### Statsig Dashboard

- View feature flag evaluations
- See which users got which flags
- Monitor rollout percentage
- Check evaluation logs

## Cost Control

SMS feature flag provides cost control:

1. **Gradual Rollout**: Start with 10%, increase gradually
2. **User Segmentation**: Enable only for pro users
3. **Geographic Targeting**: Enable only for specific regions
4. **A/B Testing**: Test engagement with/without SMS

### Example: Cost-Controlled Rollout

```
Week 1: Enable for 10% of pro users (test group)
Week 2: Analyze engagement, enable for 25% if positive
Week 3: Enable for 50% of pro users
Week 4: Enable for 100% of pro users
Week 5: Enable for 10% of free users
Week 6+: Gradual rollout to all free users
```

## Advanced: Custom User Properties

Pass custom properties for targeting:

```typescript
const smsEnabled = checkFeatureGate(FeatureFlags.SMS_NOTIFICATIONS, userId.toString(), {
	tier: user.tier, // 'free' or 'pro'
	email: user.email,
	signupDate: user.createdAt.toISOString()
});
```

Then in Statsig, create rules like:

- `custom.tier == "pro"` - Only pro users
- `custom.signupDate < "2026-01-01"` - Early adopters
- `custom.email ends with "@gmail.com"` - Specific email domains

## Troubleshooting

### Feature Flag Always False

1. Check `STATSIG_SERVER_KEY` is set in environment
2. Verify feature gate exists in Statsig dashboard
3. Check feature gate name matches exactly
4. Verify gate is enabled globally
5. Check user ID matches targeting rules

### Statsig Initialization Fails

1. Check API key is valid
2. Check network connectivity from Worker
3. Review Cloudflare Worker logs
4. Verify Statsig service status

### SMS Still Sending When Disabled

1. Check if feature flag is correctly disabled
2. Verify Statsig initialized before check
3. Check user ID is passed correctly
4. Review notification manager logs

## Security

- ✅ Server secret key only used in backend (Workers)
- ✅ Client SDK key separate for frontend
- ✅ User IDs hashed before sending to Statsig (optional)
- ✅ Feature flags cached by Statsig SDK
- ⚠️ Don't expose server secret key in client code

## Migration Path

If migrating from always-on SMS:

1. Create `sms_notifications_enabled` gate
2. Set to 100% enabled initially (maintain current behavior)
3. Deploy code with feature flag check
4. Gradually reduce percentage for controlled rollout
5. Monitor costs and engagement
6. Adjust targeting rules based on data
