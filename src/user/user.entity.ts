export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  timezone: string;
  created_at: Date;
  updated_at: Date;
}

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  timezone: string;
  created_at: Date;
  updated_at: Date;
}
