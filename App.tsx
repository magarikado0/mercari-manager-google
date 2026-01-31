
import React, { useState, useEffect } from 'react';
import { 
  auth, 
  inventoryRef, 
  db, 
  signInWithGoogle, 
  logOut,
  onAuthStateChanged,
  onSnapshot,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc 
} from './firebase';
import { InventoryItem, ItemStatus } from './types';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import InventoryItemCard from './components/InventoryItemCard';
import ProductForm from './components/ProductForm';
import { ShoppingBag, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    // Listen for authentication state changes via our mock auth
    const unsubscribe = onAuthStateChanged(auth, (u: any) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;

    // Set up real-time listener for the mock database
    const q = query(
      inventoryRef, 
      where('userId', '==', user.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot: any) => {
      const items = snapshot.docs.map((d: any) => ({
        id: d.id,
        ...d.data()
      })) as InventoryItem[];
      setInventory(items);
    });

    return unsubscribe;
  }, [user]);

  const handleSaveProduct = async (data: Partial<InventoryItem>) => {
    if (!user) return;

    try {
      if (editingItem) {
        const itemDoc = doc(db, 'inventory', editingItem.id);
        await updateDoc(itemDoc, {
          ...data,
          updatedAt: Date.now()
        });
      } else {
        await addDoc(inventoryRef, {
          ...data,
          userId: user.uid,
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
      }
      setIsFormOpen(false);
      setEditingItem(null);
    } catch (err) {
      console.error("Failed to save product:", err);
      alert("保存に失敗しました。");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("本当に削除しますか？")) return;
    try {
      await deleteDoc(doc(db, 'inventory', id));
      setIsFormOpen(false);
      setEditingItem(null);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const openEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">読み込み中...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <div className="mb-12 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-200">
            <ShoppingBag className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MerManager</h1>
          <p className="text-gray-500 max-w-xs mx-auto">
            メルカリ出品者のための<br />スマート在庫・売上管理ツール
          </p>
        </div>
        
        <button 
          onClick={signInWithGoogle}
          className="w-full max-w-xs flex items-center justify-center gap-3 bg-white border-2 border-gray-100 py-4 px-6 rounded-2xl shadow-sm hover:bg-gray-50 hover:border-gray-200 active:scale-95 transition-all text-gray-700 font-bold mb-4"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
          Googleでログイン
        </button>
        
        <div className="mt-8 px-4 py-2 bg-amber-50 rounded-lg border border-amber-100">
          <p className="text-[11px] text-amber-700 text-center font-medium">
            デモ環境：データはブラウザに保存されます
          </p>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onLogout={logOut}
      onAddClick={() => { setEditingItem(null); setIsFormOpen(true); }}
    >
      {activeTab === 'dashboard' ? (
        <Dashboard items={inventory} />
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-gray-900">在庫一覧 ({inventory.length})</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {inventory.length > 0 ? inventory.map(item => (
              <InventoryItemCard 
                key={item.id} 
                item={item} 
                onEdit={openEdit} 
              />
            )) : (
              <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400">商品が登録されていません</p>
                <button 
                  onClick={() => setIsFormOpen(true)}
                  className="mt-4 text-red-600 font-bold hover:underline"
                >
                  最初の商品を登録する
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {isFormOpen && (
        <ProductForm 
          item={editingItem} 
          onSave={handleSaveProduct} 
          onDelete={handleDeleteProduct}
          onClose={() => setIsFormOpen(false)} 
        />
      )}
    </Layout>
  );
};

export default App;
