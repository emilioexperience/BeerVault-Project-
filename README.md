# 🍺 BeerVault - Social Beer Tracking App

A beautiful, interactive beer tracking and social discovery application built with React. Track your beer adventures, share with the community, and discover new brews!

## ✨ Features

### Core Features
- **Personal Beer Journal** - Save every beer with photos, ratings, flavors, price, and location
- **Social Feed** - Share your beer discoveries with other users
- **Interactive Ratings** - 0-5 star rating system with hover effects
- **Rich Flavor Profiles** - Tag beers with multiple flavor characteristics
- **Price & Location Tracking** - Keep track of where you found great deals

### Discovery & Social
- **Community Feed** - See what others are drinking
- **Sort & Filter** - Find beers by style, rating, or popularity
- **Like & Comment** - Engage with other beer enthusiasts
- **Want to Try List** - Bookmark beers for later
- **User Profiles** - Track your beer journey statistics

### Analytics & Insights
- **Personal Dashboard** - View your beer statistics at a glance
- **Style Breakdown** - See which beer styles you prefer
- **Flavor Profile Analysis** - Understand your taste preferences
- **Achievement System** - Unlock badges as you explore
- **Trending Discoveries** - Find popular beers in your area

### Advanced Features
- **Search Functionality** - Quick search across beers, breweries, and styles
- **Multiple View Modes** - Grid and list views for your journal
- **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- **Smooth Animations** - Beautiful transitions and hover effects
- **Dark Mode Ready** - Eye-friendly interface (coming soon)

## 🎨 Design Philosophy

BeerVault features a warm, craft-focused aesthetic inspired by:
- Vintage beer labels and brewery aesthetics
- Rich amber and earth tones
- Smooth, delightful animations
- Professional, polished UI components

## 🚀 Quick Start

### Option 1: Run Locally with Vite

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Option 2: GitHub Pages Deployment

1. **Fork this repository**

2. **Enable GitHub Pages**
   - Go to Settings > Pages
   - Source: Deploy from a branch
   - Branch: gh-pages (will be created automatically)

3. **Deploy**
   ```bash
   npm run deploy
   ```

4. **Access your app**
   - Your app will be live at: `https://yourusername.github.io/beervault`

### Option 3: Quick Test (No Installation)

Simply open `index.html` in your browser to try the demo version!

## 📦 Project Structure

```
beervault/
├── src/
│   ├── components/
│   │   ├── BeerCard.jsx
│   │   ├── FeedView.jsx
│   │   ├── JournalView.jsx
│   │   ├── DiscoverView.jsx
│   │   ├── AnalyticsView.jsx
│   │   └── AddBeerModal.jsx
│   ├── App.jsx
│   └── main.jsx
├── public/
│   └── assets/
├── package.json
├── vite.config.js
├── index.html
└── README.md
```

## 🔧 Configuration

### Backend Setup (Optional - For Production)

The app currently uses local state management. For a production app, you can integrate:

**Option 1: Firebase (Free)**
```javascript
// Install Firebase
npm install firebase

// Configure in src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

**Option 2: Supabase (Free)**
```javascript
npm install @supabase/supabase-js

// Configure in src/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'your-project-url';
const supabaseKey = 'your-anon-key';
export const supabase = createClient(supabaseUrl, supabaseKey);
```

### Image Hosting (Free Options)

**Option 1: Cloudinary**
- Free tier: 25 GB storage, 25 GB bandwidth
- Setup: https://cloudinary.com

**Option 2: ImgBB**
- Free unlimited image hosting
- API available for programmatic upload

**Option 3: GitHub LFS**
- Included with GitHub (1GB free)
- Great for storing user-uploaded images

## 🎯 Roadmap

### Phase 1: MVP (Current)
- ✅ Core beer journal functionality
- ✅ Social feed
- ✅ Basic analytics
- ✅ Search and filters
- ✅ Responsive design

### Phase 2: Enhanced Social (Next)
- [ ] User authentication (Firebase/Supabase)
- [ ] Real-time feed updates
- [ ] Follow/unfollow users
- [ ] Comments and discussions
- [ ] Share to social media

### Phase 3: Advanced Features
- [ ] Map view of beer locations
- [ ] Brewery directory
- [ ] Beer recommendations AI
- [ ] Import from photo OCR
- [ ] Export data (CSV/JSON)
- [ ] PWA capabilities (offline mode)

### Phase 4: Gamification
- [ ] More achievements and badges
- [ ] Leaderboards
- [ ] Beer tasting challenges
- [ ] Streak tracking
- [ ] Custom beer lists

## 🛠️ Tech Stack

- **Frontend**: React 18 + Hooks
- **Styling**: Tailwind CSS (via CDN)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Fonts**: Google Fonts (Playfair Display)
- **Deployment**: GitHub Pages / Vercel / Netlify

## 📱 Progressive Web App

To make BeerVault installable on mobile devices:

1. Add a `manifest.json`:
```json
{
  "name": "BeerVault",
  "short_name": "BeerVault",
  "description": "Track and discover great beers",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FEF3C7",
  "theme_color": "#78350F",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

2. Register a service worker for offline functionality

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev)
- Fonts by [Google Fonts](https://fonts.google.com)
- Inspired by craft beer culture worldwide 🍻

## 💡 Tips for Best Experience

1. **Take Quality Photos** - Good lighting makes your beer posts stand out
2. **Be Descriptive** - Detailed tasting notes help others discover great beers
3. **Engage with Community** - Like and comment on others' posts
4. **Track Prices** - Find the best deals in your area
5. **Try New Styles** - Expand your palate and unlock achievements

## 🐛 Known Issues & Limitations

- Currently uses local state (data resets on page refresh)
- Image upload uses emoji placeholders (backend needed for real images)
- No real-time sync between users (requires backend)
- Authentication is demo-only

## 📞 Support

Have questions or suggestions? Open an issue on GitHub!

---

**Built with ❤️ for beer enthusiasts everywhere**

Drink responsibly! 🍺
