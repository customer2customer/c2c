export interface CustomerProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  locationNote?: string;
  createdAt: Date;
  updatedAt: Date;
}
