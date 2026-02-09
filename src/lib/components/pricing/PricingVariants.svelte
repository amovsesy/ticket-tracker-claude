<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import type { PricingConfig } from '$lib/server/statsigConfig';

	let { config }: { config: PricingConfig } = $props();
</script>

<!-- Variant 1: Launch Promo (Current) -->
{#if config.variant === 'launch_promo'}
	<div class="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
		<!-- Free Plan -->
		<Card class="relative">
			<CardHeader class="pt-6 pb-8">
				<CardTitle class="mb-2 text-2xl">Free</CardTitle>
				<div class="mb-4">
					<span class="text-4xl font-bold">$0</span>
					<span class="text-muted-foreground">/month</span>
				</div>
				<p class="text-muted-foreground text-sm">
					Perfect for casual ticket buyers tracking a few events
				</p>
			</CardHeader>
			<CardContent class="space-y-6">
				<ul class="space-y-3">
					<li class="flex items-start gap-3 text-sm">
						<span class="text-green-600">✓</span>
						Track up to <strong>3 events</strong>
					</li>
					<li class="flex items-start gap-3 text-sm">
						<span class="text-green-600">✓</span>
						<strong>Email</strong> notifications
					</li>
					<li class="flex items-start gap-3 text-sm">
						<span class="text-green-600">✓</span>
						Price checks every <strong>15 minutes</strong>
					</li>
					<li class="flex items-start gap-3 text-sm">
						<span class="text-green-600">✓</span>
						<strong>7 days</strong> price history
					</li>
				</ul>
				<Button href="/login" class="w-full" variant="outline">Get Started Free</Button>
			</CardContent>
		</Card>

		<!-- Pro Plan -->
		<Card class="border-primary relative border-2 shadow-lg">
			<Badge class="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>
			<CardHeader class="pt-6 pb-8">
				<CardTitle class="mb-2 text-2xl">Pro</CardTitle>
				<div class="mb-4 flex items-center gap-2">
					<span class="text-4xl font-bold">$0</span>
					<span class="text-muted-foreground">/month</span>
					{#if config.promoEnabled}
						<span class="text-muted-foreground text-2xl font-bold line-through">$9.99</span>
						<Badge variant="destructive" class="ml-2">{config.promoDiscount}% OFF</Badge>
					{/if}
				</div>
				<p class="text-muted-foreground text-sm">
					For serious ticket buyers who want the best deals
				</p>
			</CardHeader>
			<CardContent class="space-y-6">
				<ul class="space-y-3">
					<li class="flex items-start gap-3 text-sm">
						<span class="text-green-600">✓</span>
						<strong>Unlimited</strong> event tracking
					</li>
					<li class="flex items-start gap-3 text-sm">
						<span class="text-green-600">✓</span>
						<strong>Email & SMS</strong> notifications
					</li>
					<li class="flex items-start gap-3 text-sm">
						<span class="text-green-600">✓</span>
						<strong>Real-time</strong> price checks (every minute)
					</li>
					<li class="flex items-start gap-3 text-sm">
						<span class="text-green-600">✓</span>
						<strong>Unlimited</strong> price history
					</li>
					<li class="flex items-start gap-3 text-sm">
						<span class="text-green-600">✓</span>
						<strong>Priority</strong> customer support
					</li>
				</ul>
				<Button href="/login" class="w-full">Upgrade to Pro</Button>
			</CardContent>
		</Card>
	</div>
{/if}

<!-- Variant 2: Pay Per Event -->
{#if config.variant === 'pay_per_event'}
	<div class="mx-auto max-w-2xl">
		<Card class="border-primary relative border-2 shadow-lg">
			<CardHeader class="pt-6 pb-8">
				<CardTitle class="mb-2 text-2xl">Simple, Fair Pricing</CardTitle>
				<div class="mb-4">
					<span class="text-4xl font-bold">$0</span>
					<span class="text-muted-foreground"> for your first event</span>
				</div>
				<p class="text-muted-foreground text-lg">
					Then just <strong>${config.payPerEventCost}</strong> per additional event
				</p>
			</CardHeader>
			<CardContent class="space-y-6">
				<ul class="space-y-3">
					<li class="flex items-start gap-3 text-sm">
						<span class="text-green-600">✓</span>
						<strong>Unlimited</strong> event tracking
					</li>
					<li class="flex items-start gap-3 text-sm">
						<span class="text-green-600">✓</span>
						<strong>Email & SMS</strong> notifications
					</li>
					<li class="flex items-start gap-3 text-sm">
						<span class="text-green-600">✓</span>
						<strong>Real-time</strong> monitoring
					</li>
					<li class="flex items-start gap-3 text-sm">
						<span class="text-green-600">✓</span>
						Only pay for events you actually track
					</li>
					<li class="flex items-start gap-3 text-sm">
						<span class="text-green-600">✓</span>
						Cancel anytime, no subscription
					</li>
				</ul>
				<Button href="/login" class="w-full">Start Tracking Free</Button>
			</CardContent>
		</Card>
	</div>
{/if}

<!-- Variant 3: Percentage of Savings -->
{#if config.variant === 'percentage_savings'}
	<div class="mx-auto max-w-2xl">
		<Card class="border-primary relative border-2 shadow-lg">
			<CardHeader class="pt-6 pb-8">
				<CardTitle class="mb-2 text-2xl">Pay Only When You Save</CardTitle>
				<div class="mb-4">
					<span class="text-4xl font-bold">{config.percentageSavings}%</span>
					<span class="text-muted-foreground"> of your savings</span>
				</div>
				<p class="text-muted-foreground text-lg">
					If we save you $100, you pay us ${(config.percentageSavings! * 100) / 100}. If we don't
					save you anything, you pay nothing.
				</p>
			</CardHeader>
			<CardContent class="space-y-6">
				<div class="bg-primary/5 rounded-lg p-4 text-center">
					<p class="mb-2 text-sm font-semibold">Example:</p>
					<p class="text-muted-foreground text-sm">
						Price when you started: <strong>$200</strong><br />
						Lowest price we found: <strong>$150</strong><br />
						Your savings: <strong class="text-green-600">$50</strong><br />
						You pay us:
						<strong class="text-primary">${(50 * config.percentageSavings!) / 100}</strong>
					</p>
				</div>
				<ul class="space-y-3">
					<li class="flex items-start gap-3 text-sm">
						<span class="text-green-600">✓</span>
						<strong>Unlimited</strong> event tracking
					</li>
					<li class="flex items-start gap-3 text-sm">
						<span class="text-green-600">✓</span>
						<strong>Email & SMS</strong> notifications
					</li>
					<li class="flex items-start gap-3 text-sm">
						<span class="text-green-600">✓</span>
						<strong>Real-time</strong> monitoring
					</li>
					<li class="flex items-start gap-3 text-sm">
						<span class="text-green-600">✓</span>
						Only pay when we save you money
					</li>
				</ul>
				<Button href="/login" class="w-full">Start Saving Money</Button>
			</CardContent>
		</Card>
	</div>
{/if}

<!-- Variant 4: Pay Per SMS + Tips -->
{#if config.variant === 'pay_per_sms_tips'}
	<div class="mx-auto max-w-2xl">
		<Card class="border-primary relative border-2 shadow-lg">
			<CardHeader class="pt-6 pb-8">
				<CardTitle class="mb-2 text-2xl">Free Tracking, Affordable SMS</CardTitle>
				<div class="mb-4">
					<span class="text-4xl font-bold">$0</span>
					<span class="text-muted-foreground"> to track events</span>
				</div>
				<p class="text-muted-foreground text-lg">
					<strong>${config.smsPerMessageCost}</strong> per SMS (to cover carrier costs)<br />
					<span class="text-sm">Email notifications always free</span>
				</p>
			</CardHeader>
			<CardContent class="space-y-6">
				<ul class="space-y-3">
					<li class="flex items-start gap-3 text-sm">
						<span class="text-green-600">✓</span>
						<strong>Unlimited</strong> event tracking
					</li>
					<li class="flex items-start gap-3 text-sm">
						<span class="text-green-600">✓</span>
						<strong>Free</strong> email notifications
					</li>
					<li class="flex items-start gap-3 text-sm">
						<span class="text-green-600">✓</span>
						<strong>Real-time</strong> monitoring
					</li>
					<li class="flex items-start gap-3 text-sm">
						<span class="text-green-600">✓</span>
						SMS at cost (${config.smsPerMessageCost} per message)
					</li>
					<li class="flex items-start gap-3 text-sm">
						<span class="text-green-600">✓</span>
						<strong>Optional tips</strong> if you find it valuable
					</li>
				</ul>
				<Button href="/login" class="w-full">Start Tracking Free</Button>
				<div class="bg-muted text-muted-foreground rounded-lg p-3 text-center text-xs">
					Found this helpful? Tips keep the service running 💙
				</div>
			</CardContent>
		</Card>
	</div>
{/if}

<!-- Variant 5: Tips Only -->
{#if config.variant === 'tips_only'}
	<div class="mx-auto max-w-2xl">
		<Card class="border-primary relative border-2 shadow-lg">
			<CardHeader class="pt-6 pb-8">
				<CardTitle class="mb-2 text-2xl">Completely Free</CardTitle>
				<div class="mb-4">
					<span class="text-4xl font-bold">$0</span>
					<span class="text-muted-foreground"> forever</span>
				</div>
				<p class="text-muted-foreground text-lg">
					No subscriptions. No fees. No catch.<br />
					<span class="text-sm">Tips appreciated if you save money 💙</span>
				</p>
			</CardHeader>
			<CardContent class="space-y-6">
				<ul class="space-y-3">
					<li class="flex items-start gap-3 text-sm">
						<span class="text-green-600">✓</span>
						<strong>Unlimited</strong> event tracking
					</li>
					<li class="flex items-start gap-3 text-sm">
						<span class="text-green-600">✓</span>
						<strong>Email & SMS</strong> notifications
					</li>
					<li class="flex items-start gap-3 text-sm">
						<span class="text-green-600">✓</span>
						<strong>Real-time</strong> monitoring
					</li>
					<li class="flex items-start gap-3 text-sm">
						<span class="text-green-600">✓</span>
						<strong>All features</strong> included
					</li>
					<li class="flex items-start gap-3 text-sm">
						<span class="text-green-600">✓</span>
						Pay what you want (or nothing at all)
					</li>
				</ul>
				<Button href="/login" class="w-full">Start Tracking Free</Button>
				<div class="border-primary/20 bg-primary/5 rounded-lg border-2 p-4 text-center">
					<p class="text-primary mb-2 text-sm font-semibold">Found this helpful?</p>
					<p class="text-muted-foreground mb-3 text-xs">
						Your tips help keep this service free for everyone
					</p>
					<Button href="/donate" size="sm" variant="outline">Leave a Tip 💙</Button>
				</div>
			</CardContent>
		</Card>
	</div>
{/if}
