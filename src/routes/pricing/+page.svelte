<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';

	const features = {
		free: [
			{ name: 'Track up to 3 events', included: true },
			{ name: 'Email notifications', included: true },
			{ name: 'Price checks every 15 minutes', included: true },
			{ name: '7 days price history', included: true },
			{ name: 'Basic price alerts', included: true },
			{ name: 'SMS notifications', included: false },
			{ name: 'Unlimited event tracking', included: false },
			{ name: 'Real-time price monitoring (1min)', included: false },
			{ name: 'Unlimited price history', included: false },
			{ name: 'Priority support', included: false }
		],
		pro: [
			{ name: 'Track up to 3 events', included: true },
			{ name: 'Email notifications', included: true },
			{ name: 'Price checks every 15 minutes', included: true },
			{ name: '7 days price history', included: true },
			{ name: 'Basic price alerts', included: true },
			{ name: 'SMS notifications', included: true },
			{ name: 'Unlimited event tracking', included: true },
			{ name: 'Real-time price monitoring (1min)', included: true },
			{ name: 'Unlimited price history', included: true },
			{ name: 'Priority support', included: true }
		]
	};
</script>

<div class="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
	<!-- Header -->
	<div class="border-b bg-card">
		<div class="container mx-auto px-4 py-6">
			<div class="flex items-center justify-between">
				<h1 class="text-2xl font-bold">Pricing</h1>
				<Button href="/dashboard" variant="ghost">Back to Dashboard</Button>
			</div>
		</div>
	</div>

	<div class="container mx-auto px-4 py-12">
		<!-- Promo Banner -->
		<div
			class="mb-12 rounded-lg border border-primary/20 bg-primary/5 p-6 text-center dark:bg-primary/10"
		>
			<Badge class="mb-2">Launch Special</Badge>
			<h2 class="mb-2 text-2xl font-bold">50% Off Pro Plan</h2>
			<p class="text-muted-foreground">
				Get unlimited event tracking and SMS alerts for just $9.99/month. Limited time offer!
			</p>
		</div>

		<!-- Pricing Cards -->
		<div class="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
			<!-- Free Plan -->
			<Card class="relative">
				<CardHeader class="pb-8 pt-6">
					<CardTitle class="mb-2 text-2xl">Free</CardTitle>
					<div class="mb-4">
						<span class="text-4xl font-bold">$0</span>
						<span class="text-muted-foreground">/month</span>
					</div>
					<p class="text-sm text-muted-foreground">
						Perfect for casual ticket buyers tracking a few events
					</p>
				</CardHeader>
				<CardContent class="space-y-6">
					<ul class="space-y-3">
						<li class="flex items-start gap-3">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
							<span class="text-sm">Track up to <strong>3 events</strong></span>
						</li>
						<li class="flex items-start gap-3">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
							<span class="text-sm"><strong>Email</strong> notifications</span>
						</li>
						<li class="flex items-start gap-3">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
							<span class="text-sm">Price checks every <strong>15 minutes</strong></span>
						</li>
						<li class="flex items-start gap-3">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
							<span class="text-sm"><strong>7 days</strong> price history</span>
						</li>
						<li class="flex items-start gap-3">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 flex-shrink-0 text-muted-foreground"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clip-rule="evenodd"
								/>
							</svg>
							<span class="text-sm text-muted-foreground">SMS notifications</span>
						</li>
						<li class="flex items-start gap-3">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 flex-shrink-0 text-muted-foreground"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clip-rule="evenodd"
								/>
							</svg>
							<span class="text-sm text-muted-foreground">Unlimited tracking</span>
						</li>
					</ul>

					<Button href="/login" class="w-full" variant="outline">Get Started Free</Button>
				</CardContent>
			</Card>

			<!-- Pro Plan -->
			<Card class="relative border-2 border-primary shadow-lg">
				<Badge class="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>
				<CardHeader class="pb-8 pt-6">
					<CardTitle class="mb-2 text-2xl">Pro</CardTitle>
					<div class="mb-4">
						<span class="text-4xl font-bold">$9.99</span>
						<span class="text-muted-foreground">/month</span>
						<Badge variant="destructive" class="ml-2">50% OFF</Badge>
					</div>
					<p class="text-sm text-muted-foreground">
						For serious ticket buyers who want the best deals
					</p>
				</CardHeader>
				<CardContent class="space-y-6">
					<ul class="space-y-3">
						<li class="flex items-start gap-3">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
							<span class="text-sm"><strong>Unlimited</strong> event tracking</span>
						</li>
						<li class="flex items-start gap-3">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
							<span class="text-sm"><strong>Email & SMS</strong> notifications</span>
						</li>
						<li class="flex items-start gap-3">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
							<span class="text-sm"><strong>Real-time</strong> price checks (every minute)</span>
						</li>
						<li class="flex items-start gap-3">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
							<span class="text-sm"><strong>Unlimited</strong> price history</span>
						</li>
						<li class="flex items-start gap-3">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
							<span class="text-sm"><strong>Priority</strong> customer support</span>
						</li>
						<li class="flex items-start gap-3">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
							<span class="text-sm"><strong>Advanced</strong> price analytics</span>
						</li>
					</ul>

					<Button href="/login" class="w-full">Upgrade to Pro</Button>
				</CardContent>
			</Card>
		</div>

		<!-- Feature Comparison Table -->
		<div class="mx-auto mt-16 max-w-5xl">
			<h2 class="mb-8 text-center text-2xl font-bold">Detailed Comparison</h2>
			<Card>
				<CardContent class="p-0">
					<div class="overflow-x-auto">
						<table class="w-full">
							<thead class="border-b bg-muted/50">
								<tr>
									<th class="p-4 text-left font-semibold">Feature</th>
									<th class="p-4 text-center font-semibold">Free</th>
									<th class="p-4 text-center font-semibold">Pro</th>
								</tr>
							</thead>
							<tbody class="divide-y">
								<tr>
									<td class="p-4 text-sm">Tracked Events</td>
									<td class="p-4 text-center text-sm">3</td>
									<td class="p-4 text-center text-sm font-semibold">Unlimited</td>
								</tr>
								<tr>
									<td class="p-4 text-sm">Email Notifications</td>
									<td class="p-4 text-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="mx-auto h-5 w-5 text-green-600"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fill-rule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clip-rule="evenodd"
											/>
										</svg>
									</td>
									<td class="p-4 text-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="mx-auto h-5 w-5 text-green-600"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fill-rule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clip-rule="evenodd"
											/>
										</svg>
									</td>
								</tr>
								<tr>
									<td class="p-4 text-sm">SMS Notifications</td>
									<td class="p-4 text-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="mx-auto h-5 w-5 text-muted-foreground"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fill-rule="evenodd"
												d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
												clip-rule="evenodd"
											/>
										</svg>
									</td>
									<td class="p-4 text-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="mx-auto h-5 w-5 text-green-600"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fill-rule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clip-rule="evenodd"
											/>
										</svg>
									</td>
								</tr>
								<tr>
									<td class="p-4 text-sm">Price Check Frequency</td>
									<td class="p-4 text-center text-sm">Every 15 min</td>
									<td class="p-4 text-center text-sm font-semibold">Every 1 min</td>
								</tr>
								<tr>
									<td class="p-4 text-sm">Price History</td>
									<td class="p-4 text-center text-sm">7 days</td>
									<td class="p-4 text-center text-sm font-semibold">Unlimited</td>
								</tr>
								<tr>
									<td class="p-4 text-sm">Priority Support</td>
									<td class="p-4 text-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="mx-auto h-5 w-5 text-muted-foreground"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fill-rule="evenodd"
												d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
												clip-rule="evenodd"
											/>
										</svg>
									</td>
									<td class="p-4 text-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="mx-auto h-5 w-5 text-green-600"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fill-rule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clip-rule="evenodd"
											/>
										</svg>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>
		</div>

		<!-- FAQ Section -->
		<div class="mx-auto mt-16 max-w-3xl">
			<h2 class="mb-8 text-center text-2xl font-bold">Frequently Asked Questions</h2>
			<div class="space-y-4">
				<Card>
					<CardContent class="p-6">
						<h3 class="mb-2 font-semibold">Can I cancel anytime?</h3>
						<p class="text-sm text-muted-foreground">
							Yes! You can cancel your Pro subscription at any time. Your account will remain active
							until the end of your billing period.
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent class="p-6">
						<h3 class="mb-2 font-semibold">Do you offer refunds?</h3>
						<p class="text-sm text-muted-foreground">
							We offer a 7-day money-back guarantee. If you're not satisfied with Pro, contact us
							within 7 days for a full refund.
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent class="p-6">
						<h3 class="mb-2 font-semibold">What payment methods do you accept?</h3>
						<p class="text-sm text-muted-foreground">
							We accept all major credit cards, debit cards, and PayPal. Payment integration coming
							soon!
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	</div>
</div>
