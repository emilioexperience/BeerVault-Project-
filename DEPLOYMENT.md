# 🚀 BeerVault Deployment Guide

This guide covers multiple deployment options for BeerVault, all using free hosting services.

## Option 1: GitHub Pages (Recommended for Static Hosting)

### Prerequisites
- GitHub account
- Git installed locally

### Steps

1. **Create a new repository on GitHub**
   ```bash
   # Repository name: beervault
   # Make it public
   ```

2. **Initialize and push your code**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - BeerVault app"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/beervault.git
   git push -u origin main
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Update vite.config.js**
   ```javascript
   // Change base to your repo name
   base: '/beervault/'
   ```

5. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```

6. **Configure GitHub Pages**
   - Go to your repository Settings
   - Navigate to Pages section
   - Source: Deploy from branch
   - Branch: gh-pages
   - Save

7. **Access your app**
   - URL: `https://YOUR_USERNAME.github.io/beervault`
   - Wait 2-3 minutes for initial deployment

### Auto-deployment with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Build
      run: npm run build
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

---

## Option 2: Vercel (Best for React Apps)

### Why Vercel?
- Automatic deployments from GitHub
- Free SSL certificates
- Global CDN
- Zero configuration for React
- Preview deployments for PRs

### Steps

1. **Sign up at [Vercel](https://vercel.com)**

2. **Connect your GitHub repository**
   - Click "New Project"
   - Import your GitHub repo
   - Vercel auto-detects Vite configuration

3. **Configure project** (usually auto-detected)
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Deploy**
   - Click "Deploy"
   - Your app will be live in ~1 minute
   - URL: `beervault.vercel.app` (or custom domain)

### Environment Variables (for production features)

In Vercel dashboard, add:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

---

## Option 3: Netlify

### Why Netlify?
- Simple drag-and-drop deployment
- Form handling (useful for feedback)
- Serverless functions
- Free SSL and CDN

### Steps

1. **Sign up at [Netlify](https://netlify.com)**

2. **Deploy via GitHub**
   - New site from Git
   - Connect to GitHub
   - Select your repository
   
3. **Build settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

4. **Deploy**
   - Click "Deploy site"
   - Live in ~2 minutes
   - URL: `beervault.netlify.app`

### Netlify Configuration File

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

---

## Option 4: Firebase Hosting

### Why Firebase?
- Free tier: 10GB storage, 360MB/day transfer
- Perfect if you're using Firebase for backend
- Global CDN
- One-command deployment

### Steps

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase**
   ```bash
   firebase init hosting
   ```
   
   Configuration:
   ```
   Public directory: dist
   Single-page app: Yes
   Set up automatic builds: No
   ```

4. **Build your app**
   ```bash
   npm run build
   ```

5. **Deploy**
   ```bash
   firebase deploy --only hosting
   ```

6. **Access your app**
   - URL: `your-project.web.app`
   - Or: `your-project.firebaseapp.com`

### Firebase Configuration

`firebase.json`:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

---

## Option 5: Cloudflare Pages

### Why Cloudflare Pages?
- Unlimited bandwidth
- Unlimited requests
- Global CDN (fastest)
- Direct integration with GitHub

### Steps

1. **Sign up at [Cloudflare Pages](https://pages.cloudflare.com)**

2. **Connect GitHub**
   - Create a new project
   - Connect repository

3. **Build settings**
   ```
   Framework preset: None
   Build command: npm run build
   Build output directory: dist
   ```

4. **Deploy**
   - Automatic deployment on push
   - URL: `beervault.pages.dev`

---

## Database Backend Options (For Production)

### Firebase (Recommended for Beginners)

**Free Tier:**
- Firestore: 1GB storage, 50K reads/day
- Authentication: Unlimited
- Storage: 5GB, 1GB/day transfer

**Setup:**
```bash
npm install firebase
```

```javascript
// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

### Supabase (PostgreSQL Alternative)

**Free Tier:**
- 500MB database
- 1GB file storage
- 2GB bandwidth

**Setup:**
```bash
npm install @supabase/supabase-js
```

```javascript
// src/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

---

## Image Hosting Solutions

### Cloudinary (Recommended)
- **Free tier:** 25GB storage, 25GB bandwidth
- **Upload widget:** Easy drag-and-drop
- **Image optimization:** Automatic
- **Setup:** https://cloudinary.com

### ImgBB
- **Free:** Unlimited images
- **API available**
- **Setup:** https://imgbb.com

### Uploadcare
- **Free tier:** 3GB storage, 3GB traffic
- **CDN included**
- **Setup:** https://uploadcare.com

---

## Custom Domain Setup

### For GitHub Pages
1. Buy domain (Namecheap, Google Domains, etc.)
2. Add CNAME file to repo with your domain
3. Configure DNS:
   ```
   Type: CNAME
   Name: www
   Value: YOUR_USERNAME.github.io
   ```

### For Vercel/Netlify/Cloudflare
1. Add domain in platform dashboard
2. Update DNS nameservers or add DNS records
3. SSL certificate auto-generated

---

## Performance Optimization

### 1. Code Splitting
```javascript
// Use React.lazy for route-based splitting
const AnalyticsView = React.lazy(() => import('./components/AnalyticsView'));
```

### 2. Image Optimization
- Use WebP format
- Lazy load images
- Implement responsive images

### 3. Bundle Size
```bash
# Analyze bundle
npm run build -- --mode analyze
```

### 4. Caching Strategy
- Cache static assets
- Use service workers
- Implement PWA features

---

## Monitoring & Analytics

### Google Analytics
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Sentry (Error Tracking)
```bash
npm install @sentry/react
```

---

## Troubleshooting

### Build fails on deployment
- Check Node.js version (use 18+)
- Verify all dependencies in package.json
- Clear cache: `rm -rf node_modules package-lock.json && npm install`

### 404 errors on refresh
- Add redirect rules (see platform-specific configs above)
- Ensure SPA routing is configured

### Environment variables not working
- Prefix with `VITE_` for Vite
- Add to platform's environment settings
- Rebuild after adding variables

---

## Security Checklist

- [ ] Use environment variables for API keys
- [ ] Enable HTTPS (automatic on all platforms)
- [ ] Implement rate limiting for API calls
- [ ] Add CORS configuration
- [ ] Validate user inputs
- [ ] Sanitize user-generated content
- [ ] Use Content Security Policy headers

---

## Cost Estimates (Beyond Free Tiers)

| Service | Free Tier | Paid (if needed) |
|---------|-----------|------------------|
| Vercel | Unlimited personal projects | $20/month team |
| Netlify | 100GB bandwidth | $19/month pro |
| Firebase | Good for ~10K users | ~$25/month for 100K users |
| Cloudflare Pages | Unlimited | Free forever |

---

## Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **Netlify Docs:** https://docs.netlify.com
- **Firebase Docs:** https://firebase.google.com/docs
- **Vite Docs:** https://vitejs.dev
- **React Docs:** https://react.dev

---

**Happy Deploying! 🍺**

Remember to update your README.md with the actual deployed URL once you've chosen a platform!
