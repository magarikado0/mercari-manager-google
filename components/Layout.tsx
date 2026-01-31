
import React from 'react';
import { ShoppingBag, LayoutDashboard, PlusCircle, Settings, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  onAddClick: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onLogout, onAddClick }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-red-600 p-1.5 rounded-lg">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">MerManager</h1>
        </div>
        <button 
          onClick={onLogout}
          className="p-2 text-gray-500 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom z-50">
        <div className="max-w-2xl mx-auto flex justify-around items-center h-16">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-red-600' : 'text-gray-500'}`}
          >
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-[10px] font-medium">ダッシュボード</span>
          </button>
          
          <button 
            onClick={onAddClick}
            className="flex flex-col items-center -mt-8 bg-red-600 text-white p-4 rounded-full shadow-lg active:scale-95 transition-transform"
          >
            <PlusCircle className="w-7 h-7" />
          </button>

          <button 
            onClick={() => setActiveTab('inventory')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'inventory' ? 'text-red-600' : 'text-gray-500'}`}
          >
            <ShoppingBag className="w-6 h-6" />
            <span className="text-[10px] font-medium">在庫一覧</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
