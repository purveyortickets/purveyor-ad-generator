# Purveyor Tickets — Ad Image Generator

A password-protected web app for generating branded ad images for Facebook, TikTok, and Instagram.

## Features
- 🔐 Password-protected (server-side via Vercel env variable)
- 🖼️ Upload event image + type event name → generates a branded 1080×1080 ad
- ⬇️ Download as PNG
- 🎨 Purveyor Tickets branded (purple theme, logo, social links, Discord CTA)

---

## Deploy to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Purveyor Ad Generator"
git remote add origin https://github.com/YOUR_USERNAME/purveyor-ad-generator.git
git push -u origin main
```

### 2. Import to Vercel
- Go to [vercel.com/new](https://vercel.com/new)
- Import your GitHub repo
- Framework: **Vite**
- Build command: `vite build`
- Output directory: `dist`

### 3. Set the Master Password (CRITICAL)
In Vercel Dashboard:
1. Go to your project → **Settings** → **Environment Variables**
2. Add a new variable:
   - **Name:** `MASTER_PASSWORD`
   - **Value:** Your chosen password (e.g. `PurveyorSecure2026!`)
   - **Environments:** Production, Preview, Development
3. Click **Save**
4. **Redeploy** the project for the variable to take effect

> ⚠️ The password is NEVER in the source code. It only exists in Vercel's encrypted environment variables.

### 4. Done!
Visit your Vercel URL → Enter password → Generate ads!

---

## Local Development

```bash
npm install
# Create a .env file (git-ignored)
echo "MASTER_PASSWORD=your_password_here" > .env
npm run dev
```

## File Structure
```
purveyor-ad-generator/
├── api/
│   └── auth.js          # Serverless password check
├── src/
│   └── main.jsx         # React entry point
├── index.jsx            # Main app component
├── index.html           # HTML entry
├── package.json
├── vite.config.js
├── vercel.json
└── README.md
```
