export interface WarehouseStockItemData {
  warehouse_stock_item_id?: string;
  warehouse_id: string;
  item_id: string;
  bar_code?: string;
  identification_code?: string;
  width: number;
  height: number;
  depth: number;
  weight: number;
  hallway: string;
  shelf: string;
  sold?: boolean;
  status?: string;
  created_at?: string;
}