# Admin UI System - Setup Guide

This guide explains how to set up and use the admin UI system for the Ticket Tracker application.

## Overview

The admin UI system provides administrators with tools to:

- View and manage all users
- Impersonate users for support
- Toggle demo/mock data mode
- Promote users to admin
- Change user tiers
- View comprehensive user activity
- Track all admin actions in an audit log

## Setup Instructions

### 1. Database Migrations

**Local Development:**

```bash
# Migrations are already generated
pnpm run db:push
```

**Production (Cloudflare D1):**

```bash
# Apply the migration to remote database
wrangler d1 execute ticket-tracker-db --remote --file=./migrations/0001_dark_dracula.sql
```

### 2. Create Your First Admin User

You need to manually set a user as admin in the database. You can do this in two ways:

**Option A: Using Drizzle Studio (Local)**

```bash
pnpm run db:studio
```

1. Open the UI (usually http://localhost:4983)
2. Navigate to the `users` table
3. Find your user
4. Set `is_admin` to `1` (true)

**Option B: Using SQL (Production)**

```bash
# Replace 'your_clerk_id' with your actual Clerk user ID
wrangler d1 execute ticket-tracker-db --remote --command "UPDATE users SET is_admin = 1 WHERE clerk_id = 'your_clerk_id'"
```

**Option C: Using Wrangler Console (Production)**

```bash
wrangler d1 console ticket-tracker-db --remote
```

Then run:

```sql
UPDATE users SET is_admin = 1 WHERE email = 'your@email.com';
```

### 3. Verify Admin Access

1. Sign in with your admin account
2. Navigate to `/admin`
3. You should see the admin dashboard

If you're redirected to `/dashboard`, you're not properly set as admin.

## Admin Routes

All admin routes are prefixed with `/admin`:

- `/admin` - Dashboard with stats and recent activity
- `/admin/users` - User list with search and filters
- `/admin/users/[id]` - Individual user detail page
- `/admin/impersonate/[userId]` - Impersonate a user
- `/admin/events` - Event management (TODO)
- `/admin/events/new` - Create new event (TODO)
- `/admin/notifications` - Notification history (TODO)
- `/admin/notifications/send` - Send manual notifications (TODO)

## Features Implemented

### User Management

**User List (`/admin/users`):**

- View all users with stats (tracked events, notifications sent)
- Search by email or phone
- Filter by tier (free/pro)
- See admin and tier badges
- Quick actions: View details, Impersonate

**User Detail Page (`/admin/users/[id]`):**

- Complete user profile
- All tracked events with details
- Notification history (last 50)
- Admin actions:
  - Toggle Demo Mode
  - Change Tier (free ↔ pro)
  - Promote to Admin / Revoke Admin
  - Impersonate User

### Demo Mode

Demo mode shows fake/sample data to users:

**Enabling Demo Mode:**

1. Go to user detail page
2. Click "Enable Demo Mode"
3. User will now see mock events and data

**What Users See:**

- 5 sample events with realistic data
- Sample notification history
- Yellow banner indicating demo mode
- All data has negative IDs (to distinguish from real data)

**Mock Data Includes:**

- Taylor Swift concert
- Lakers vs Warriors game
- Hamilton theater show
- Coachella festival
- UFC event

### Impersonation

Impersonation allows admins to view the app as another user:

**How to Impersonate:**

1. Go to `/admin/users`
2. Click "Impersonate" on any user
3. You'll be redirected to their dashboard
4. Yellow warning banner shows at top

**While Impersonating:**

- You see exactly what the user sees
- All pages work as if you're that user
- Yellow banner reminds you it's impersonation mode
- Click "Exit Impersonation" to return to admin panel

**Security:**

- Impersonation cookie expires after 4 hours
- All impersonation actions logged to audit trail
- Cookie is httpOnly and secure

### Audit Logging

All admin actions are logged to the `admin_audit_logs` table:

**Logged Actions:**

- `view_user` - When viewing user detail page
- `toggle_demo_mode` - Enabling/disabling demo mode
- `update_user_tier` - Changing user tier
- `toggle_admin` - Promoting/revoking admin status
- `impersonate_user` - Starting impersonation

**Log Details:**

- Admin user ID
- Action type
- Target resource (user, event, etc.)
- Timestamp
- IP address
- User agent
- Additional context (JSON)

## Admin Dashboard Stats

The dashboard shows:

- Total users
- Total events in system
- Total tracked events
- Total notifications sent
- Recent notification activity (last 10)

## User Profile Information

For each user you can see:

- Email and phone
- Tier (free/pro)
- Admin status
- Notification preferences (email/SMS)
- Notification frequency (realtime/daily)
- Join date
- Number of tracked events
- Number of notifications sent

## Tier System

**Free Tier:**

- 3 events max
- Email notifications only
- 15-minute price checks
- 7 days of price history

**Pro Tier:**

- Unlimited events
- Email + SMS notifications
- 1-minute price checks
- Unlimited price history

**Changing Tiers:**
Admins can manually change user tiers from the user detail page. This is useful for:

- Customer support
- Promotional upgrades
- Testing
- Compensating users

## Design System

The admin UI follows the same design as the main app:

**Colors:**

- Primary: `#1337ec` (blue)
- Background: `#f6f6f8` (light gray)
- Text: `#111218` (dark), `#616889` (secondary)
- Borders: `#dbdde6`
- Success: Green
- Warning: Yellow (impersonation, demo mode)
- Danger: Red

**Layout:**

- Sidebar navigation (left)
- Main content area (white cards)
- Tables with hover states
- Rounded badges for status indicators

## Security Best Practices

1. **Never share admin credentials** - Admin access is powerful
2. **Use impersonation carefully** - It's logged but still sensitive
3. **Review audit logs regularly** - Check for unusual activity
4. **Limit admin users** - Only promote trusted team members
5. **Demo mode is for testing** - Don't enable for production users without reason
6. **Impersonation expires** - Sessions timeout after 4 hours for security

## Troubleshooting

**Can't access /admin:**

- Verify `is_admin = 1` in database
- Check that you're logged in with correct account
- Clear cookies and re-login
- Check browser console for errors

**Demo mode not showing:**

- Verify `user_demo_mode` table exists
- Check that demo mode is enabled for user
- Reload dashboard page
- Check browser console for errors

**Impersonation not working:**

- Check that cookie is being set
- Verify impersonation banner component is imported
- Check browser cookie settings
- Try different browser if issues persist

**Stats showing zero:**

- Database might be empty (expected on fresh install)
- Check database connection
- Verify queries are running without errors

## Future Enhancements

Not yet implemented but planned:

1. **Event Management:**
   - Create/edit events manually
   - Add price data manually
   - Delete events globally
   - Bulk import via CSV

2. **Notification Management:**
   - View all sent notifications
   - Send manual notifications
   - Broadcast to multiple users
   - Email/SMS templates

3. **Analytics:**
   - User growth charts
   - Notification success rates
   - Popular events
   - Price drop frequency

4. **Advanced Features:**
   - Role-based permissions (viewer, editor, admin)
   - Two-factor authentication for admins
   - Scheduled reports
   - Export audit logs to CSV

## Database Schema

### New Tables

**admin_audit_logs:**

- Tracks all admin actions
- Includes IP address and user agent
- Indexed on admin_user_id, created_at, action

**user_demo_mode:**

- Stores demo mode state per user
- Tracks who enabled it and when
- One record per user (unique constraint)

### Modified Tables

**users:**

- Added `is_admin` boolean field (default: false)

## API Endpoints

No new API endpoints yet. All admin functionality is server-rendered through SvelteKit pages.

Future API endpoints may include:

- `/api/admin/stats` - Dashboard statistics
- `/api/admin/audit-logs` - Export audit logs
- `/api/admin/users/bulk` - Bulk user operations

## Testing

Manual testing checklist:

- [ ] Admin can access /admin dashboard
- [ ] Non-admin redirected from /admin
- [ ] User list displays correctly
- [ ] Search works
- [ ] Tier filter works
- [ ] User detail page loads
- [ ] Demo mode toggle works
- [ ] User sees mock data when demo enabled
- [ ] Demo mode banner shows in dashboard
- [ ] Tier change works
- [ ] Admin promotion works
- [ ] Impersonation works
- [ ] Impersonation banner shows
- [ ] Exit impersonation works
- [ ] Audit logs created for actions
- [ ] Dashboard stats accurate

## Support

If you encounter issues:

1. Check browser console for errors
2. Check server logs in Cloudflare dashboard
3. Verify database schema is up to date
4. Review audit logs for failed actions
5. Try clearing cookies and re-login

For development questions, see:

- `ADMIN_IMPLEMENTATION_STATUS.md` - Implementation details
- `../src/lib/server/adminAuth.ts` - Admin middleware
- `../src/lib/server/demoMode.ts` - Demo mode utilities
