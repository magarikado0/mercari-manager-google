
export enum ItemStatus {
  ACTIVE = 'ACTIVE',
  SOLD = 'SOLD',
  DRAFT = 'DRAFT'
}

export interface InventoryItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  price: number;
  cost: number;
  status: ItemStatus;
  category: string;
  imageUrl?: string;
  createdAt: number;
  updatedAt: number;
}

export interface UserStats {
  totalSales: number;
  totalProfit: number;
  activeListings: number;
  soldCount: number;
}

export interface ChartData {
  name: string;
  value: number;
}
