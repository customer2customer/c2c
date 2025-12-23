export type ProductCategory = 'groceries' | 'vegetables' | 'clothing' | 'services' | 'dairy' | 'homemade';
export type AvailabilityStatus = 'inStock' | 'outOfStock' | 'preorder';
export type VerificationStatus = 'pending' | 'verified';

export interface Product {
  id: string; // Firestore auto-generated
  productName: string; // 3-200 chars
  description: string; // 10-5000 chars
  category: ProductCategory;
  sku: string; // Unique per seller
  marketPrice: number; // Original MRP
  c2cPrice: number; // Direct selling price
  priceDiscount: number; // Auto-calculated
  images: string[]; // Array of image URLs (1-5)
  stock: number; // Available quantity
  sellerId: string; // Reference to users/:id
  sellerName: string; // Denormalized for display
  sellerRating: number; // Current seller rating (0-5)
  reviewCount: number; // Number of reviews
  sellerContact: {
    phone: string;
    email?: string;
    whatsapp?: string;
  };
  sellerLocation: {
    address: string;
    city: string;
    lat?: number;
    lng?: number;
  };
  deliveryOptions: {
    courier: boolean;
    directVisit: boolean;
  };
  availableDates: string[]; // ISO date strings
  upcomingScheduled: Array<{
    date: string; // ISO date
    quantity: number;
  }>;
  isActive: boolean; // Soft delete flag
  availabilityStatus: AvailabilityStatus;
  isPreorderAvailable: boolean;
  videoUrl?: string;
  hoverMedia?: string;
  verificationStatus: VerificationStatus;
  createdById?: string;
  createdByEmail?: string;
  createdByName?: string;
  createdAt?: Date; // Firestore Timestamp
  updatedAt?: Date; // Firestore Timestamp
}
