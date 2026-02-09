// Local testing script for browser scraper
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:8080';

// Test URLs for different platforms
const TEST_URLS = {
	stubhub: 'https://www.stubhub.com/the-eagles-las-vegas-tickets-3-20-2026/event/159831948/',
	ticketmaster: 'https://www.ticketmaster.com/event/1234567890',
	seatgeek: 'https://seatgeek.com/event/1234567890'
};

// Colors for console output
const colors = {
	reset: '\x1b[0m',
	bright: '\x1b[1m',
	green: '\x1b[32m',
	red: '\x1b[31m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
	console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testHealthCheck() {
	log('\n=== Testing Health Check ===', 'bright');
	try {
		const response = await fetch(`${BASE_URL}/health`);
		const data = await response.json();

		if (response.ok && data.status === 'healthy') {
			log('✓ Health check passed', 'green');
			log(`  Timestamp: ${data.timestamp}`, 'cyan');
			return true;
		} else {
			log('✗ Health check failed', 'red');
			return false;
		}
	} catch (error) {
		log(`✗ Health check error: ${error.message}`, 'red');
		log('  Make sure the server is running with: npm run dev', 'yellow');
		return false;
	}
}

async function testScrape(platform, url, timeout = 30000) {
	log(`\n=== Testing ${platform.toUpperCase()} Scrape ===`, 'bright');
	log(`URL: ${url}`, 'cyan');

	const startTime = Date.now();

	try {
		const response = await fetch(`${BASE_URL}/scrape`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ url, timeout })
		});

		const data = await response.json();
		const duration = Date.now() - startTime;

		if (data.success) {
			log('✓ Scrape successful', 'green');
			log(`  Duration: ${duration}ms`, 'cyan');
			log(`  Title: ${data.title}`, 'cyan');
			log(`  HTML Length: ${data.length.toLocaleString()} bytes`, 'cyan');
			log(`  Scraped At: ${data.scrapedAt}`, 'cyan');

			// Check for common indicators
			const html = data.html.toLowerCase();
			const indicators = {
				'Has price data': html.includes('price') || html.includes('$'),
				'Has JSON data': html.includes('__next_data__') || html.includes('__initial_state__'),
				'Has event info': html.includes('event') || html.includes('ticket'),
				'Not blocked': !html.includes('access denied') && !html.includes('cloudflare')
			};

			log('  Indicators:', 'cyan');
			for (const [key, value] of Object.entries(indicators)) {
				const symbol = value ? '✓' : '✗';
				const color = value ? 'green' : 'yellow';
				log(`    ${symbol} ${key}`, color);
			}

			return { success: true, data, duration };
		} else {
			log('✗ Scrape failed', 'red');
			log(`  Error: ${data.error}`, 'red');
			log(`  Duration: ${duration}ms`, 'cyan');
			return { success: false, error: data.error, duration };
		}
	} catch (error) {
		const duration = Date.now() - startTime;
		log('✗ Request error', 'red');
		log(`  Error: ${error.message}`, 'red');
		log(`  Duration: ${duration}ms`, 'cyan');
		return { success: false, error: error.message, duration };
	}
}

// TODO: remove or uncomment
// async function testExtract() {
// 	log('\n=== Testing Extract Endpoint ===', 'bright');
//
// 	const extractorFunction = `() => {
// 		// Extract all visible text prices
// 		const prices = [];
// 		document.querySelectorAll('*').forEach(el => {
// 			const text = el.textContent || '';
// 			const priceMatch = text.match(/\\$([0-9,]+(?:\\.[0-9]{2})?)/);
// 			if (priceMatch && el.children.length === 0) {
// 				prices.push(priceMatch[0]);
// 			}
// 		});
// 		return [...new Set(prices)].slice(0, 10); // First 10 unique prices
// 	}`;
//
// 	try {
// 		const response = await fetch(`${BASE_URL}/extract`, {
// 			method: 'POST',
// 			headers: { 'Content-Type': 'application/json' },
// 			body: JSON.stringify({
// 				url: TEST_URLS.stubhub,
// 				extractorFunction
// 			})
// 		});
//
// 		const data = await response.json();
//
// 		if (data.success) {
// 			log('✓ Extract successful', 'green');
// 			log(`  Found ${data.data.length} prices:`, 'cyan');
// 			data.data.forEach((price) => log(`    ${price}`, 'cyan'));
// 			return { success: true, data };
// 		} else {
// 			log('✗ Extract failed', 'red');
// 			log(`  Error: ${data.error}`, 'red');
// 			return { success: false, error: data.error };
// 		}
// 	} catch (error) {
// 		log('✗ Request error', 'red');
// 		log(`  Error: ${error.message}`, 'red');
// 		return { success: false, error: error.message };
// 	}
// }

async function runTests() {
	log('\n╔════════════════════════════════════════╗', 'bright');
	log('║   Browser Scraper Local Test Suite   ║', 'bright');
	log('╚════════════════════════════════════════╝', 'bright');

	// Test health check first
	const healthOk = await testHealthCheck();
	if (!healthOk) {
		log('\n✗ Server is not responding. Exiting.', 'red');
		process.exit(1);
	}

	// Test scraping
	const results = {
		stubhub: await testScrape('stubhub', TEST_URLS.stubhub)
	};

	// Optionally test extract endpoint
	// const extractResult = await testExtract();

	// Summary
	log('\n╔════════════════════════════════════════╗', 'bright');
	log('║           Test Summary                ║', 'bright');
	log('╚════════════════════════════════════════╝', 'bright');

	const successCount = Object.values(results).filter((r) => r.success).length;
	const totalCount = Object.keys(results).length;
	const avgDuration = Math.round(
		Object.values(results).reduce((sum, r) => sum + r.duration, 0) / totalCount
	);

	log(
		`\nTests Passed: ${successCount}/${totalCount}`,
		successCount === totalCount ? 'green' : 'yellow'
	);
	log(`Average Duration: ${avgDuration}ms`, 'cyan');

	if (successCount === totalCount) {
		log('\n✓ All tests passed! Browser scraper is working correctly.', 'green');
	} else {
		log('\n⚠ Some tests failed. Check the output above for details.', 'yellow');
	}

	log('\nNext steps:', 'bright');
	log(
		'1. Test with your main app: Set BROWSER_SCRAPER_URL=http://localhost:8080 in .dev.vars',
		'cyan'
	);
	log('2. Try scraping from your app dashboard', 'cyan');
	log('3. When ready, deploy to GCP with: npm run deploy', 'cyan');
}

// Run tests
runTests().catch((error) => {
	log(`\n✗ Unexpected error: ${error.message}`, 'red');
	console.error(error);
	process.exit(1);
});
