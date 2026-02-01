import React, { useState, useEffect } from 'react';
import { Camera, Star, MapPin, DollarSign, TrendingUp, Users, Search, Filter, Heart, MessageCircle, Share2, Award, BarChart3, Map, Plus, X, ChevronDown, Menu, Home, Book, Globe, User, Settings, Upload, Check } from 'lucide-react';

// Main App Component
export default function BeerTrackerApp() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('feed');
  const [beers, setBeers] = useState([]);
  const [userBeers, setUserBeers] = useState([]);
  const [showAddBeer, setShowAddBeer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStyle, setFilterStyle] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  // Initialize with demo data
  useEffect(() => {
    const demoUser = {
      id: 1,
      username: 'emil_beer_explorer',
      email: 'emils.sarmulis@mintos.com',
      avatar: '🍺',
      joinDate: '2024-01-15',
      stats: {
        totalBeers: 47,
        uniqueBreweries: 23,
        favoriteStyle: 'IPA',
        averageRating: 4.2
      }
    };
    setCurrentUser(demoUser);

    // Demo beers for feed
    const demoBeers = [
      {
        id: 1,
        userId: 1,
        username: 'emil_beer_explorer',
        beerName: 'Valmiermuižas Tumšais',
        brewery: 'Valmiermuiža',
        style: 'Dark Lager',
        rating: 4.5,
        abv: 5.8,
        ibu: 28,
        price: 2.50,
        location: 'Valmiera, Latvia',
        flavors: ['malty', 'caramel', 'smooth'],
        notes: 'Rich caramel notes with a smooth finish. Perfect for autumn evenings.',
        image: '🍺',
        date: '2024-11-28',
        likes: 12,
        comments: 3,
        isLiked: false
      },
      {
        id: 2,
        userId: 2,
        username: 'beer_enthusiast_lv',
        beerName: 'Užavas Pale Ale',
        brewery: 'Užavas Alus',
        style: 'Pale Ale',
        rating: 4.0,
        abv: 5.2,
        ibu: 35,
        price: 2.80,
        location: 'Riga, Latvia',
        flavors: ['hoppy', 'citrus', 'refreshing'],
        notes: 'Great hoppy character with citrus notes. Very refreshing!',
        image: '🍻',
        date: '2024-11-27',
        likes: 8,
        comments: 2,
        isLiked: true
      }
    ];
    setBeers(demoBeers);
    setUserBeers([demoBeers[0]]);
  }, []);

  const beerStyles = [
    'all', 'IPA', 'Pale Ale', 'Lager', 'Dark Lager', 'Stout', 'Porter', 
    'Wheat Beer', 'Sour', 'Belgian', 'Pilsner', 'Amber'
  ];

  const flavorOptions = [
    'hoppy', 'malty', 'bitter', 'sweet', 'citrus', 'fruity', 
    'caramel', 'chocolate', 'coffee', 'smooth', 'crisp', 'refreshing'
  ];

  if (!currentUser) {
    return <LoginScreen onLogin={setCurrentUser} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-amber-900 via-orange-800 to-amber-900 text-white shadow-xl border-b-4 border-amber-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🍺</div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: '"Playfair Display", serif' }}>
                  BeerVault
                </h1>
                <p className="text-xs text-amber-200">Track. Share. Discover.</p>
              </div>
            </div>
            
            <nav className="hidden md:flex gap-6">
              {['feed', 'journal', 'discover', 'analytics'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-white text-amber-900 shadow-lg transform scale-105'
                      : 'text-amber-100 hover:bg-amber-800 hover:text-white'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddBeer(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Add Beer</span>
              </button>
              
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-2xl shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300">
                {currentUser.avatar}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'feed' && <FeedView beers={beers} setBeers={setBeers} currentUser={currentUser} />}
        {activeTab === 'journal' && <JournalView userBeers={userBeers} currentUser={currentUser} />}
        {activeTab === 'discover' && <DiscoverView beers={beers} />}
        {activeTab === 'analytics' && <AnalyticsView userBeers={userBeers} currentUser={currentUser} />}
      </main>

      {/* Add Beer Modal */}
      {showAddBeer && (
        <AddBeerModal
          onClose={() => setShowAddBeer(false)}
          onSubmit={(newBeer) => {
            const beer = {
              ...newBeer,
              id: beers.length + 1,
              userId: currentUser.id,
              username: currentUser.username,
              date: new Date().toISOString().split('T')[0],
              likes: 0,
              comments: 0,
              isLiked: false
            };
            setBeers([beer, ...beers]);
            setUserBeers([beer, ...userBeers]);
            setShowAddBeer(false);
          }}
          flavorOptions={flavorOptions}
          beerStyles={beerStyles}
        />
      )}

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-amber-900 via-orange-800 to-amber-900 border-t-4 border-amber-700 shadow-2xl">
        <div className="flex justify-around py-3">
          {[
            { id: 'feed', icon: Home },
            { id: 'journal', icon: Book },
            { id: 'discover', icon: Globe },
            { id: 'analytics', icon: BarChart3 }
          ].map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`p-3 rounded-xl transition-all duration-300 ${
                activeTab === id
                  ? 'bg-white text-amber-900 shadow-lg transform scale-110'
                  : 'text-amber-200 hover:text-white'
              }`}
            >
              <Icon size={24} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Feed View Component
function FeedView({ beers, setBeers, currentUser }) {
  const [sortBy, setSortBy] = useState('recent');

  const handleLike = (beerId) => {
    setBeers(beers.map(beer => 
      beer.id === beerId 
        ? { ...beer, isLiked: !beer.isLiked, likes: beer.isLiked ? beer.likes - 1 : beer.likes + 1 }
        : beer
    ));
  };

  const sortedBeers = [...beers].sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'popular') return b.likes - a.likes;
    return 0;
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Sort Controls */}
      <div className="bg-white rounded-2xl shadow-lg p-4 border-2 border-amber-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-amber-900" style={{ fontFamily: '"Playfair Display", serif' }}>
            Community Feed
          </h2>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg border-2 border-amber-300 bg-amber-50 text-amber-900 font-medium focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300"
          >
            <option value="recent">Most Recent</option>
            <option value="rating">Highest Rated</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      {/* Beer Cards */}
      {sortedBeers.map((beer) => (
        <BeerCard key={beer.id} beer={beer} onLike={handleLike} currentUser={currentUser} />
      ))}
    </div>
  );
}

