# 🚀 Render Deployment Steps

Your code is now on GitHub at: **https://github.com/nigamk1/screenshots.git**

## Deploy to Render.com - Follow These Steps:

### Step 1: Sign Up / Login to Render
1. Go to: **https://dashboard.render.com/**
2. Sign up with your GitHub account (recommended) or email
3. Authorize Render to access your GitHub repositories

### Step 2: Create New Web Service
1. Click the **"New +"** button in the top right
2. Select **"Web Service"**
3. Connect your GitHub account if not already connected

### Step 3: Select Your Repository
1. Find and select: **screenshots** repository
2. Click **"Connect"**

### Step 4: Configure Your Service

Fill in the following details:

**Basic Settings:**
- **Name**: `screenshot-api` (or any name you prefer)
- **Region**: Choose closest to your target audience
  - Frankfurt (Europe)
  - Oregon (US West)
  - Ohio (US East)
  - Singapore (Asia)
- **Branch**: `main`
- **Root Directory**: (leave blank)

**Build & Deploy Settings:**
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Instance Type:**
- Select: **Free** (to start with)
- Note: Free tier spins down after 15 min of inactivity

### Step 5: Environment Variables (Optional)

Click **"Advanced"** and add these if you want custom settings:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `DEFAULT_VIEWPORT_WIDTH` | `1920` |
| `DEFAULT_VIEWPORT_HEIGHT` | `1080` |
| `DEFAULT_TIMEOUT` | `30000` |

*Note: These are optional - the app works fine with defaults*

### Step 6: Create Web Service

1. Click **"Create Web Service"** button at the bottom
2. Wait 5-10 minutes for the first build
3. Watch the build logs in real-time

### Step 7: Get Your API URL

Once deployed successfully:
1. Your URL will be: `https://screenshot-api-xxxx.onrender.com`
2. Copy this URL - you'll need it for RapidAPI
3. The exact URL will be shown at the top of your dashboard

### Step 8: Test Your Deployed API

**Test Health Endpoint:**
```bash
curl https://your-app-name.onrender.com/health
```

**Test Screenshot Endpoint:**
```bash
curl "https://your-app-name.onrender.com/screenshot?url=https://example.com"
```

**Test Web Interface:**
Open in browser: `https://your-app-name.onrender.com`

## ✅ Post-Deployment Checklist

- [ ] API is accessible via public URL
- [ ] `/health` endpoint returns `{"status":"healthy"}`
- [ ] `/screenshot` endpoint generates screenshots
- [ ] Web interface loads and works
- [ ] Response times are acceptable (<5 seconds)

## 📊 Monitor Your API

### In Render Dashboard:
- View logs in real-time
- Check resource usage
- Monitor uptime
- See request metrics

### Set Up External Monitoring (Recommended):
1. Sign up at: **https://uptimerobot.com**
2. Add monitor for your `/health` endpoint
3. Get alerts if API goes down

## 🔄 Auto-Deploy on Git Push

Render automatically redeploys when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Add new feature"
git push origin main

# Render will automatically detect and redeploy!
```

## 💰 Next Steps: Publish on RapidAPI

Once your API is live on Render:

1. Copy your Render URL
2. Follow the guide: `RAPIDAPI_GUIDE.md`
3. Use your Render URL as the Base URL in RapidAPI
4. Configure pricing and publish
5. Start earning! 💸

## 🆘 Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Verify `package.json` is correct
- Ensure all files are in GitHub

### API Returns Errors
- Check runtime logs
- Verify environment variables
- Test locally first: `npm start`

### Slow Response Times
- First request after spin-down takes 30s (free tier)
- Consider upgrading to paid plan for no cold starts
- Optimize screenshot parameters

### Out of Memory
- Free tier has 512MB RAM limit
- Reduce viewport sizes
- Limit concurrent requests
- Upgrade to paid plan if needed

## 💡 Tips

1. **Keep API Active**: Use UptimeRobot to ping every 5 minutes
2. **Monitor Logs**: Check Render dashboard daily
3. **Track Metrics**: Watch response times and error rates
4. **Backup Code**: GitHub is your backup
5. **Plan Upgrades**: When revenue > ₹5,000/month, upgrade to paid plan

## 🎉 You're Live!

Your Screenshot API is now:
- ✅ Deployed on Render
- ✅ Accessible worldwide
- ✅ Ready for RapidAPI integration
- ✅ Ready to generate revenue

**Next**: Follow `RAPIDAPI_GUIDE.md` to monetize your API!

---

**Need Help?**
- Render Docs: https://render.com/docs
- Support: https://render.com/support
- Community: https://community.render.com
