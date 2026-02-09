import express from 'express';
import puppeteer from 'puppeteer';

const app = express();
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
	res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Main scraping endpoint
app.post('/scrape', async (req, res) => {
	const { url, waitForSelector, timeout = 30000 } = req.body;

	if (!url) {
		return res.status(400).json({
			success: false,
			error: 'URL is required'
		});
	}

	console.log(`[${new Date().toISOString()}] Scraping: ${url}`);

	let browser;
	try {
		// Launch browser
		browser = await puppeteer.launch({
			headless: true,
			args: [
				'--no-sandbox',
				'--disable-setuid-sandbox',
				'--disable-dev-shm-usage',
				'--disable-gpu',
				'--disable-software-rasterizer',
				'--disable-extensions',
				'--no-first-run',
				'--no-zygote',
				'--single-process'
			]
		});

		const page = await browser.newPage();

		// Set realistic viewport and user agent
		await page.setViewport({ width: 1920, height: 1080 });
		await page.setUserAgent(
			'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
		);

		// Navigate to URL
		await page.goto(url, {
			waitUntil: 'networkidle2',
			timeout
		});

		// Wait for specific selector if provided
		if (waitForSelector) {
			try {
				await page.waitForSelector(waitForSelector, { timeout: 10000 });
			} catch (e) {
				console.warn(`Selector "${waitForSelector}" not found, continuing anyway`);
				console.error(e);
			}
		}

		// Get fully rendered HTML
		const html = await page.content();

		// Get page title for verification
		const title = await page.title();

		await browser.close();

		console.log(`[${new Date().toISOString()}] Success: ${url} (${html.length} bytes)`);

		res.json({
			success: true,
			html,
			title,
			url,
			length: html.length,
			scrapedAt: new Date().toISOString()
		});
	} catch (error) {
		console.error(`[${new Date().toISOString()}] Error scraping ${url}:`, error.message);

		if (browser) {
			await browser.close();
		}

		res.status(500).json({
			success: false,
			error: error.message,
			url
		});
	}
});

// Extract structured data endpoint (for specific platforms)
app.post('/extract', async (req, res) => {
	const { url, extractorFunction } = req.body;

	if (!url || !extractorFunction) {
		return res.status(400).json({
			success: false,
			error: 'URL and extractorFunction are required'
		});
	}

	let browser;
	try {
		browser = await puppeteer.launch({
			headless: true,
			args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
		});

		const page = await browser.newPage();
		await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');

		await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

		// Execute custom extraction function in browser context
		const data = await page.evaluate(eval(`(${extractorFunction})`));

		await browser.close();

		res.json({
			success: true,
			data,
			url
		});
	} catch (error) {
		if (browser) {
			await browser.close();
		}

		res.status(500).json({
			success: false,
			error: error.message,
			url
		});
	}
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Browser scraper service running on port ${PORT}`);
	console.log(`Health check: http://localhost:${PORT}/health`);
});
