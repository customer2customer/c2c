export interface CustomerProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  locationNote?: string;
  points: number;
  createdById?: string;
  createdByEmail?: string;
  createdAt: Date;
  updatedAt: Date;
}
