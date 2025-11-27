require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Use puppeteer-core with chromium for serverless environments
const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Screenshot API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      screenshot: '/screenshot?url=<URL>&fullPage=<true|false>&width=<number>&height=<number>&format=<png|jpeg>',
      health: '/health'
    },
    documentation: 'https://rapidapi.com/your-api/screenshot-api'
  });
});

// Health check for monitoring
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Main screenshot endpoint
app.get('/screenshot', async (req, res) => {
  const startTime = Date.now();
  let browser = null;

  try {
    // Extract and validate URL parameter
    const { url, fullPage, width, height, format, quality, delay } = req.query;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter: url',
        example: '/screenshot?url=https://example.com'
      });
    }

    // Validate URL format
    let targetUrl;
    try {
      targetUrl = new URL(url);
      if (!['http:', 'https:'].includes(targetUrl.protocol)) {
        throw new Error('Invalid protocol');
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid URL format. Must be a valid HTTP or HTTPS URL',
        provided: url
      });
    }

    // Parse parameters with defaults
    const screenshotOptions = {
      fullPage: fullPage === 'true' || fullPage === '1',
      type: format === 'jpeg' ? 'jpeg' : 'png',
    };

    if (format === 'jpeg') {
      screenshotOptions.quality = parseInt(quality) || 80;
    }

    const viewportWidth = parseInt(width) || parseInt(process.env.DEFAULT_VIEWPORT_WIDTH) || 1920;
    const viewportHeight = parseInt(height) || parseInt(process.env.DEFAULT_VIEWPORT_HEIGHT) || 1080;
    const screenshotDelay = parseInt(delay) || 0;

    // Validate dimensions
    const maxWidth = parseInt(process.env.MAX_SCREENSHOT_WIDTH) || 3840;
    const maxHeight = parseInt(process.env.MAX_SCREENSHOT_HEIGHT) || 2160;

    if (viewportWidth < 320 || viewportWidth > maxWidth) {
      return res.status(400).json({
        success: false,
        error: `Width must be between 320 and ${maxWidth} pixels`
      });
    }

    if (viewportHeight < 240 || viewportHeight > maxHeight) {
      return res.status(400).json({
        success: false,
        error: `Height must be between 240 and ${maxHeight} pixels`
      });
    }

    console.log(`Taking screenshot of: ${url}`);
    console.log(`Options: ${JSON.stringify({ viewportWidth, viewportHeight, ...screenshotOptions })}`);

    // Launch Puppeteer with chromium
    const launchOptions = {
      headless: true,
      args: [
        ...chromium.args,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ],
      executablePath: await chromium.executablePath(),
      timeout: parseInt(process.env.DEFAULT_TIMEOUT) || 30000
    };

    browser = await puppeteer.launch(launchOptions);

    const page = await browser.newPage();

    // Set viewport
    await page.setViewport({
      width: viewportWidth,
      height: viewportHeight,
      deviceScaleFactor: 1
    });

    // Set user agent to avoid bot detection
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    // Navigate to URL and wait for network idle
    await page.goto(targetUrl.href, {
      waitUntil: 'networkidle2',
      timeout: parseInt(process.env.DEFAULT_TIMEOUT) || 30000
    });

    // Optional delay for JavaScript-heavy pages
    if (screenshotDelay > 0 && screenshotDelay <= 10000) {
      await page.waitForTimeout(screenshotDelay);
    }

    // Capture screenshot
    const screenshotBuffer = await page.screenshot(screenshotOptions);

    // Convert to Base64
    const base64Image = screenshotBuffer.toString('base64');

    await browser.close();
    browser = null;

    const processingTime = Date.now() - startTime;

    // Return response
    res.json({
      success: true,
      data: {
        image: base64Image,
        format: screenshotOptions.type,
        size: screenshotBuffer.length,
        dimensions: {
          width: viewportWidth,
          height: viewportHeight,
          fullPage: screenshotOptions.fullPage
        }
      },
      metadata: {
        url: url,
        timestamp: new Date().toISOString(),
        processingTime: `${processingTime}ms`
      }
    });

  } catch (error) {
    console.error('Screenshot error:', error);

    if (browser) {
      await browser.close();
    }

    // Handle specific errors
    if (error.name === 'TimeoutError') {
      return res.status(504).json({
        success: false,
        error: 'Request timeout: The page took too long to load',
        details: error.message
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to capture screenshot',
      details: error.message
    });
  }
});

// Advanced screenshot endpoint with element selector
app.post('/screenshot/element', express.json(), async (req, res) => {
  let browser = null;

  try {
    const { url, selector, fullPage, width, height, format, quality } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: url'
      });
    }

    const screenshotOptions = {
      type: format === 'jpeg' ? 'jpeg' : 'png',
    };

    if (format === 'jpeg') {
      screenshotOptions.quality = parseInt(quality) || 80;
    }

    const launchOptions = {
      headless: true,
      args: [
        ...chromium.args,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ],
      executablePath: await chromium.executablePath()
    };

    browser = await puppeteer.launch(launchOptions);

    const page = await browser.newPage();

    if (width && height) {
      await page.setViewport({
        width: parseInt(width) || 1920,
        height: parseInt(height) || 1080
      });
    }

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    let screenshotBuffer;

    if (selector) {
      // Wait for element and screenshot it
      await page.waitForSelector(selector, { timeout: 10000 });
      const element = await page.$(selector);
      
      if (!element) {
        throw new Error(`Element not found: ${selector}`);
      }

      screenshotBuffer = await element.screenshot(screenshotOptions);
    } else {
      screenshotOptions.fullPage = fullPage === true || fullPage === 'true';
      screenshotBuffer = await page.screenshot(screenshotOptions);
    }

    const base64Image = screenshotBuffer.toString('base64');

    await browser.close();
    browser = null;

    res.json({
      success: true,
      data: {
        image: base64Image,
        format: screenshotOptions.type,
        size: screenshotBuffer.length
      },
      metadata: {
        url: url,
        selector: selector || null,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Element screenshot error:', error);

    if (browser) {
      await browser.close();
    }

    res.status(500).json({
      success: false,
      error: 'Failed to capture element screenshot',
      details: error.message
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    availableEndpoints: ['GET /', 'GET /health', 'GET /screenshot', 'POST /screenshot/element']
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log('=================================');
  console.log('📸 Screenshot API Server');
  console.log('=================================');
  console.log(`Status: Running`);
  console.log(`Port: ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Time: ${new Date().toLocaleString()}`);
  console.log('=================================');
  console.log(`Test: http://localhost:${PORT}`);
  console.log('=================================');
});

module.exports = app;
