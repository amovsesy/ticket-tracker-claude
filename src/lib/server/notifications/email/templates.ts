// Email templates for notifications

interface PriceDropEmailData {
	userName: string;
	eventName: string;
	venue: string;
	date: string;
	oldPrice?: number;
	newPrice: number;
	targetPrice: number;
	section?: string;
	eventUrl?: string;
	percentageChange?: number;
}

interface DailyDigestEmailData {
	userName: string;
	events: Array<{
		eventName: string;
		venue: string;
		oldPrice: number;
		newPrice: number;
		percentageChange: number;
		eventUrl?: string;
	}>;
}

/**
 * Generate price drop alert email HTML
 */
export function generatePriceDropEmail(data: PriceDropEmailData): string {
	const percentageText =
		data.percentageChange && data.percentageChange < 0
			? `<span style="color: #10b981; font-weight: bold;">${Math.abs(data.percentageChange).toFixed(1)}% OFF</span>`
			: '';

	return `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Price Drop Alert</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f6f6f8;">
	<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f6f8; padding: 20px 0;">
		<tr>
			<td align="center">
				<table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
					<!-- Header -->
					<tr>
						<td style="background: linear-gradient(135deg, #1337ec 0%, #0e28b8 100%); padding: 32px 24px; text-align: center;">
							<h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 900;">🎟️ Price Drop Alert!</h1>
							<p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Your target price has been reached</p>
						</td>
					</tr>

					<!-- Content -->
					<tr>
						<td style="padding: 32px 24px;">
							<p style="margin: 0 0 24px; color: #111218; font-size: 16px;">Hi ${data.userName},</p>

							<div style="background-color: #f0f1f4; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
								<h2 style="margin: 0 0 8px; color: #111218; font-size: 20px; font-weight: 700;">${data.eventName}</h2>
								<p style="margin: 0 0 4px; color: #616889; font-size: 14px;">📍 ${data.venue}</p>
								<p style="margin: 0; color: #616889; font-size: 14px;">📅 ${data.date}</p>
								${data.section ? `<p style="margin: 8px 0 0; color: #1337ec; font-size: 13px; font-weight: 600;">Section: ${data.section}</p>` : ''}
							</div>

							<div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
								<p style="margin: 0 0 8px; color: rgba(255,255,255,0.9); font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">New Price</p>
								<p style="margin: 0; color: #ffffff; font-size: 42px; font-weight: 900;">$${data.newPrice}</p>
								${percentageText ? `<p style="margin: 8px 0 0; color: #ffffff; font-size: 18px;">${percentageText}</p>` : ''}
								${data.oldPrice ? `<p style="margin: 12px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">Previously: <span style="text-decoration: line-through;">$${data.oldPrice}</span></p>` : ''}
							</div>

							<div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
								<p style="margin: 0; color: #92400e; font-size: 14px;">
									💡 <strong>Your target price:</strong> $${data.targetPrice} — This price meets your criteria!
								</p>
							</div>

							${data.eventUrl ? `<div style="text-align: center; margin: 24px 0;"><a href="${data.eventUrl}" style="display: inline-block; background: linear-gradient(135deg, #1337ec 0%, #0e28b8 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 700; font-size: 16px;">View Event Details</a></div>` : ''}

							<p style="margin: 24px 0 0; color: #616889; font-size: 14px; line-height: 1.6;">
								Don't miss out! Prices can change quickly. We recommend booking soon if this price works for you.
							</p>
						</td>
					</tr>

					<!-- Footer -->
					<tr>
						<td style="background-color: #f6f6f8; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
							<p style="margin: 0 0 8px; color: #616889; font-size: 12px;">
								You're receiving this because you're tracking this event on PriceTracker
							</p>
							<p style="margin: 0; color: #616889; font-size: 12px;">
								<a href="#" style="color: #1337ec; text-decoration: none;">Manage Alerts</a> ·
								<a href="#" style="color: #1337ec; text-decoration: none;">Unsubscribe</a>
							</p>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
</body>
</html>
	`.trim();
}

/**
 * Generate daily digest email HTML
 */
export function generateDailyDigestEmail(data: DailyDigestEmailData): string {
	const eventRows = data.events
		.map(
			(event) => `
		<tr>
			<td style="padding: 16px; border-bottom: 1px solid #e5e7eb;">
				<h3 style="margin: 0 0 4px; color: #111218; font-size: 16px; font-weight: 600;">${event.eventName}</h3>
				<p style="margin: 0 0 8px; color: #616889; font-size: 14px;">${event.venue}</p>
				<div style="display: flex; align-items: center; gap: 8px;">
					<span style="color: #dc2626; text-decoration: line-through;">$${event.oldPrice}</span>
					<span style="color: #10b981; font-weight: 700; font-size: 18px;">$${event.newPrice}</span>
					<span style="background-color: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">
						${Math.abs(event.percentageChange).toFixed(1)}% OFF
					</span>
				</div>
			</td>
		</tr>
	`
		)
		.join('');

	return `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Your Daily Price Summary</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f6f6f8;">
	<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f6f8; padding: 20px 0;">
		<tr>
			<td align="center">
				<table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
					<!-- Header -->
					<tr>
						<td style="background: linear-gradient(135deg, #1337ec 0%, #0e28b8 100%); padding: 32px 24px; text-align: center;">
							<h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 900;">📊 Daily Price Summary</h1>
							<p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">${data.events.length} price ${data.events.length === 1 ? 'drop' : 'drops'} today</p>
						</td>
					</tr>

					<!-- Content -->
					<tr>
						<td style="padding: 32px 24px;">
							<p style="margin: 0 0 24px; color: #111218; font-size: 16px;">Hi ${data.userName},</p>
							<p style="margin: 0 0 24px; color: #616889; font-size: 14px;">Here's your daily summary of price changes for events you're tracking:</p>

							<table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
								${eventRows}
							</table>
						</td>
					</tr>

					<!-- Footer -->
					<tr>
						<td style="background-color: #f6f6f8; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
							<p style="margin: 0 0 8px; color: #616889; font-size: 12px;">
								You're receiving this daily digest for your tracked events
							</p>
							<p style="margin: 0; color: #616889; font-size: 12px;">
								<a href="#" style="color: #1337ec; text-decoration: none;">Manage Alerts</a> ·
								<a href="#" style="color: #1337ec; text-decoration: none;">Unsubscribe</a>
							</p>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
</body>
</html>
	`.trim();
}

/**
 * Generate plain text version for price drop email
 */
export function generatePriceDropEmailText(data: PriceDropEmailData): string {
	const changeText = data.oldPrice
		? `dropped from $${data.oldPrice} to $${data.newPrice}`
		: `is now $${data.newPrice}`;

	return `
PRICE DROP ALERT!

Hi ${data.userName},

Great news! The price for ${data.eventName} has ${changeText}.

Event Details:
- ${data.eventName}
- ${data.venue}
- ${data.date}
${data.section ? `- Section: ${data.section}` : ''}

New Price: $${data.newPrice}
${data.oldPrice ? `Previous Price: $${data.oldPrice}` : ''}
Your Target: $${data.targetPrice}

${data.percentageChange && data.percentageChange < 0 ? `Save ${Math.abs(data.percentageChange).toFixed(1)}%!` : ''}

${data.eventUrl ? `View event: ${data.eventUrl}` : ''}

Don't miss out! Prices can change quickly.

---
PriceTracker - Never miss a price drop
	`.trim();
}
