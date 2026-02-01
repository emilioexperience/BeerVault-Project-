// Firebase Configuration
// Replace these values with your own Firebase project config
// Get these from: Firebase Console -> Project Settings -> Your apps -> Web app

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
let db = null;
let auth = null;

export const initFirebase = () => {
  if (typeof window.firebase !== 'undefined' && firebaseConfig.apiKey !== "YOUR_API_KEY") {
    try {
      window.firebase.initializeApp(firebaseConfig);
      db = window.firebase.firestore();
      auth = window.firebase.auth();
      console.log('Firebase initialized successfully');
      return true;
    } catch (error) {
      console.error('Firebase initialization error:', error);
      return false;
    }
  }
  return false;
};

export const getDb = () => db;
export const getAuth = () => auth;

export const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey !== "YOUR_API_KEY";
};

// Firestore helpers
export const FirestoreService = {
  // Users
  async getUsers() {
    if (!db) return null;
    const snapshot = await db.collection('users').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async addUser(user) {
    if (!db) return null;
    const docRef = await db.collection('users').add(user);
    return { id: docRef.id, ...user };
  },

  async updateUser(userId, data) {
    if (!db) return;
    await db.collection('users').doc(userId).update(data);
  },

  // Beers
  async getBeers() {
    if (!db) return null;
    const snapshot = await db.collection('beers').orderBy('date', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async addBeer(beer) {
    if (!db) return null;
    const docRef = await db.collection('beers').add({
      ...beer,
      createdAt: window.firebase.firestore.FieldValue.serverTimestamp()
    });
    return { id: docRef.id, ...beer };
  },

  async updateBeer(beerId, data) {
    if (!db) return;
    await db.collection('beers').doc(beerId).update(data);
  },

  async deleteBeer(beerId) {
    if (!db) return;
    await db.collection('beers').doc(beerId).delete();
  },

  // Real-time listeners
  onBeersChange(callback) {
    if (!db) return () => {};
    return db.collection('beers').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
      const beers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(beers);
    });
  },

  onUsersChange(callback) {
    if (!db) return () => {};
    return db.collection('users').onSnapshot(snapshot => {
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(users);
    });
  }
};
