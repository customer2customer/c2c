import { Product } from '../../shared/models/product.model';
import { User } from '../../shared/models/user.model';

export const MOCK_USERS: User[] = [
  {
    id: 'seller-farmer',
    email: 'farmer@freshproduce.com',
    name: 'Fresh Produce Farm',
    userType: 'seller',
    trustScore: 4.8,
    totalOrders: 0,
    isActive: true,
    location: { address: 'Green Valley Farm', city: 'Pune' },
    sellerStats: { totalProducts: 15, totalSales: 0, averageRating: 4.8 }
  },
  {
    id: 'seller-dairy',
    email: 'dairy@delightmilk.com',
    name: 'Delight Milk Co.',
    userType: 'seller',
    trustScore: 4.9,
    totalOrders: 0,
    isActive: true,
    location: { address: 'Dairy Street 10', city: 'Bengaluru' },
    sellerStats: { totalProducts: 10, totalSales: 0, averageRating: 4.9 }
  },
  {
    id: 'buyer-sample',
    email: 'buyer@example.com',
    name: 'Sample Buyer',
    userType: 'buyer',
    trustScore: 4.5,
    totalOrders: 12,
    isActive: true,
    location: { address: 'Community Road 5', city: 'Hyderabad' }
  }
];

const vegetableNames = [
  'Heirloom Tomatoes',
  'Organic Spinach Bundle',
  'Crisp Cucumbers',
  'Farm Fresh Carrots',
  'Baby Potatoes',
  'Red Onions',
  'Green Peas',
  'Sweet Corn',
  'Broccoli Crowns',
  'Cauliflower',
  'Cherry Tomatoes',
  'Zucchini Mix',
  'Okra Pack',
  'Mixed Salad Greens',
  'Gourmet Mushrooms'
];

const dairyNames = [
  'A2 Cow Milk (1L)',
  'Fresh Paneer (200g)',
  'Greek Yogurt Cup',
  'Organic Ghee (250g)',
  'Classic Butter (500g)',
  'Curd Family Pack',
  'Flavored Lassi',
  'Cheddar Cheese Block',
  'Fresh Cream (200ml)',
  'Buttermilk Pack'
];

const sampleImages = [
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1502741509793-7b4394dc0e43?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1441123694162-e54a981ceba3?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=800&q=80'
];

const buildProduct = (
  id: string,
  productName: string,
  category: 'vegetables' | 'dairy',
  sellerId: 'seller-farmer' | 'seller-dairy',
  sellerName: string,
  sellerRating: number,
  city: string,
  index: number
): Product => {
  const marketPrice = category === 'vegetables' ? 80 + index * 2 : 120 + index * 3;
  const c2cPrice = marketPrice - 15;
  const availableDate = new Date();
  availableDate.setDate(availableDate.getDate() + (index % 5));
  const previewImages = [sampleImages[index % sampleImages.length]];

  return {
    id,
    productName,
    description: `${productName} sourced directly from the community seller with same-day freshness.`,
    category,
    sku: `${category.substring(0, 3)}-${index + 1}`,
    marketPrice,
    c2cPrice,
    priceDiscount: marketPrice - c2cPrice,
    images: previewImages,
    stock: 20 + index,
    sellerId,
    sellerName,
    sellerRating,
    reviewCount: 5 + index,
    sellerLocation: {
      address: 'Community Market',
      city
    },
    deliveryOptions: {
      courier: true,
      directVisit: index % 2 === 0
    },
    availableDates: [availableDate.toISOString()],
    upcomingScheduled: [
      {
        date: availableDate.toISOString(),
        quantity: 10 + index
      }
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

const vegetableProducts: Product[] = vegetableNames.map((name, index) =>
  buildProduct(
    `veg-${index + 1}`,
    name,
    'vegetables',
    'seller-farmer',
    'Fresh Produce Farm',
    4.8,
    'Pune',
    index
  )
);

const dairyProducts: Product[] = dairyNames.map((name, index) =>
  buildProduct(
    `dairy-${index + 1}`,
    name,
    'dairy',
    'seller-dairy',
    'Delight Milk Co.',
    4.9,
    'Bengaluru',
    index
  )
);

export const MOCK_PRODUCTS: Product[] = [...vegetableProducts, ...dairyProducts];
