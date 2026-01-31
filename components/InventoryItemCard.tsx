
import React from 'react';
import { InventoryItem, ItemStatus } from '../types';
import { Edit2 } from 'lucide-react';

interface Props {
  item: InventoryItem;
  onEdit: (item: InventoryItem) => void;
}

const InventoryItemCard: React.FC<Props> = ({ item, onEdit }) => {
  const statusColors = {
    [ItemStatus.ACTIVE]: 'bg-green-100 text-green-700',
    [ItemStatus.SOLD]: 'bg-gray-100 text-gray-700 line-through',
    [ItemStatus.DRAFT]: 'bg-yellow-100 text-yellow-700',
  };

  const statusLabels = {
    [ItemStatus.ACTIVE]: '出品中',
    [ItemStatus.SOLD]: '売却済',
    [ItemStatus.DRAFT]: '下書き',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col sm:flex-row h-full">
      <div className="w-full sm:w-32 h-40 sm:h-auto bg-gray-200 shrink-0">
        <img 
          src={item.imageUrl || `https://picsum.photos/seed/${item.id}/200`} 
          alt={item.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <div className="flex justify-between items-start gap-2 mb-1">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${statusColors[item.status]}`}>
              {statusLabels[item.status]}
            </span>
            <span className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString()}</span>
          </div>
          <h3 className="font-bold text-gray-900 line-clamp-1 mb-1">{item.title}</h3>
          <p className="text-sm text-gray-500 line-clamp-2 mb-2">{item.description}</p>
        </div>
        
        <div className="flex justify-between items-end mt-auto">
          <div>
            <div className="text-xs text-gray-400">販売価格</div>
            <div className="text-lg font-bold text-red-600">¥{item.price.toLocaleString()}</div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => onEdit(item)}
              className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryItemCard;
