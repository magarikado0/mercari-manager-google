
// Mock Firebase Implementation for Demo/Preview environment
// This provides a compatible interface to the Firebase SDK but persists data in LocalStorage.

import { InventoryItem } from './types';

// Simple Event Emitter for Firestore-like reactivity
const storeEvents = new EventTarget();
const NOTIFY_KEY = 'mermanager_db_update';

const notify = () => {
  storeEvents.dispatchEvent(new Event('change'));
  localStorage.setItem(NOTIFY_KEY, Date.now().toString());
};

window.addEventListener('storage', (e) => {
  if (e.key === NOTIFY_KEY) {
    storeEvents.dispatchEvent(new Event('change'));
  }
});

// Auth Mock
class MockAuth {
  currentUser: any = null;
  private authListeners: ((user: any) => void)[] = [];

  constructor() {
    const saved = localStorage.getItem('mermanager_user');
    if (saved) {
      this.currentUser = JSON.parse(saved);
    }
  }

  onAuthStateChanged(callback: (user: any) => void) {
    this.authListeners.push(callback);
    // Initial trigger
    setTimeout(() => callback(this.currentUser), 50);
    return () => {
      this.authListeners = this.authListeners.filter(l => l !== callback);
    };
  }

  async signInWithPopup() {
    const user = {
      uid: 'demo-user-123',
      displayName: 'デモ ユーザー',
      email: 'demo@example.com',
      photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mer'
    };
    this.currentUser = user;
    localStorage.setItem('mermanager_user', JSON.stringify(user));
    this.authListeners.forEach(l => l(user));
    return { user };
  }

  async signOut() {
    this.currentUser = null;
    localStorage.removeItem('mermanager_user');
    this.authListeners.forEach(l => l(null));
  }
}

// Instantiate mocks
export const auth = new MockAuth();
export const db = {}; // Placeholder object to match SDK usage
export const googleProvider = {};

// Functional Exports matching Firebase SDK v9+ signatures
export const onAuthStateChanged = (authObj: any, cb: any) => authObj.onAuthStateChanged(cb);
export const signInWithGoogle = () => auth.signInWithPopup();
export const logOut = () => auth.signOut();

export const inventoryRef = { type: 'collection', path: 'inventory' };

export const collection = (_db: any, path: string) => ({ type: 'collection', path });
export const doc = (_db: any, path: string, id: string) => ({ type: 'doc', path, id });

export const where = (field: string, op: string, value: any) => ({ type: 'where', field, op, value });
export const orderBy = (field: string, direction: string = 'asc') => ({ type: 'orderBy', field, direction });

export const query = (ref: any, ...constraints: any[]) => ({ ref, constraints });

export const onSnapshot = (q: any, callback: (snapshot: any) => void) => {
  const handler = () => {
    let items: InventoryItem[] = JSON.parse(localStorage.getItem('mermanager_items') || '[]');
    
    // Apply basic constraints
    q.constraints.forEach((c: any) => {
      if (c.type === 'where' && c.field === 'userId' && c.op === '==') {
        items = items.filter(i => i.userId === c.value);
      }
    });

    // Apply basic ordering
    const order = q.constraints.find((c: any) => c.type === 'orderBy');
    if (order) {
      items.sort((a: any, b: any) => {
        const valA = a[order.field];
        const valB = b[order.field];
        return order.direction === 'desc' ? valB - valA : valA - valB;
      });
    }

    callback({
      docs: items.map(item => ({
        id: item.id,
        data: () => item
      }))
    });
  };

  storeEvents.addEventListener('change', handler);
  handler(); // Initial load
  return () => storeEvents.removeEventListener('change', handler);
};

export const addDoc = async (ref: any, data: any) => {
  const items = JSON.parse(localStorage.getItem('mermanager_items') || '[]');
  const newItem = { ...data, id: Math.random().toString(36).substring(2, 11) };
  items.push(newItem);
  localStorage.setItem('mermanager_items', JSON.stringify(items));
  notify();
  return { id: newItem.id };
};

export const updateDoc = async (docRef: any, data: any) => {
  let items: InventoryItem[] = JSON.parse(localStorage.getItem('mermanager_items') || '[]');
  items = items.map(item => item.id === docRef.id ? { ...item, ...data } : item);
  localStorage.setItem('mermanager_items', JSON.stringify(items));
  notify();
};

export const deleteDoc = async (docRef: any) => {
  let items: InventoryItem[] = JSON.parse(localStorage.getItem('mermanager_items') || '[]');
  items = items.filter(item => item.id !== docRef.id);
  localStorage.setItem('mermanager_items', JSON.stringify(items));
  notify();
};
