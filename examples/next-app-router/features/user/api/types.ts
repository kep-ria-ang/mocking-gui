export interface User {
  id: string;
  name: string;
  role: 'Admin' | 'User' | 'Guest';
  features: string[];
}

export interface ApiError {
  error: string;
  status: number;
}
