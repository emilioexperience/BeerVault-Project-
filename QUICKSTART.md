# ⚡ BeerVault - Quick Start Guide

Get BeerVault running in 5 minutes!

## 🎯 Choose Your Path

### Path 1: Just Want to See It? (30 seconds)
```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/beervault.git
cd beervault

# Open in browser
open index.html  # Mac
start index.html # Windows
xdg-open index.html # Linux
```

That's it! The app will run with demo data.

---

### Path 2: Run Locally with Full Features (2 minutes)
```bash
# Clone and enter directory
git clone https://github.com/YOUR_USERNAME/beervault.git
cd beervault

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:3000 🎉

---

### Path 3: Deploy to GitHub Pages (5 minutes)

**Step 1: Prep Your Repo**
```bash
# Initialize git
git init
git add .
git commit -m "Initial commit"

# Create GitHub repo at github.com/new
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/beervault.git
git push -u origin main
```

**Step 2: Update Configuration**

Edit `vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/beervault/', // Your repo name
})
```

Edit `package.json`:
```json
{
  "homepage": "https://YOUR_USERNAME.github.io/beervault"
}
```

**Step 3: Deploy**
```bash
npm install
npm run deploy
```

**Step 4: Enable GitHub Pages**
- Go to your repo → Settings → Pages
- Source: Deploy from branch
- Branch: gh-pages
- Save

**Access Your App**
- `https://YOUR_USERNAME.github.io/beervault`
- Live in 2-3 minutes! ⚡

---

## 📱 First-Time User Guide

### 1. Login (Demo)
- Click "Demo Login" to start
- No sign-up needed for testing

### 2. Add Your First Beer
1. Click **"Add Beer"** button (top right)
2. Fill in the form:
   - Beer name: "Your favorite beer"
   - Brewery: "Brewery name"
   - Style: Pick from dropdown
   - Rating: Click stars (1-5)
   - ABV, IBU, Price: Optional
   - Location: Where you tried it
   - Flavors: Click tags that apply
   - Notes: Your thoughts!
3. Click **"Add Beer to Journal"**

### 3. Explore Features

**Feed Tab** 🏠
- See community posts
- Like beers (❤️)
- Comment on posts
- Sort by recent/rating/popular

**Journal Tab** 📖
- View your collection
- Switch grid/list view
- See your stats
- Track your progress

**Discover Tab** 🌍
- Find new beers
- Search functionality
- Add to "Want List"
- Explore categories

**Analytics Tab** 📊
- View statistics
- Flavor preferences
- Unlock achievements
- Track your journey

---

## 🎨 Customization

### Change Colors
Edit the gradient values in `beer-tracker.jsx`:

```javascript
// Header gradient
className="bg-gradient-to-r from-amber-900 via-orange-800 to-amber-900"

// Change to your colors:
className="bg-gradient-to-r from-blue-900 via-indigo-800 to-blue-900"
```

### Add Your Logo
Replace the 🍺 emoji with an image:
```javascript
<img src="/your-logo.png" alt="BeerVault" className="w-12 h-12" />
```

### Modify Beer Styles
Edit the `beerStyles` array:
```javascript
const beerStyles = [
  'all', 'IPA', 'Pale Ale', 
  'Your Custom Style', // Add yours here
  // ... more styles
];
```

---

## 🔧 Common Issues

### Issue: "npm not found"
**Solution:** Install Node.js from https://nodejs.org

### Issue: GitHub Pages shows 404
**Solution:** 
1. Check gh-pages branch exists
2. Wait 2-3 minutes after deploy
3. Clear browser cache

### Issue: Images not loading
**Solution:** 
- Using emoji placeholders by default
- For real images, add image hosting (see DEPLOYMENT.md)

### Issue: Build fails
**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 🚀 Next Steps

### Add Backend (Optional)
1. **Firebase** - Best for beginners
   ```bash
   npm install firebase
   ```
   See DEPLOYMENT.md for full setup

2. **Supabase** - PostgreSQL alternative
   ```bash
   npm install @supabase/supabase-js
   ```

### Enable Image Uploads
1. **Cloudinary** - 25GB free
   - Sign up at cloudinary.com
   - Add upload widget

2. **ImgBB** - Unlimited free
   - Get API key from imgbb.com
   - Integrate upload endpoint

### Add Authentication
```bash
npm install firebase
# Configure Firebase Auth in src/firebase.js
```

### Progressive Web App
1. Add manifest.json
2. Register service worker
3. Enable offline mode

See DEPLOYMENT.md for detailed guides!

---

## 📚 Resources

- **Full Documentation:** See README.md
- **Deployment Guide:** See DEPLOYMENT.md  
- **Feature List:** See FEATURES.md
- **Get Help:** Open an issue on GitHub

---

## 💡 Pro Tips

1. **Take Good Photos** 📸
   - Good lighting
   - Clear beer label
   - Nice composition

2. **Write Detailed Notes** ✍️
   - First impressions
   - Flavor progression
   - Overall experience

3. **Be Consistent** 📊
   - Rate honestly
   - Use same criteria
   - Compare similar styles

4. **Engage Socially** 👥
   - Like interesting posts
   - Comment with insights
   - Share discoveries

5. **Explore Styles** 🎯
   - Try new categories
   - Compare within styles
   - Build diverse collection

---

## 🎉 You're Ready!

Start tracking your beer adventures now!

**Demo User Credentials:**
- Just click "Demo Login"
- Explore with pre-loaded data
- Add your own beers
- Share with friends!

---

**Questions?** Open an issue on GitHub
**Found a bug?** Submit a pull request
**Love it?** Give us a ⭐ on GitHub

**Cheers! 🍻**