// Beer Card Component
function BeerCard({ beer, onLike, currentUser }) {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-amber-200 hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-[1.02]">
      {/* User Header */}
      <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b-2 border-amber-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-xl shadow-md">
              🍺
            </div>
            <div>
              <p className="font-bold text-amber-900">{beer.username}</p>
              <p className="text-xs text-amber-700">{beer.date}</p>
            </div>
          </div>
          <MapPin size={16} className="text-amber-600" />
        </div>
      </div>

      {/* Beer Image/Icon */}
      <div className="relative h-64 bg-gradient-to-br from-amber-100 via-yellow-100 to-orange-100 flex items-center justify-center">
        <div className="text-9xl transform hover:scale-110 transition-transform duration-500">
          {beer.image}
        </div>
        <div className="absolute top-3 right-3 bg-gradient-to-br from-amber-900 to-orange-900 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
          {beer.style}
        </div>
      </div>

      {/* Beer Info */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-2xl font-bold text-amber-900 mb-1" style={{ fontFamily: '"Playfair Display", serif' }}>
            {beer.beerName}
          </h3>
          <p className="text-amber-700 font-medium">{beer.brewery}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={24}
              className={`${
                i < Math.floor(beer.rating)
                  ? 'fill-amber-500 text-amber-500'
                  : i < beer.rating
                  ? 'fill-amber-300 text-amber-300'
                  : 'text-amber-300'
              } transition-all duration-300`}
            />
          ))}
          <span className="text-lg font-bold text-amber-900 ml-2">{beer.rating.toFixed(1)}</span>
        </div>

        {/* Details */}
        <div className="grid grid-cols-3 gap-3 py-3 border-y-2 border-amber-100">
          <div className="text-center">
            <p className="text-xs text-amber-600 font-medium">ABV</p>
            <p className="text-lg font-bold text-amber-900">{beer.abv}%</p>
          </div>
          <div className="text-center border-x-2 border-amber-100">
            <p className="text-xs text-amber-600 font-medium">IBU</p>
            <p className="text-lg font-bold text-amber-900">{beer.ibu}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-amber-600 font-medium">Price</p>
            <p className="text-lg font-bold text-amber-900">€{beer.price}</p>
          </div>
        </div>

        {/* Flavors */}
        <div className="flex flex-wrap gap-2">
          {beer.flavors.map((flavor, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full text-sm font-medium border-2 border-amber-200 shadow-sm"
            >
              {flavor}
            </span>
          ))}
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-amber-700">
          <MapPin size={16} />
          <span className="text-sm font-medium">{beer.location}</span>
        </div>

        {/* Notes */}
        <p className="text-amber-800 leading-relaxed">{beer.notes}</p>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t-2 border-amber-100">
          <button
            onClick={() => onLike(beer.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
              beer.isLiked
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
            }`}
          >
            <Heart size={20} className={beer.isLiked ? 'fill-current' : ''} />
            <span>{beer.likes}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-100 text-amber-900 font-medium hover:bg-amber-200 transition-all duration-300 transform hover:scale-105"
          >
            <MessageCircle size={20} />
            <span>{beer.comments}</span>
          </button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-100 text-amber-900 font-medium hover:bg-amber-200 transition-all duration-300 transform hover:scale-105">
            <Share2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Journal View Component
function JournalView({ userBeers, currentUser }) {
  const [view, setView] = useState('grid');
  const [filter, setFilter] = useState('all');

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Beers', value: currentUser.stats.totalBeers, icon: '🍺', color: 'amber' },
          { label: 'Breweries', value: currentUser.stats.uniqueBreweries, icon: '🏭', color: 'orange' },
          { label: 'Avg Rating', value: currentUser.stats.averageRating, icon: '⭐', color: 'yellow' },
          { label: 'Favorite', value: currentUser.stats.favoriteStyle, icon: '❤️', color: 'red' }
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-2xl p-6 shadow-xl border-2 border-${stat.color}-200 hover:shadow-2xl transition-all duration-500 transform hover:scale-105`}
          >
            <div className="text-4xl mb-2">{stat.icon}</div>
            <p className="text-2xl font-bold text-amber-900">{stat.value}</p>
            <p className="text-sm text-amber-700 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* View Controls */}
      <div className="bg-white rounded-2xl shadow-lg p-4 border-2 border-amber-200">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-xl font-bold text-amber-900" style={{ fontFamily: '"Playfair Display", serif' }}>
            My Beer Journal
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setView('grid')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                view === 'grid'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                view === 'list'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Beers Display */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userBeers.map((beer) => (
            <div
              key={beer.id}
              className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-amber-200 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer"
            >
              <div className="h-40 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                <div className="text-6xl">{beer.image}</div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-amber-900 text-lg mb-1">{beer.beerName}</h3>
                <p className="text-sm text-amber-700 mb-2">{beer.brewery}</p>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < beer.rating ? 'fill-amber-500 text-amber-500' : 'text-amber-300'}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-amber-700">
                  <span>{beer.style}</span>
                  <span>{beer.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {userBeers.map((beer) => (
            <div
              key={beer.id}
              className="bg-white rounded-xl shadow-lg p-4 border-2 border-amber-200 hover:shadow-xl transition-all duration-300 flex items-center gap-4"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center text-3xl">
                {beer.image}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-amber-900">{beer.beerName}</h3>
                <p className="text-sm text-amber-700">{beer.brewery} • {beer.style}</p>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < beer.rating ? 'fill-amber-500 text-amber-500' : 'text-amber-300'}
                  />
                ))}
              </div>
              <span className="text-sm text-amber-700">{beer.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Discover View Component
function DiscoverView({ beers }) {
  const [activeCategory, setActiveCategory] = useState('trending');

  const categories = ['trending', 'new', 'local', 'top-rated'];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-amber-200">
        <h2 className="text-2xl font-bold text-amber-900 mb-4" style={{ fontFamily: '"Playfair Display", serif' }}>
          Discover New Beers
        </h2>
        
        {/* Category Tabs */}
        <div className="flex gap-3 flex-wrap mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
              }`}
            >
              {cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600" size={20} />
          <input
            type="text"
            placeholder="Search beers, breweries, styles..."
            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 text-amber-900 placeholder-amber-400 font-medium transition-all duration-300"
          />
        </div>
      </div>

      {/* Beer Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {beers.slice(0, 4).map((beer) => (
          <div
            key={beer.id}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-amber-200 hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
          >
            <div className="flex">
              <div className="w-32 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                <div className="text-5xl">{beer.image}</div>
              </div>
              <div className="flex-1 p-4">
                <h3 className="font-bold text-amber-900 text-lg mb-1">{beer.beerName}</h3>
                <p className="text-sm text-amber-700 mb-2">{beer.brewery}</p>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < beer.rating ? 'fill-amber-500 text-amber-500' : 'text-amber-300'}
                    />
                  ))}
                  <span className="text-sm font-bold text-amber-900 ml-1">{beer.rating}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {beer.flavors.slice(0, 2).map((flavor, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium"
                    >
                      {flavor}
                    </span>
                  ))}
                </div>
                <button className="w-full mt-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  Add to Want List
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Analytics View Component
function AnalyticsView({ userBeers, currentUser }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-amber-200">
        <h2 className="text-2xl font-bold text-amber-900 mb-6" style={{ fontFamily: '"Playfair Display", serif' }}>
          Your Beer Analytics
        </h2>

        {/* Style Breakdown */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-amber-900 mb-4">Favorite Styles</h3>
          <div className="space-y-3">
            {['IPA', 'Dark Lager', 'Pale Ale', 'Stout'].map((style, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <span className="text-amber-800 font-medium">{style}</span>
                  <span className="text-amber-900 font-bold">{[35, 25, 20, 15][idx]}%</span>
                </div>
                <div className="h-3 bg-amber-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-1000"
                    style={{ width: `${[35, 25, 20, 15][idx]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flavor Profile */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-amber-900 mb-4">Your Flavor Profile</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {['hoppy', 'malty', 'citrus', 'smooth', 'bitter', 'sweet'].map((flavor, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="text-2xl mb-2">
                  {['🌿', '🌾', '🍊', '💫', '🍃', '🍯'][idx]}
                </div>
                <p className="font-bold text-amber-900">{flavor}</p>
                <p className="text-sm text-amber-700">{[32, 28, 24, 20, 18, 15][idx]}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h3 className="text-lg font-bold text-amber-900 mb-4">Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Beer Explorer', desc: 'Tried 50+ beers', icon: '🗺️', unlocked: false },
              { title: 'IPA Enthusiast', desc: 'Rated 20 IPAs', icon: '🌿', unlocked: true },
              { title: 'Local Hero', desc: 'Visited 10 breweries', icon: '🏅', unlocked: true },
              { title: 'Taste Master', desc: 'Perfect 5.0 ratings', icon: '⭐', unlocked: false }
            ].map((achievement, idx) => (
              <div
                key={idx}
                className={`rounded-xl p-4 border-2 flex items-center gap-4 transition-all duration-300 ${
                  achievement.unlocked
                    ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300 shadow-lg'
                    : 'bg-gray-50 border-gray-300 opacity-60'
                }`}
              >
                <div className={`text-4xl ${achievement.unlocked ? 'transform scale-110' : 'grayscale'}`}>
                  {achievement.icon}
                </div>
                <div>
                  <h4 className={`font-bold ${achievement.unlocked ? 'text-amber-900' : 'text-gray-600'}`}>
                    {achievement.title}
                  </h4>
                  <p className={`text-sm ${achievement.unlocked ? 'text-amber-700' : 'text-gray-500'}`}>
                    {achievement.desc}
                  </p>
                </div>
                {achievement.unlocked && (
                  <Check className="ml-auto text-green-600" size={24} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Add Beer Modal Component
function AddBeerModal({ onClose, onSubmit, flavorOptions, beerStyles }) {
  const [formData, setFormData] = useState({
    beerName: '',
    brewery: '',
    style: 'IPA',
    rating: 0,
    abv: '',
    ibu: '',
    price: '',
    location: '',
    flavors: [],
    notes: '',
    image: '🍺'
  });

  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const toggleFlavor = (flavor) => {
    setFormData(prev => ({
      ...prev,
      flavors: prev.flavors.includes(flavor)
        ? prev.flavors.filter(f => f !== flavor)
        : [...prev.flavors, flavor]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-amber-300">
        <div className="sticky top-0 bg-gradient-to-r from-amber-900 via-orange-800 to-amber-900 text-white p-6 rounded-t-3xl border-b-4 border-amber-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold" style={{ fontFamily: '"Playfair Display", serif' }}>
              Add New Beer
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-300"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Beer Name */}
          <div>
            <label className="block text-amber-900 font-bold mb-2">Beer Name *</label>
            <input
              type="text"
              required
              value={formData.beerName}
              onChange={(e) => setFormData({ ...formData, beerName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 text-amber-900 font-medium transition-all duration-300"
              placeholder="Enter beer name"
            />
          </div>

          {/* Brewery & Style */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-amber-900 font-bold mb-2">Brewery *</label>
              <input
                type="text"
                required
                value={formData.brewery}
                onChange={(e) => setFormData({ ...formData, brewery: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 text-amber-900 font-medium transition-all duration-300"
                placeholder="Brewery name"
              />
            </div>
            <div>
              <label className="block text-amber-900 font-bold mb-2">Style *</label>
              <select
                value={formData.style}
                onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 text-amber-900 font-medium transition-all duration-300"
              >
                {beerStyles.filter(s => s !== 'all').map((style) => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-amber-900 font-bold mb-2">Rating *</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onMouseEnter={() => setHoverRating(rating)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setFormData({ ...formData, rating })}
                  className="transform hover:scale-125 transition-all duration-300"
                >
                  <Star
                    size={40}
                    className={`${
                      rating <= (hoverRating || formData.rating)
                        ? 'fill-amber-500 text-amber-500'
                        : 'text-amber-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ABV, IBU, Price */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-amber-900 font-bold mb-2">ABV %</label>
              <input
                type="number"
                step="0.1"
                value={formData.abv}
                onChange={(e) => setFormData({ ...formData, abv: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 text-amber-900 font-medium transition-all duration-300"
                placeholder="5.0"
              />
            </div>
            <div>
              <label className="block text-amber-900 font-bold mb-2">IBU</label>
              <input
                type="number"
                value={formData.ibu}
                onChange={(e) => setFormData({ ...formData, ibu: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 text-amber-900 font-medium transition-all duration-300"
                placeholder="35"
              />
            </div>
            <div>
              <label className="block text-amber-900 font-bold mb-2">Price €</label>
              <input
                type="number"
                step="0.1"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 text-amber-900 font-medium transition-all duration-300"
                placeholder="2.50"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-amber-900 font-bold mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 text-amber-900 font-medium transition-all duration-300"
              placeholder="Riga, Latvia"
            />
          </div>

          {/* Flavors */}
          <div>
            <label className="block text-amber-900 font-bold mb-2">Flavors</label>
            <div className="flex flex-wrap gap-2">
              {flavorOptions.map((flavor) => (
                <button
                  key={flavor}
                  type="button"
                  onClick={() => toggleFlavor(flavor)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                    formData.flavors.includes(flavor)
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                      : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                  }`}
                >
                  {flavor}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-amber-900 font-bold mb-2">Tasting Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="4"
              className="w-full px-4 py-3 rounded-xl border-2 border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 text-amber-900 font-medium transition-all duration-300 resize-none"
              placeholder="Share your thoughts about this beer..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Add Beer to Journal
          </button>
        </form>
      </div>
    </div>
  );
}

// Login Screen (Placeholder)
function LoginScreen({ onLogin }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border-4 border-amber-300">
        <div className="text-center mb-8">
          <div className="text-7xl mb-4">🍺</div>
          <h1 className="text-4xl font-bold text-amber-900 mb-2" style={{ fontFamily: '"Playfair Display", serif' }}>
            BeerVault
          </h1>
          <p className="text-amber-700">Track. Share. Discover Great Beers.</p>
        </div>
        <button
          onClick={() => onLogin({ id: 1, username: 'demo_user' })}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          Demo Login
        </button>
      </div>
    </div>
  );
}