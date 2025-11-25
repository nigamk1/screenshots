# Screenshot API

A lightweight, high-performance web service that generates website screenshots programmatically using a simple HTTP request.

## 🚀 Features

- **Simple REST API** - Single endpoint for screenshot generation
- **Base64 Output** - Easy integration with frontend and mobile apps
- **Customizable** - Control viewport size, format, quality, and more
- **Full Page Capture** - Option to capture entire scrollable page
- **Element Selection** - Target specific DOM elements using CSS selectors
- **Fast & Efficient** - Powered by Puppeteer and headless Chrome
- **Free Deployment** - Runs on Render, Railway, Vercel, and more
- **RapidAPI Ready** - Built for marketplace monetization

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Git (for deployment)

## 🔧 Installation

1. **Clone or download this repository**
   ```bash
   git clone <your-repo-url>
   cd Screenshots
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration (optional for local testing)

4. **Start the server**
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Test the API**
   ```bash
   npm test
   ```

## 🌐 API Endpoints

### GET /screenshot

Captures a screenshot of the specified URL.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `url` | string | ✅ Yes | - | Target website URL (must include http:// or https://) |
| `fullPage` | boolean | No | `false` | Capture full scrollable page |
| `width` | number | No | `1920` | Viewport width (320-3840) |
| `height` | number | No | `1080` | Viewport height (240-2160) |
| `format` | string | No | `png` | Output format: `png` or `jpeg` |
| `quality` | number | No | `80` | JPEG quality (1-100, only for JPEG format) |
| `delay` | number | No | `0` | Delay before screenshot in ms (max 10000) |

**Example Request:**
```bash
GET /screenshot?url=https://example.com&fullPage=true&width=1366&height=768
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "image": "iVBORw0KGgoAAAANSUhEUgAAA...",
    "format": "png",
    "size": 245678,
    "dimensions": {
      "width": 1366,
      "height": 768,
      "fullPage": true
    }
  },
  "metadata": {
    "url": "https://example.com",
    "timestamp": "2025-11-25T12:34:56.789Z",
    "processingTime": "2456ms"
  }
}
```

### POST /screenshot/element

Captures a screenshot of a specific element using a CSS selector.

**Request Body:**
```json
{
  "url": "https://example.com",
  "selector": ".main-content",
  "width": 1920,
  "height": 1080,
  "format": "png",
  "quality": 90
}
```

### GET /health

Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-25T12:34:56.789Z"
}
```

## 🧪 Testing Locally

Using **cURL:**
```bash
curl "http://localhost:3000/screenshot?url=https://example.com" | jq .
```

Using **JavaScript/Node.js:**
```javascript
const response = await fetch('http://localhost:3000/screenshot?url=https://example.com');
const data = await response.json();

// Convert Base64 to image
const imgBuffer = Buffer.from(data.data.image, 'base64');
require('fs').writeFileSync('screenshot.png', imgBuffer);
```

Using **Python:**
```python
import requests
import base64

response = requests.get('http://localhost:3000/screenshot?url=https://example.com')
data = response.json()

# Save image
img_data = base64.b64decode(data['data']['image'])
with open('screenshot.png', 'wb') as f:
    f.write(img_data)
```

## 🚢 Deployment

### Deploy to Render.com (Recommended)

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. **Create new Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `screenshot-api`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free

3. **Add environment variables** (optional)
   - `NODE_ENV=production`
   - `DEFAULT_TIMEOUT=30000`

4. **Deploy** - Render will build and deploy automatically

5. **Get your API URL**: `https://screenshot-api-xxxx.onrender.com`

### Deploy to Railway

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login and deploy:
   ```bash
   railway login
   railway init
   railway up
   ```

### Deploy to Vercel (Serverless)

⚠️ Note: Puppeteer requires special configuration on Vercel. Consider Render or Railway for easier setup.

## 💰 Publishing on RapidAPI

1. **Sign up at [RapidAPI](https://rapidapi.com/)**

2. **Add your API:**
   - Go to "My APIs" → "Add New API"
   - **Base URL**: Your deployed URL (e.g., `https://your-api.onrender.com`)
   - **Category**: Developer Tools / Utilities

3. **Configure endpoint:**
   - **Path**: `/screenshot`
   - **Method**: GET
   - **Parameters**: Add all query parameters with descriptions
   - **Test**: Use the built-in console to test

4. **Set up pricing tiers:**
   ```
   FREE: 50 requests/month - ₹0
   BASIC: 1,000 requests/month - ₹299
   PRO: 10,000 requests/month - ₹699
   ULTRA: 100,000 requests/month - ₹1,499
   ```

5. **Add documentation:**
   - Copy examples from this README
   - Include code snippets in multiple languages
   - Add use cases and best practices

6. **Publish and promote** your API!

## 📊 Use Cases

- **SEO & Analytics** - Website thumbnails and previews
- **Social Media** - Automated Open Graph image generation
- **Testing** - Visual regression testing
- **Documentation** - Auto-generate UI screenshots
- **Archival** - Website backup and monitoring
- **Content Generation** - Blog post featured images
- **Mobile Apps** - Server-side screenshot generation

## ⚙️ Configuration

Environment variables (`.env`):

```env
PORT=3000
NODE_ENV=production
DEFAULT_VIEWPORT_WIDTH=1920
DEFAULT_VIEWPORT_HEIGHT=1080
DEFAULT_TIMEOUT=30000
MAX_SCREENSHOT_WIDTH=3840
MAX_SCREENSHOT_HEIGHT=2160
```

## 🔒 Security Considerations

- **Rate Limiting**: Implement on RapidAPI tier or use middleware
- **URL Validation**: Built-in validation prevents malicious URLs
- **Timeout Protection**: Prevents infinite loading
- **Resource Limits**: Viewport size restrictions prevent memory issues

## 🐛 Troubleshooting

**Error: "Failed to launch browser"**
- Solution: Ensure `--no-sandbox` flag is enabled (already configured)

**Error: "TimeoutError"**
- Solution: Increase `DEFAULT_TIMEOUT` or use `delay` parameter

**Error: "Memory issues on free tier"**
- Solution: Limit concurrent requests or upgrade hosting plan

**Screenshots are blank**
- Solution: Increase `delay` parameter for JavaScript-heavy sites

## 📈 Performance Tips

1. **Cache responses** for frequently requested URLs
2. **Use JPEG format** for smaller file sizes
3. **Limit viewport size** to reduce processing time
4. **Implement CDN** for Base64 image delivery
5. **Add Redis** for request queuing on high load

## 🛠️ Future Enhancements

- [ ] PDF generation
- [ ] Device emulation (mobile, tablet)
- [ ] Custom headers and cookies
- [ ] Screenshot scheduling
- [ ] S3/Cloud storage integration
- [ ] Watermarking
- [ ] Screenshot history/dashboard

## 📄 License

MIT License - feel free to use commercially

## 🤝 Contributing

Pull requests welcome! Please test thoroughly before submitting.

## 📞 Support

- **Issues**: Open a GitHub issue
- **Email**: your-email@example.com
- **RapidAPI**: Contact through marketplace

---

**Made with ❤️ for developers who need reliable screenshot automation**
