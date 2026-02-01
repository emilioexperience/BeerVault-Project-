import React, { useState, useEffect, useRef } from 'react';
import { Camera, Star, MapPin, DollarSign, TrendingUp, Users, Search, Filter, Heart, MessageCircle, Share2, Award, BarChart3, Map, Plus, X, ChevronDown, Menu, Home, Book, Globe, User, Settings, Upload, Check, Trophy, LogOut, Eye, EyeOff, Image, Send, Copy, Link, Trash2 } from 'lucide-react';
import { isJsonBinConfigured, initJsonBin, JsonBinService } from './jsonbin.js';

// ============================================
// STORAGE UTILITIES (Fallback when Firebase not configured)
// ============================================
const Storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  }
};

// ============================================
// DEMO DATA
// ============================================
const getDemoBeers = () => [
  {
    id: '1',
    userId: '1',
    username: 'emil_beer_explorer',
    beerName: 'Valmiermuižas Tumšais',
    brewery: 'Valmiermuiža',
    style: 'Dark Lager',
    rating: 4.5,
    abv: 5.8,
    ibu: 28,
    price: 2.50,
    location: 'Valmiera, Latvia',
    locationCoords: { lat: 57.5384, lng: 25.4263 },
    flavors: ['malty', 'caramel', 'smooth'],
    notes: 'Rich caramel notes with a smooth finish. Perfect for autumn evenings.',
    image: null,
    imageEmoji: '🍺',
    date: '2024-11-28',
    likes: 12,
    likedBy: [],
    comments: [
      { id: 1, userId: '2', username: 'beer_enthusiast_lv', text: 'One of my favorites too!', date: '2024-11-28' }
    ]
  },
  {
    id: '2',
    userId: '2',
    username: 'beer_enthusiast_lv',
    beerName: 'Užavas Pale Ale',
    brewery: 'Užavas Alus',
    style: 'Pale Ale',
    rating: 4.0,
    abv: 5.2,
    ibu: 35,
    price: 2.80,
    location: 'Riga, Latvia',
    locationCoords: { lat: 56.9496, lng: 24.1052 },
    flavors: ['hoppy', 'citrus', 'refreshing'],
    notes: 'Great hoppy character with citrus notes. Very refreshing!',
    image: null,
    imageEmoji: '🍻',
    date: '2024-11-27',
    likes: 8,
    likedBy: [],
    comments: []
  }
];

const getDemoUsers = () => [
  { id: '1', username: 'emil_beer_explorer', email: 'emil@example.com', password: 'demo123', avatar: '🍺', joinDate: '2024-01-15', weeklyBeers: 12 },
  { id: '2', username: 'beer_enthusiast_lv', email: 'enthusiast@example.com', password: 'demo123', avatar: '🍻', joinDate: '2024-02-20', weeklyBeers: 8 },
  { id: '3', username: 'craft_beer_fan', email: 'craft@example.com', password: 'demo123', avatar: '🥃', joinDate: '2024-03-10', weeklyBeers: 15 },
];

