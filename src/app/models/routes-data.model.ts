export interface Waypoint {
  latitude: number;
  longitude: number;
  name: string;
  address: string;
}

export interface RouteData {
  id?: string;
  name: string;
  description: string;
  zone: string;
  due_to: string;
  user_id: string;
  waypoints: Waypoint[];
  created_at?: string;
}