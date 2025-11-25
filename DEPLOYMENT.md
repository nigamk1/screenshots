# Deployment Guide - Quick Start

This guide covers deploying your Screenshot API to popular free hosting platforms.

## 🚀 Option 1: Render.com (Recommended)

**Best for**: Production-ready free tier, automatic deployments

### Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Screenshot API"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/screenshot-api.git
   git push -u origin main
   ```

2. **Deploy on Render**
   - Go to [dashboard.render.com](https://dashboard.render.com)
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repository
   - Configure:
     - **Name**: `screenshot-api` (or your preferred name)
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: `Free`

3. **Environment Variables** (Optional)
   - Click **"Advanced"**
   - Add variables from `.env.example` if needed

4. **Deploy**
   - Click **"Create Web Service"**
   - Wait 5-10 minutes for initial build
   - Your API will be live at: `https://your-app-name.onrender.com`

5. **Test**
   ```bash
   curl "https://your-app-name.onrender.com/health"
   ```

### Notes:
- Free tier spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- Automatic redeployments on git push
- 750 hours/month free (enough for 1 service running 24/7)

---

## 🚂 Option 2: Railway.app

**Best for**: Developer-friendly, generous free tier

### Steps:

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Initialize**
   ```bash
   railway login
   railway init
   ```

3. **Deploy**
   ```bash
   railway up
   ```

4. **Add Domain**
   ```bash
   railway domain
   ```

5. **Set Environment Variables**
   ```bash
   railway variables set NODE_ENV=production
   ```

6. **Your API is live!**
   - Check dashboard: [railway.app/dashboard](https://railway.app/dashboard)
   - URL: `https://your-project.railway.app`

### Notes:
- $5 free credit/month
- No auto-sleep
- Great performance
- Easy GitHub integration

---

## ☁️ Option 3: Vercel (Serverless)

**Best for**: Serverless functions, fast global CDN

⚠️ **Note**: Puppeteer requires special configuration on Vercel. Consider using `chrome-aws-lambda` package.

### Steps:

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Modify package.json** (add chrome-aws-lambda)
   ```bash
   npm install chrome-aws-lambda
   ```

3. **Update server.js** (use chrome-aws-lambda instead of puppeteer)

4. **Deploy**
   ```bash
   vercel --prod
   ```

### Notes:
- Function timeout: 10s (Hobby), 60s (Pro)
- May require Pro plan for reliable screenshot generation
- Excellent for high-traffic APIs

---

## 🐳 Option 4: Fly.io

**Best for**: Global edge deployment, Docker support

### Steps:

1. **Install Fly CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login**
   ```bash
   fly auth login
   ```

3. **Initialize App**
   ```bash
   fly launch
   ```
   - Follow prompts
   - Choose region closest to your users

4. **Deploy**
   ```bash
   fly deploy
   ```

### Notes:
- Free tier: 3 shared CPUs, 256MB RAM
- Excellent global performance
- Built-in SSL certificates

---

## 🔧 Post-Deployment Checklist

After deploying to any platform:

- [ ] Test `/health` endpoint
- [ ] Test `/screenshot?url=https://example.com`
- [ ] Verify Base64 output is valid
- [ ] Check response times (<5 seconds)
- [ ] Test error handling (invalid URL)
- [ ] Set up monitoring (UptimeRobot)
- [ ] Configure custom domain (optional)
- [ ] Add URL to RapidAPI configuration

---

## 📊 Monitoring Setup

### UptimeRobot (Free)

1. Sign up at [uptimerobot.com](https://uptimerobot.com)
2. Add new monitor:
   - **Type**: HTTP(s)
   - **URL**: `https://your-api.com/health`
   - **Interval**: 5 minutes
   - **Alert**: Email/SMS

### Health Check Script (Local)

```bash
# test-health.sh
while true; do
  response=$(curl -s -o /dev/null -w "%{http_code}" https://your-api.com/health)
  if [ $response -eq 200 ]; then
    echo "✓ API is healthy"
  else
    echo "✗ API is down (Status: $response)"
  fi
  sleep 300 # Check every 5 minutes
done
```

---

## 🔄 Continuous Deployment

All platforms support automatic deployments on git push:

**Render**: Auto-deploy on push to connected branch
**Railway**: Auto-deploy on push (configure in dashboard)
**Vercel**: Auto-deploy on push to production branch
**Fly.io**: Use GitHub Actions for CD

---

## 💰 Scaling to Paid Plans (When Needed)

### When to Upgrade:

- API receives >1000 requests/day consistently
- Response times degrade on free tier
- Need guaranteed uptime (no cold starts)
- Monthly revenue >₹5,000

### Recommended Upgrades:

**Render**: $7/month (Starter) - No cold starts, more resources
**Railway**: $10/month - Volume pricing, predictable costs
**Fly.io**: $5-10/month - Pay for what you use

---

## 🐛 Common Deployment Issues

### Issue: "Error: Failed to launch browser"
**Solution**: Ensure platform supports Puppeteer. Check build logs for missing dependencies.

### Issue: "Memory limit exceeded"
**Solution**: Reduce concurrent requests or upgrade hosting plan.

### Issue: "Timeout errors"
**Solution**: Increase timeout settings or optimize Puppeteer configuration.

### Issue: "Cold start delays"
**Solution**: Upgrade to paid plan or implement keep-alive ping service.

---

## 📦 Quick Deploy Commands Reference

```bash
# Render (via GitHub)
git push origin main

# Railway
railway up

# Vercel
vercel --prod

# Fly.io
fly deploy

# Check logs
railway logs          # Railway
fly logs              # Fly.io
vercel logs           # Vercel
# Render: Check dashboard
```

---

**You're now ready to deploy and monetize your Screenshot API! 🎉**

Next step: [Publishing on RapidAPI](./RAPIDAPI_GUIDE.md)