// ============================================
// MAIN APP COMPONENT
// ============================================
export default function BeerTrackerApp() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('feed');
  const [beers, setBeers] = useState([]);
  const [users, setUsers] = useState([]);
  const [showAddBeer, setShowAddBeer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [useCloudStorage, setUseCloudStorage] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      // Try to initialize JSONBin.io
      const jsonBinReady = isJsonBinConfigured() && await initJsonBin(getDemoBeers(), getDemoUsers());
      setUseCloudStorage(jsonBinReady);

      if (jsonBinReady) {
        // Use JSONBin.io for shared storage
        console.log('Using JSONBin.io for shared data storage');

        // Fetch initial data
        const [cloudBeers, cloudUsers] = await Promise.all([
          JsonBinService.getBeers(),
          JsonBinService.getUsers()
        ]);

        setBeers(cloudBeers || []);
        setUsers(cloudUsers || []);

        // Check for saved user session
        const savedUser = Storage.get('beervault_current_user');
        if (savedUser) {
          setCurrentUser(savedUser);
        }

        setIsLoading(false);
      } else {
        // Use localStorage fallback
        console.log('JSONBin not configured - using localStorage');

        let storedUsers = Storage.get('beervault_users');
        if (!storedUsers || storedUsers.length === 0) {
          storedUsers = getDemoUsers();
          Storage.set('beervault_users', storedUsers);
        }
        setUsers(storedUsers);

        let storedBeers = Storage.get('beervault_beers');
        if (!storedBeers || storedBeers.length === 0) {
          storedBeers = getDemoBeers();
          Storage.set('beervault_beers', storedBeers);
        }
        setBeers(storedBeers);

        const rememberedUser = Storage.get('beervault_current_user');
        if (rememberedUser) {
          setCurrentUser(rememberedUser);
        }

        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  // Save to localStorage when not using cloud storage
  useEffect(() => {
    if (!useCloudStorage && beers.length > 0) {
      Storage.set('beervault_beers', beers);
    }
  }, [beers, useCloudStorage]);

  useEffect(() => {
    if (!useCloudStorage && users.length > 0) {
      Storage.set('beervault_users', users);
    }
  }, [users, useCloudStorage]);

  const userBeers = currentUser ? beers.filter(b => b.userId === currentUser.id) : [];

  const beerStyles = ['all', 'IPA', 'Pale Ale', 'Lager', 'Dark Lager', 'Stout', 'Porter', 'Wheat Beer', 'Sour', 'Belgian', 'Pilsner', 'Amber'];
  const flavorOptions = ['hoppy', 'malty', 'bitter', 'sweet', 'citrus', 'fruity', 'caramel', 'chocolate', 'coffee', 'smooth', 'crisp', 'refreshing'];

  const handleLogin = (user, remember = false) => {
    setCurrentUser(user);
    if (remember) {
      Storage.set('beervault_current_user', user);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    Storage.remove('beervault_current_user');
  };

  const handleRegister = async (newUser) => {
    const user = {
      ...newUser,
      id: Date.now().toString(),
      avatar: '🍺',
      joinDate: new Date().toISOString().split('T')[0],
      weeklyBeers: 0
    };

    if (useCloudStorage) {
      const savedUser = await JsonBinService.addUser(user);
      setUsers([...users, savedUser]);
      return savedUser;
    } else {
      const updatedUsers = [...users, user];
      setUsers(updatedUsers);
      return user;
    }
  };

  const handleAddBeer = async (newBeer) => {
    const beer = {
      ...newBeer,
      id: Date.now().toString(),
      userId: currentUser.id,
      username: currentUser.username,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      likedBy: [],
      comments: []
    };

    if (useCloudStorage) {
      await JsonBinService.addBeer(beer);
      setBeers([beer, ...beers]);
    } else {
      setBeers([beer, ...beers]);
    }

    // Update weekly beer count
    if (useCloudStorage) {
      await JsonBinService.updateUser(currentUser.id, {
        weeklyBeers: (currentUser.weeklyBeers || 0) + 1
      });
    }

    setShowAddBeer(false);
  };

  const handleDeleteBeer = async (beerId) => {
    if (window.confirm('Are you sure you want to delete this beer?')) {
      if (useCloudStorage) {
        await JsonBinService.deleteBeer(beerId);
      }
      setBeers(beers.filter(b => b.id !== beerId));
    }
  };

  const handleLike = async (beerId) => {
    const beer = beers.find(b => b.id === beerId);
    if (!beer) return;

    const likedBy = beer.likedBy || [];
    const hasLiked = likedBy.includes(currentUser.id);
    const newLikedBy = hasLiked
      ? likedBy.filter(id => id !== currentUser.id)
      : [...likedBy, currentUser.id];

    const updatedBeers = beers.map(b =>
      b.id === beerId
        ? { ...b, likes: newLikedBy.length, likedBy: newLikedBy }
        : b
    );
    setBeers(updatedBeers);

    if (useCloudStorage) {
      await JsonBinService.updateBeer(beerId, {
        likes: newLikedBy.length,
        likedBy: newLikedBy
      });
    }
  };

  const handleAddComment = async (beerId, commentText) => {
    const beer = beers.find(b => b.id === beerId);
    if (!beer) return;

    const newComment = {
      id: Date.now(),
      userId: currentUser.id,
      username: currentUser.username,
      text: commentText,
      date: new Date().toISOString().split('T')[0]
    };

    const updatedComments = [...(beer.comments || []), newComment];

    setBeers(beers.map(b =>
      b.id === beerId ? { ...b, comments: updatedComments } : b
    ));

    if (useCloudStorage) {
      await JsonBinService.updateBeer(beerId, { comments: updatedComments });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4 animate-bounce">🍺</div>
          <p className="text-amber-900 font-bold text-xl">Loading BeerVault...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} onRegister={handleRegister} users={users} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-amber-900 via-orange-800 to-amber-900 text-white shadow-xl border-b-4 border-amber-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🍺</div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: '"Playfair Display", serif' }}>BeerVault</h1>
                <p className="text-xs text-amber-200">
                  {useCloudStorage ? '🟢 Online Mode' : '🟡 Offline Mode'}
                </p>
              </div>
            </div>

            <nav className="hidden md:flex gap-4">
              {['feed', 'journal', 'discover', 'map', 'leaderboard', 'analytics'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 ${activeTab === tab ? 'bg-white text-amber-900 shadow-lg transform scale-105' : 'text-amber-100 hover:bg-amber-800'}`}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button onClick={() => setShowAddBeer(true)} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2">
                <Plus size={20} /><span className="hidden sm:inline">Add Beer</span>
              </button>

              <div className="relative group">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-2xl shadow-lg cursor-pointer">{currentUser.avatar}</div>
                <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border-2 border-amber-200 py-2 w-48 hidden group-hover:block">
                  <div className="px-4 py-2 border-b border-amber-100">
                    <p className="font-bold text-amber-900">{currentUser.username}</p>
                    <p className="text-xs text-amber-600">{currentUser.email}</p>
                  </div>
                  <button onClick={handleLogout} className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2">
                    <LogOut size={16} />Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        {activeTab === 'feed' && <FeedView beers={beers} currentUser={currentUser} onLike={handleLike} onAddComment={handleAddComment} onDelete={handleDeleteBeer} />}
        {activeTab === 'journal' && <JournalView userBeers={userBeers} currentUser={currentUser} onDelete={handleDeleteBeer} />}
        {activeTab === 'discover' && <DiscoverView beers={beers} />}
        {activeTab === 'map' && <MapView beers={beers} currentUser={currentUser} />}
        {activeTab === 'leaderboard' && <LeaderboardView users={users} currentUser={currentUser} />}
        {activeTab === 'analytics' && <AnalyticsView userBeers={userBeers} />}
      </main>

      {showAddBeer && <AddBeerModal onClose={() => setShowAddBeer(false)} onSubmit={handleAddBeer} flavorOptions={flavorOptions} beerStyles={beerStyles} />}

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-amber-900 via-orange-800 to-amber-900 border-t-4 border-amber-700 shadow-2xl">
        <div className="flex justify-around py-2">
          {[{ id: 'feed', icon: Home }, { id: 'journal', icon: Book }, { id: 'map', icon: Map }, { id: 'leaderboard', icon: Trophy }, { id: 'analytics', icon: BarChart3 }].map(({ id, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`p-2 rounded-xl transition-all ${activeTab === id ? 'bg-white text-amber-900 shadow-lg transform scale-110' : 'text-amber-200'}`}>
              <Icon size={20} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// AUTH SCREEN
// ============================================
function AuthScreen({ onLogin, onRegister, users }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    const user = users.find(u => u.email === email && u.password === password);
    if (user) onLogin(user, rememberMe);
    else setError('Invalid email or password');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (users.find(u => u.email === email)) { setError('Email already registered'); return; }
    if (users.find(u => u.username === username)) { setError('Username already taken'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    const newUser = await onRegister({ email, password, username });
    onLogin(newUser, rememberMe);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border-4 border-amber-300">
        <div className="text-center mb-8">
          <div className="text-7xl mb-4">🍺</div>
          <h1 className="text-4xl font-bold text-amber-900 mb-2" style={{ fontFamily: '"Playfair Display", serif' }}>BeerVault</h1>
          <p className="text-amber-700">Track. Share. Discover Great Beers.</p>
        </div>

        <div className="flex rounded-xl bg-amber-100 p-1 mb-6">
          <button onClick={() => { setMode('login'); setError(''); }} className={`flex-1 py-2 rounded-lg font-semibold transition-all ${mode === 'login' ? 'bg-white text-amber-900 shadow-md' : 'text-amber-700'}`}>Login</button>
          <button onClick={() => { setMode('register'); setError(''); }} className={`flex-1 py-2 rounded-lg font-semibold transition-all ${mode === 'register' ? 'bg-white text-amber-900 shadow-md' : 'text-amber-700'}`}>Register</button>
        </div>

        {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-amber-900 font-medium mb-1">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full px-4 py-3 rounded-xl border-2 border-amber-300 focus:ring-2 focus:ring-amber-500 bg-amber-50" placeholder="Choose a username" />
            </div>
          )}
          <div>
            <label className="block text-amber-900 font-medium mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-xl border-2 border-amber-300 focus:ring-2 focus:ring-amber-500 bg-amber-50" placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-amber-900 font-medium mb-1">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 rounded-xl border-2 border-amber-300 focus:ring-2 focus:ring-amber-500 bg-amber-50 pr-12" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-600">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="remember" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 text-amber-600 border-amber-300 rounded" />
            <label htmlFor="remember" className="text-amber-700 text-sm">Remember me</label>
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all">
            {mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>

        {mode === 'login' && (
          <div className="mt-6 text-center">
            <p className="text-sm text-amber-600 mb-2">Demo: emil@example.com / demo123</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// FEED VIEW
// ============================================
function FeedView({ beers, currentUser, onLike, onAddComment, onDelete }) {
  const [sortBy, setSortBy] = useState('recent');

  const sortedBeers = [...beers].sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'popular') return b.likes - a.likes;
    return 0;
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-4 border-2 border-amber-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-amber-900" style={{ fontFamily: '"Playfair Display", serif' }}>Community Feed</h2>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2 rounded-lg border-2 border-amber-300 bg-amber-50 text-amber-900 font-medium">
            <option value="recent">Most Recent</option>
            <option value="rating">Highest Rated</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      {sortedBeers.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍺</div>
          <p className="text-amber-700 font-medium">No beers yet. Be the first to add one!</p>
        </div>
      ) : (
        sortedBeers.map((beer) => (
          <BeerCard key={beer.id} beer={beer} currentUser={currentUser} onLike={onLike} onAddComment={onAddComment} onDelete={onDelete} />
        ))
      )}
    </div>
  );
}

// ============================================
// BEER CARD WITH DELETE
// ============================================
function BeerCard({ beer, currentUser, onLike, onAddComment, onDelete }) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const isOwner = beer.userId === currentUser?.id;
  const hasLiked = (beer.likedBy || []).includes(currentUser?.id);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(beer.id, newComment.trim());
      setNewComment('');
    }
  };

  const handleShare = async (type) => {
    const shareText = `Check out ${beer.beerName} by ${beer.brewery} on BeerVault! Rated ${beer.rating}/5 ⭐`;
    const shareUrl = window.location.href;

    if (type === 'copy') {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else if (type === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
    } else if (type === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    }
    setShowShareMenu(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-amber-200">
      <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b-2 border-amber-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-xl shadow-md">🍺</div>
            <div>
              <p className="font-bold text-amber-900">{beer.username}</p>
              <p className="text-xs text-amber-700">{beer.date}</p>
            </div>
          </div>
          {isOwner && (
            <button onClick={() => onDelete(beer.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete beer">
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="relative h-64 bg-gradient-to-br from-amber-100 via-yellow-100 to-orange-100 flex items-center justify-center overflow-hidden">
        {beer.image ? <img src={beer.image} alt={beer.beerName} className="w-full h-full object-cover" /> : <div className="text-9xl">{beer.imageEmoji || '🍺'}</div>}
        <div className="absolute top-3 right-3 bg-gradient-to-br from-amber-900 to-orange-900 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">{beer.style}</div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-2xl font-bold text-amber-900 mb-1" style={{ fontFamily: '"Playfair Display", serif' }}>{beer.beerName}</h3>
          <p className="text-amber-700 font-medium">{beer.brewery}</p>
        </div>

        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, i) => <Star key={i} size={24} className={i < Math.floor(beer.rating) ? 'fill-amber-500 text-amber-500' : 'text-amber-300'} />)}
          <span className="text-lg font-bold text-amber-900 ml-2">{beer.rating?.toFixed(1)}</span>
        </div>

        <div className="grid grid-cols-3 gap-3 py-3 border-y-2 border-amber-100">
          <div className="text-center"><p className="text-xs text-amber-600 font-medium">ABV</p><p className="text-lg font-bold text-amber-900">{beer.abv}%</p></div>
          <div className="text-center border-x-2 border-amber-100"><p className="text-xs text-amber-600 font-medium">IBU</p><p className="text-lg font-bold text-amber-900">{beer.ibu}</p></div>
          <div className="text-center"><p className="text-xs text-amber-600 font-medium">Price</p><p className="text-lg font-bold text-amber-900">€{beer.price}</p></div>
        </div>

        {beer.flavors && beer.flavors.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {beer.flavors.map((flavor, idx) => (
              <span key={idx} className="px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full text-sm font-medium border-2 border-amber-200">{flavor}</span>
            ))}
          </div>
        )}

        {beer.location && (
          <div className="flex items-center gap-2 text-amber-700">
            <MapPin size={16} /><span className="text-sm font-medium">{beer.location}</span>
          </div>
        )}

        {beer.notes && <p className="text-amber-800 leading-relaxed">{beer.notes}</p>}

        <div className="flex items-center justify-between pt-4 border-t-2 border-amber-100">
          <button onClick={() => onLike(beer.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${hasLiked ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg' : 'bg-amber-100 text-amber-900 hover:bg-amber-200'}`}>
            <Heart size={20} className={hasLiked ? 'fill-current' : ''} /><span>{beer.likes || 0}</span>
          </button>

          <button onClick={() => setShowComments(!showComments)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${showComments ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-900 hover:bg-amber-200'}`}>
            <MessageCircle size={20} /><span>{beer.comments?.length || 0}</span>
          </button>

          <div className="relative">
            <button onClick={() => setShowShareMenu(!showShareMenu)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-100 text-amber-900 font-medium hover:bg-amber-200 transition-all">
              <Share2 size={20} />
            </button>
            {showShareMenu && (
              <div className="absolute right-0 bottom-full mb-2 bg-white rounded-xl shadow-xl border-2 border-amber-200 py-2 w-48 z-10">
                <button onClick={() => handleShare('copy')} className="w-full px-4 py-2 text-left hover:bg-amber-50 flex items-center gap-2 text-amber-900">
                  {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}{copied ? 'Copied!' : 'Copy Link'}
                </button>
                <button onClick={() => handleShare('twitter')} className="w-full px-4 py-2 text-left hover:bg-amber-50 flex items-center gap-2 text-amber-900"><span className="text-blue-400">𝕏</span>Twitter</button>
                <button onClick={() => handleShare('facebook')} className="w-full px-4 py-2 text-left hover:bg-amber-50 flex items-center gap-2 text-amber-900"><span className="text-blue-600">f</span>Facebook</button>
              </div>
            )}
          </div>
        </div>

        {showComments && (
          <div className="pt-4 border-t-2 border-amber-100 space-y-4">
            <h4 className="font-bold text-amber-900">Comments</h4>
            {beer.comments && beer.comments.length > 0 ? (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {beer.comments.map((comment, idx) => (
                  <div key={comment.id || idx} className="bg-amber-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-amber-900 text-sm">{comment.username}</span>
                      <span className="text-xs text-amber-600">{comment.date}</span>
                    </div>
                    <p className="text-amber-800 text-sm">{comment.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-amber-600 text-sm">No comments yet. Be the first!</p>
            )}
            <form onSubmit={handleSubmitComment} className="flex gap-2">
              <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." className="flex-1 px-4 py-2 rounded-lg border-2 border-amber-300 focus:ring-2 focus:ring-amber-500 bg-amber-50 text-amber-900 text-sm" />
              <button type="submit" disabled={!newComment.trim()} className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium disabled:opacity-50 hover:shadow-lg transition-all">
                <Send size={18} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// JOURNAL VIEW
// ============================================
function JournalView({ userBeers, currentUser, onDelete }) {
  const [view, setView] = useState('grid');

  const stats = {
    totalBeers: userBeers.length,
    uniqueBreweries: [...new Set(userBeers.map(b => b.brewery))].length,
    averageRating: userBeers.length > 0 ? (userBeers.reduce((sum, b) => sum + (b.rating || 0), 0) / userBeers.length).toFixed(1) : 0,
    favoriteStyle: userBeers.length > 0 ? Object.entries(userBeers.reduce((acc, b) => ({ ...acc, [b.style]: (acc[b.style] || 0) + 1 }), {})).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A' : 'N/A'
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[{ label: 'Total Beers', value: stats.totalBeers, icon: '🍺' }, { label: 'Breweries', value: stats.uniqueBreweries, icon: '🏭' }, { label: 'Avg Rating', value: stats.averageRating, icon: '⭐' }, { label: 'Favorite', value: stats.favoriteStyle, icon: '❤️' }].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-xl border-2 border-amber-200">
            <div className="text-4xl mb-2">{stat.icon}</div>
            <p className="text-2xl font-bold text-amber-900">{stat.value}</p>
            <p className="text-sm text-amber-700 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-4 border-2 border-amber-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-amber-900" style={{ fontFamily: '"Playfair Display", serif' }}>My Beer Journal</h2>
          <div className="flex gap-2">
            <button onClick={() => setView('grid')} className={`px-4 py-2 rounded-lg font-medium transition-all ${view === 'grid' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : 'bg-amber-100 text-amber-900'}`}>Grid</button>
            <button onClick={() => setView('list')} className={`px-4 py-2 rounded-lg font-medium transition-all ${view === 'list' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : 'bg-amber-100 text-amber-900'}`}>List</button>
          </div>
        </div>
      </div>

      {userBeers.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-amber-700 font-medium">No beers in your journal yet. Add your first beer!</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userBeers.map((beer) => (
            <div key={beer.id} className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-amber-200 hover:shadow-2xl transition-all relative group">
              <button onClick={() => onDelete(beer.id)} className="absolute top-2 right-2 z-10 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" title="Delete">
                <Trash2 size={16} />
              </button>
              <div className="h-40 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center overflow-hidden">
                {beer.image ? <img src={beer.image} alt={beer.beerName} className="w-full h-full object-cover" /> : <div className="text-6xl">{beer.imageEmoji || '🍺'}</div>}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-amber-900 text-lg mb-1">{beer.beerName}</h3>
                <p className="text-sm text-amber-700 mb-2">{beer.brewery}</p>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} className={i < (beer.rating || 0) ? 'fill-amber-500 text-amber-500' : 'text-amber-300'} />)}
                </div>
                <div className="flex items-center justify-between text-xs text-amber-700">
                  <span>{beer.style}</span><span>{beer.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {userBeers.map((beer) => (
            <div key={beer.id} className="bg-white rounded-xl shadow-lg p-4 border-2 border-amber-200 flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center overflow-hidden">
                {beer.image ? <img src={beer.image} alt={beer.beerName} className="w-full h-full object-cover" /> : <div className="text-3xl">{beer.imageEmoji || '🍺'}</div>}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-amber-900">{beer.beerName}</h3>
                <p className="text-sm text-amber-700">{beer.brewery} • {beer.style}</p>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} className={i < (beer.rating || 0) ? 'fill-amber-500 text-amber-500' : 'text-amber-300'} />)}
              </div>
              <span className="text-sm text-amber-700">{beer.date}</span>
              <button onClick={() => onDelete(beer.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Delete">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// OTHER VIEWS (Simplified)
// ============================================
function DiscoverView({ beers }) {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredBeers = beers.filter(beer => beer.beerName?.toLowerCase().includes(searchQuery.toLowerCase()) || beer.brewery?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-amber-200">
        <h2 className="text-2xl font-bold text-amber-900 mb-4" style={{ fontFamily: '"Playfair Display", serif' }}>Discover New Beers</h2>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600" size={20} />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search beers, breweries..." className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-amber-300 focus:ring-2 focus:ring-amber-500 bg-amber-50 text-amber-900" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBeers.slice(0, 6).map((beer) => (
          <div key={beer.id} className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-amber-200">
            <div className="flex">
              <div className="w-32 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                <div className="text-5xl">{beer.imageEmoji || '🍺'}</div>
              </div>
              <div className="flex-1 p-4">
                <h3 className="font-bold text-amber-900 text-lg mb-1">{beer.beerName}</h3>
                <p className="text-sm text-amber-700 mb-2">{beer.brewery}</p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < (beer.rating || 0) ? 'fill-amber-500 text-amber-500' : 'text-amber-300'} />)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MapView({ beers, currentUser }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userBeers = beers.filter(b => b.userId === currentUser?.id);
  const locations = userBeers.reduce((acc, beer) => {
    if (beer.location) {
      if (!acc[beer.location]) acc[beer.location] = { location: beer.location, coords: beer.locationCoords, beers: [] };
      acc[beer.location].beers.push(beer);
    }
    return acc;
  }, {});

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current || typeof window.L === 'undefined') return;
    const map = window.L.map(mapRef.current).setView([56.9496, 24.1052], 10);
    mapInstanceRef.current = map;
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
    Object.values(locations).forEach(loc => {
      if (loc.coords) {
        const marker = window.L.marker([loc.coords.lat, loc.coords.lng]).addTo(map);
        marker.bindPopup(`<strong>${loc.location}</strong><br>${loc.beers.length} beers`);
      }
    });
    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-amber-200">
        <h2 className="text-2xl font-bold text-amber-900" style={{ fontFamily: '"Playfair Display", serif' }}><Map className="inline mr-2" size={28} />My Beer Map</h2>
      </div>
      <div ref={mapRef} className="rounded-2xl shadow-lg border-2 border-amber-300 overflow-hidden" style={{ height: '400px' }} />
      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-amber-200">
        <h3 className="text-xl font-bold text-amber-900 mb-4">Your Locations ({Object.keys(locations).length})</h3>
        {Object.values(locations).map((loc, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border-2 border-amber-200 mb-2">
            <div className="flex items-center gap-3">
              <div className="text-2xl">📍</div>
              <div><p className="font-bold text-amber-900">{loc.location}</p><p className="text-sm text-amber-600">{loc.beers.length} beers</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeaderboardView({ users, currentUser }) {
  const sortedUsers = [...users].sort((a, b) => (b.weeklyBeers || 0) - (a.weeklyBeers || 0));
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 rounded-2xl shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold" style={{ fontFamily: '"Playfair Display", serif' }}><Trophy className="inline mr-2" size={28} />Weekly Leaderboard 🏆</h2>
      </div>
      <div className="bg-white rounded-2xl shadow-lg border-2 border-amber-200 overflow-hidden">
        {sortedUsers.map((user, idx) => (
          <div key={user.id} className={`flex items-center justify-between p-4 border-b border-amber-100 ${user.id === currentUser?.id ? 'bg-amber-50' : ''}`}>
            <div className="flex items-center gap-4">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${idx < 3 ? 'bg-amber-400 text-white' : 'bg-gray-200'}`}>{idx + 1}</span>
              <div className="text-2xl">{user.avatar}</div>
              <p className="font-bold text-amber-900">{user.username} {user.id === currentUser?.id && <span className="text-xs bg-amber-200 px-2 py-1 rounded-full ml-2">You</span>}</p>
            </div>
            <p className="text-2xl font-bold text-amber-900">{user.weeklyBeers || 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsView({ userBeers }) {
  const styleBreakdown = userBeers.reduce((acc, b) => ({ ...acc, [b.style]: (acc[b.style] || 0) + 1 }), {});
  const sortedStyles = Object.entries(styleBreakdown).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const total = userBeers.length || 1;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-amber-200">
        <h2 className="text-2xl font-bold text-amber-900 mb-6" style={{ fontFamily: '"Playfair Display", serif' }}>Your Beer Analytics</h2>
        <h3 className="text-lg font-bold text-amber-900 mb-4">Favorite Styles</h3>
        {sortedStyles.length === 0 ? <p className="text-amber-600">Add beers to see stats!</p> : (
          <div className="space-y-3">
            {sortedStyles.map(([style, count]) => (
              <div key={style}>
                <div className="flex justify-between mb-1"><span className="text-amber-800">{style}</span><span className="font-bold text-amber-900">{Math.round((count / total) * 100)}%</span></div>
                <div className="h-3 bg-amber-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style={{ width: `${(count / total) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// ADD BEER MODAL
// ============================================
function AddBeerModal({ onClose, onSubmit, flavorOptions, beerStyles }) {
  const [formData, setFormData] = useState({ beerName: '', brewery: '', style: 'IPA', rating: 0, abv: '', ibu: '', price: '', location: '', locationCoords: null, flavors: [], notes: '', image: null, imageEmoji: '🍺' });
  const [hoverRating, setHoverRating] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const mockLocations = [
    { name: 'Labietis, Riga', coords: { lat: 56.9537, lng: 24.1134 } },
    { name: 'Valmiermuiža Brewery', coords: { lat: 57.5384, lng: 25.4263 } },
    { name: 'Folkklubs Ala Pagrabs, Riga', coords: { lat: 56.9489, lng: 24.1064 } },
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500000) {
        alert('Image too large! Please use an image under 500KB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setFormData({ ...formData, image: base64 });
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.rating === 0) { alert('Please add a rating'); return; }
    onSubmit({ ...formData, abv: parseFloat(formData.abv) || 0, ibu: parseInt(formData.ibu) || 0, price: parseFloat(formData.price) || 0 });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-amber-300">
        <div className="sticky top-0 bg-gradient-to-r from-amber-900 to-orange-800 text-white p-6 rounded-t-3xl z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Add New Beer</h2>
            <button onClick={onClose} className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center"><X size={24} /></button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-amber-900 font-bold mb-2">Beer Photo</label>

            {imagePreview ? (
              <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-amber-300">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button type="button" onClick={removeImage} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-32 border-2 border-dashed border-amber-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-amber-50 transition-all"
                >
                  <Camera size={32} className="text-amber-500 mb-2" />
                  <p className="text-amber-700 font-medium">Click to upload photo</p>
                  <p className="text-amber-500 text-sm">Max 500KB</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <p className="text-amber-700 text-sm text-center">Or choose an emoji:</p>
                <div className="flex justify-center gap-2">
                  {['🍺', '🍻', '🥃', '🍷'].map(emoji => (
                    <button key={emoji} type="button" onClick={() => setFormData({ ...formData, imageEmoji: emoji })} className={`text-3xl p-2 rounded-lg ${formData.imageEmoji === emoji && !formData.image ? 'bg-amber-200' : 'hover:bg-amber-100'}`}>{emoji}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-amber-900 font-bold mb-2">Beer Name *</label>
            <input type="text" required value={formData.beerName} onChange={(e) => setFormData({ ...formData, beerName: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-amber-300 bg-amber-50" placeholder="Enter beer name" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-amber-900 font-bold mb-2">Brewery *</label>
              <input type="text" required value={formData.brewery} onChange={(e) => setFormData({ ...formData, brewery: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-amber-300 bg-amber-50" placeholder="Brewery name" />
            </div>
            <div>
              <label className="block text-amber-900 font-bold mb-2">Style</label>
              <select value={formData.style} onChange={(e) => setFormData({ ...formData, style: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-amber-300 bg-amber-50">
                {beerStyles.filter(s => s !== 'all').map(style => <option key={style} value={style}>{style}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-amber-900 font-bold mb-2">Rating *</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((r) => (
                <button key={r} type="button" onMouseEnter={() => setHoverRating(r)} onMouseLeave={() => setHoverRating(0)} onClick={() => setFormData({ ...formData, rating: r })} className="transform hover:scale-125 transition-all">
                  <Star size={40} className={r <= (hoverRating || formData.rating) ? 'fill-amber-500 text-amber-500' : 'text-amber-300'} />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-amber-900 font-bold mb-2">ABV %</label><input type="number" step="0.1" value={formData.abv} onChange={(e) => setFormData({ ...formData, abv: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-amber-300 bg-amber-50" placeholder="5.0" /></div>
            <div><label className="block text-amber-900 font-bold mb-2">IBU</label><input type="number" value={formData.ibu} onChange={(e) => setFormData({ ...formData, ibu: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-amber-300 bg-amber-50" placeholder="35" /></div>
            <div><label className="block text-amber-900 font-bold mb-2">Price €</label><input type="number" step="0.1" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-amber-300 bg-amber-50" placeholder="2.50" /></div>
          </div>

          <div>
            <label className="block text-amber-900 font-bold mb-2"><MapPin className="inline mr-1" size={16} />Location</label>
            <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-amber-300 bg-amber-50" placeholder="Where did you try this beer?" />
            <div className="flex flex-wrap gap-2 mt-2">
              {mockLocations.map((loc, idx) => (
                <button key={idx} type="button" onClick={() => setFormData({ ...formData, location: loc.name, locationCoords: loc.coords })} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm hover:bg-amber-200">
                  📍 {loc.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-amber-900 font-bold mb-2">Flavors</label>
            <div className="flex flex-wrap gap-2">
              {flavorOptions.map(flavor => (
                <button key={flavor} type="button" onClick={() => setFormData(prev => ({ ...prev, flavors: prev.flavors.includes(flavor) ? prev.flavors.filter(f => f !== flavor) : [...prev.flavors, flavor] }))} className={`px-4 py-2 rounded-full font-medium transition-all ${formData.flavors.includes(flavor) ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-900'}`}>{flavor}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-amber-900 font-bold mb-2">Notes</label>
            <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows="3" className="w-full px-4 py-3 rounded-xl border-2 border-amber-300 bg-amber-50 resize-none" placeholder="Your tasting notes..." />
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all">Add Beer to Journal</button>
        </form>
      </div>
    </div>
  );
}
