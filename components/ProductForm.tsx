
import React, { useState, useEffect } from 'react';
import { InventoryItem, ItemStatus } from '../types';
import { X, Camera, Sparkles, Loader2, Save, Trash2 } from 'lucide-react';
import { optimizeListing } from '../services/geminiService';

interface Props {
  item?: InventoryItem | null;
  onSave: (data: Partial<InventoryItem>) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

const ProductForm: React.FC<Props> = ({ item, onSave, onDelete, onClose }) => {
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    title: '',
    description: '',
    price: 0,
    cost: 0,
    status: ItemStatus.ACTIVE,
    category: 'ファッション',
    imageUrl: '',
  });

  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData(item);
    }
  }, [item]);

  const handleOptimize = async () => {
    if (!formData.title || !formData.description) return;
    setIsOptimizing(true);
    try {
      const result = await optimizeListing(
        formData.title || '',
        formData.description || '',
        formData.category || ''
      );
      setFormData(prev => ({
        ...prev,
        title: result.title,
        description: result.description,
        price: result.suggestedPrice
      }));
    } catch (error) {
      console.error('Optimization failed:', error);
      alert('AI最適化に失敗しました。時間をおいて再度お試しください。');
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-gray-900">{item ? '商品編集' : '新規出品登録'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[80vh]">
          <div className="space-y-6">
            <div className="flex justify-center">
              <button className="w-32 h-32 bg-gray-100 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-red-400 hover:bg-red-50 transition-colors group">
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <>
                    <Camera className="w-8 h-8 text-gray-400 group-hover:text-red-500 mb-2" />
                    <span className="text-[10px] text-gray-500">写真を追加</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                  タイトル
                </label>
                <input 
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="例：【美品】NIKE スニーカー 27cm"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    説明文
                  </label>
                  <button 
                    onClick={handleOptimize}
                    disabled={isOptimizing || !formData.title || !formData.description}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-full hover:bg-red-100 disabled:opacity-50 transition-all"
                  >
                    {isOptimizing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    AI最適化
                  </button>
                </div>
                <textarea 
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="商品の状態、サイズ、使用感など..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    カテゴリー
                  </label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                  >
                    <option>ファッション</option>
                    <option>家電・スマホ・カメラ</option>
                    <option>おもちゃ・ホビー</option>
                    <option>コスメ・香水・美容</option>
                    <option>インテリア・住まい</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    ステータス
                  </label>
                  <select 
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as ItemStatus})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                  >
                    <option value={ItemStatus.ACTIVE}>出品中</option>
                    <option value={ItemStatus.SOLD}>売却済</option>
                    <option value={ItemStatus.DRAFT}>下書き</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    販売価格 (¥)
                  </label>
                  <input 
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    仕入れ値/原価 (¥)
                  </label>
                  <input 
                    type="number"
                    value={formData.cost}
                    onChange={e => setFormData({...formData, cost: Number(e.target.value)})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 flex gap-3">
          {item && onDelete && (
            <button 
              onClick={() => onDelete(item.id)}
              className="px-6 py-4 bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          <button 
            onClick={() => onSave(formData)}
            className="flex-1 bg-red-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-red-200 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            保存する
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
