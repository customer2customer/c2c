export type UserType = 'buyer' | 'seller' | 'both';

export interface UserLocation {
  address: string;
  city: string;
  lat?: number;
  lng?: number;
}

export interface User {
  id: string; // Firebase Auth UID
  email: string; // From Firebase Auth
  name: string; // User's full name
  phone?: string; // 10-digit phone number
  userType: UserType;
  isAdmin?: boolean;
  avatar?: string; // Profile image URL
  location?: UserLocation;
  trustScore: number; // 0-5 stars
  totalOrders: number; // Count as buyer
  authProvider?: 'password' | 'google' | 'emailLink';
  sellerStats?: {
    totalProducts: number;
    totalSales: number;
    averageRating: number;
  };
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
