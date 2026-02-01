// ============================================
// JSONBin.io Configuration
// ============================================

const JSONBIN_CONFIG = {
  apiKey: '$2a$10$2XD1kB8GnmELCZrwbP49IOxClHe9DlIaQjirKaGRw8ZnE0xJYAc2q',
  baseUrl: 'https://api.jsonbin.io/v3/b',
  // These will be set after first initialization
  beersBinId: null,
  usersBinId: null
};

// Store bin IDs in localStorage so we don't create new bins each time
const BIN_STORAGE_KEY = 'beervault_jsonbin_ids';

const getStoredBinIds = () => {
  try {
    const stored = localStorage.getItem(BIN_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const storeBinIds = (beersBinId, usersBinId) => {
  localStorage.setItem(BIN_STORAGE_KEY, JSON.stringify({ beersBinId, usersBinId }));
};

// ============================================
// JSONBin API Helpers
// ============================================

const headers = {
  'Content-Type': 'application/json',
  'X-Master-Key': JSONBIN_CONFIG.apiKey
};

const createBin = async (data, name) => {
  const response = await fetch(JSONBIN_CONFIG.baseUrl, {
    method: 'POST',
    headers: {
      ...headers,
      'X-Bin-Name': name
    },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  return result.metadata.id;
};

const readBin = async (binId) => {
  const response = await fetch(`${JSONBIN_CONFIG.baseUrl}/${binId}/latest`, {
    method: 'GET',
    headers
  });
  const result = await response.json();
  return result.record;
};

const updateBin = async (binId, data) => {
  const response = await fetch(`${JSONBIN_CONFIG.baseUrl}/${binId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data)
  });
  return response.json();
};

// ============================================
// JSONBin Service (matches Firebase interface)
// ============================================

export const isJsonBinConfigured = () => {
  return JSONBIN_CONFIG.apiKey && JSONBIN_CONFIG.apiKey.length > 10;
};

export const initJsonBin = async (demoBeers, demoUsers) => {
  if (!isJsonBinConfigured()) return false;

  try {
    const storedIds = getStoredBinIds();

    if (storedIds && storedIds.beersBinId && storedIds.usersBinId) {
      // Use existing bins
      JSONBIN_CONFIG.beersBinId = storedIds.beersBinId;
      JSONBIN_CONFIG.usersBinId = storedIds.usersBinId;
      console.log('JSONBin: Using existing bins');
    } else {
      // Create new bins with demo data
      console.log('JSONBin: Creating new bins...');
      JSONBIN_CONFIG.beersBinId = await createBin(demoBeers, 'BeerVault-Beers');
      JSONBIN_CONFIG.usersBinId = await createBin(demoUsers, 'BeerVault-Users');
      storeBinIds(JSONBIN_CONFIG.beersBinId, JSONBIN_CONFIG.usersBinId);
      console.log('JSONBin: Bins created successfully');
    }

    return true;
  } catch (error) {
    console.error('JSONBin initialization failed:', error);
    return false;
  }
};

export const JsonBinService = {
  // Beers
  async getBeers() {
    if (!JSONBIN_CONFIG.beersBinId) return [];
    try {
      return await readBin(JSONBIN_CONFIG.beersBinId);
    } catch (error) {
      console.error('Error fetching beers:', error);
      return [];
    }
  },

  async saveBeers(beers) {
    if (!JSONBIN_CONFIG.beersBinId) return;
    try {
      await updateBin(JSONBIN_CONFIG.beersBinId, beers);
    } catch (error) {
      console.error('Error saving beers:', error);
    }
  },

  async addBeer(beer) {
    const beers = await this.getBeers();
    const updatedBeers = [beer, ...beers];
    await this.saveBeers(updatedBeers);
    return beer;
  },

  async updateBeer(beerId, data) {
    const beers = await this.getBeers();
    const updatedBeers = beers.map(b =>
      b.id === beerId ? { ...b, ...data } : b
    );
    await this.saveBeers(updatedBeers);
  },

  async deleteBeer(beerId) {
    const beers = await this.getBeers();
    const updatedBeers = beers.filter(b => b.id !== beerId);
    await this.saveBeers(updatedBeers);
  },

  // Users
  async getUsers() {
    if (!JSONBIN_CONFIG.usersBinId) return [];
    try {
      return await readBin(JSONBIN_CONFIG.usersBinId);
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  async saveUsers(users) {
    if (!JSONBIN_CONFIG.usersBinId) return;
    try {
      await updateBin(JSONBIN_CONFIG.usersBinId, users);
    } catch (error) {
      console.error('Error saving users:', error);
    }
  },

  async addUser(user) {
    const users = await this.getUsers();
    const updatedUsers = [...users, user];
    await this.saveUsers(updatedUsers);
    return user;
  },

  async updateUser(userId, data) {
    const users = await this.getUsers();
    const updatedUsers = users.map(u =>
      u.id === userId ? { ...u, ...data } : u
    );
    await this.saveUsers(updatedUsers);
  }
};
