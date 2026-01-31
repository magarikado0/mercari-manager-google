
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { UserStats, InventoryItem, ItemStatus } from '../types';
import { TrendingUp, Package, DollarSign, PieChart } from 'lucide-react';

interface Props {
  items: InventoryItem[];
}

const Dashboard: React.FC<Props> = ({ items }) => {
  const stats: UserStats = {
    totalSales: items.filter(i => i.status === ItemStatus.SOLD).reduce((acc, curr) => acc + curr.price, 0),
    totalProfit: items.filter(i => i.status === ItemStatus.SOLD).reduce((acc, curr) => acc + (curr.price - curr.cost), 0),
    activeListings: items.filter(i => i.status === ItemStatus.ACTIVE).length,
    soldCount: items.filter(i => i.status === ItemStatus.SOLD).length,
  };

  const chartData = [
    { name: '出品中', value: stats.activeListings, color: '#3b82f6' },
    { name: '売却済', value: stats.soldCount, color: '#10b981' },
    { name: '下書き', value: items.filter(i => i.status === ItemStatus.DRAFT).length, color: '#f59e0b' },
  ];

  const recentSales = items
    .filter(i => i.status === ItemStatus.SOLD)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs font-medium">総売上</span>
          </div>
          <div className="text-xl font-bold text-gray-900">¥{stats.totalSales.toLocaleString()}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-green-600 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-medium">総利益</span>
          </div>
          <div className="text-xl font-bold text-green-600">¥{stats.totalProfit.toLocaleString()}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Package className="w-4 h-4" />
            <span className="text-xs font-medium">出品中</span>
          </div>
          <div className="text-xl font-bold text-blue-600">{stats.activeListings}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-purple-600 mb-1">
            <PieChart className="w-4 h-4" />
            <span className="text-xs font-medium">成約数</span>
          </div>
          <div className="text-xl font-bold text-purple-600">{stats.soldCount}</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-sm font-bold text-gray-900 mb-4">在庫状況</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} dy={10} />
              <YAxis hide />
              <Tooltip 
                cursor={{fill: '#f9fafb'}} 
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-sm font-bold text-gray-900">最近の取引</h2>
          <button className="text-xs text-red-600 font-medium">すべて見る</button>
        </div>
        <div className="divide-y divide-gray-50">
          {recentSales.length > 0 ? recentSales.map(item => (
            <div key={item.id} className="p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gray-100 shrink-0 overflow-hidden">
                <img src={item.imageUrl || `https://picsum.photos/seed/${item.id}/100`} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{item.title}</p>
                <p className="text-xs text-gray-500">{new Date(item.updatedAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">¥{item.price.toLocaleString()}</p>
                <p className="text-[10px] text-green-600">利益 ¥{(item.price - item.cost).toLocaleString()}</p>
              </div>
            </div>
          )) : (
            <div className="p-8 text-center text-gray-400 text-sm">取引データがありません</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
