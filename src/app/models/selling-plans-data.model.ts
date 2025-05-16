export interface SellingPlanData {
  id?: string;
  user_id: string;
  title: string;
  description: string;
  target_amount: number;
  target_date: string;
  status?: string;
  created_at?: string;
}