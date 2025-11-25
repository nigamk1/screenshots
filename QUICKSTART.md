# Quick Start Guide

Get your Screenshot API running in 5 minutes!

## 🚀 Local Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the server**
   ```bash
   npm start
   ```

3. **Test it**
   Open browser: http://localhost:3000

## 🧪 Test the API

**Using the web interface:**
- Open http://localhost:3000 in your browser
- Enter a URL and click "Generate Screenshot"

**Using cURL:**
```bash
curl "http://localhost:3000/screenshot?url=https://example.com"
```

**Using automated tests:**
```bash
npm test
```

## 📤 Deploy in 3 Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Render**
   - Visit render.com
   - Connect your GitHub repo
   - Click "Create Web Service"

3. **Get your URL**
   - Copy your API URL: `https://your-app.onrender.com`

## 💰 Publish on RapidAPI

1. Sign up at rapidapi.com
2. Add your API with the deployed URL
3. Configure pricing tiers
4. Publish and start earning!

**Detailed guides:**
- [Deployment Guide](./DEPLOYMENT.md)
- [RapidAPI Integration](./RAPIDAPI_GUIDE.md)

## 📝 API Usage Examples

**Basic screenshot:**
```
GET /screenshot?url=https://example.com
```

**Full page with custom size:**
```
GET /screenshot?url=https://example.com&fullPage=true&width=1366&height=768
```

**JPEG format:**
```
GET /screenshot?url=https://example.com&format=jpeg&quality=90
```

## 🆘 Need Help?

- Read [README.md](./README.md) for full documentation
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for hosting options
- See [RAPIDAPI_GUIDE.md](./RAPIDAPI_GUIDE.md) for monetization

---

**Ready to launch your API business! 🎉**
