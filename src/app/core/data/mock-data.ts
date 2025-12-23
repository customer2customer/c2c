import { Product, ProductCategory } from '../../shared/models/product.model';
import { User } from '../../shared/models/user.model';
import { CustomerProfile } from '../../shared/models/customer.model';

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
    id: 'seller-grocer',
    email: 'grocer@communitymart.com',
    name: 'Community Mart',
    userType: 'seller',
    trustScore: 4.7,
    totalOrders: 0,
    isActive: true,
    location: { address: 'Neighborhood Plaza', city: 'Hyderabad' },
    sellerStats: { totalProducts: 18, totalSales: 0, averageRating: 4.7 }
  },
  {
    id: 'seller-clothing',
    email: 'threads@localwear.com',
    name: 'Local Wear Co.',
    userType: 'seller',
    trustScore: 4.6,
    totalOrders: 0,
    isActive: true,
    location: { address: 'Craft Street 2', city: 'Delhi' },
    sellerStats: { totalProducts: 12, totalSales: 0, averageRating: 4.6 }
  },
  {
    id: 'seller-services',
    email: 'services@homehelpers.com',
    name: 'Home Helpers',
    userType: 'seller',
    trustScore: 4.5,
    totalOrders: 0,
    isActive: true,
    location: { address: 'Service Lane 4', city: 'Mumbai' },
    sellerStats: { totalProducts: 8, totalSales: 0, averageRating: 4.5 }
  },
  {
    id: 'seller-homemade',
    email: 'maker@craftkitchen.com',
    name: 'Craft Kitchen',
    userType: 'seller',
    trustScore: 4.9,
    totalOrders: 0,
    isActive: true,
    location: { address: 'Makers Colony', city: 'Chennai' },
    sellerStats: { totalProducts: 14, totalSales: 0, averageRating: 4.9 }
  },
  {
    id: 'customer-c2c1',
    email: 'c2c1@gmail.com',
    name: 'C2C One',
    userType: 'buyer',
    trustScore: 4.2,
    totalOrders: 6,
    isActive: true,
    location: { address: 'Sunrise Residency', city: 'Hyderabad' }
  },
  {
    id: 'customer-c2c2',
    email: 'c2c2@gmail.com',
    name: 'C2C Two',
    userType: 'buyer',
    trustScore: 4.1,
    totalOrders: 4,
    isActive: true,
    location: { address: 'Park View Lane', city: 'Bengaluru' }
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

const sampleImages = [
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1502741509793-7b4394dc0e43?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1441123694162-e54a981ceba3?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80'
];

const hoverAnimations = [
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdGgxYmJ2YW1kc3Z3d2NqdDQxeWl0aGU3dHVveDFjZ2IycXlxcmRpZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/mCRJDo24UvJMA/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGE2dnZ1Y3JhaGllbWt2eWh0b3IxMGx4YWQybXl2b3duMWN2MWNoZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/26gsbAdAcD6RdZE0c/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXkzZ2pycDk4bHplZGNsdWk4a2gzcGkzaXUxcGdndWdteXk4MWxlNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/3o6fJ0qM5f7d1I2Qda/giphy.gif'
];

const videoLinks = [
  'https://www.youtube.com/embed/1APwq1df6Mw',
  'https://www.youtube.com/embed/tgbNymZ7vqY',
  'https://www.youtube.com/embed/aqz-KE-bpKQ'
];

const sampleCreators = [
  { id: 'customer-c2c1', email: 'c2c1@gmail.com', name: 'C2C One' },
  { id: 'customer-c2c2', email: 'c2c2@gmail.com', name: 'C2C Two' }
];

const categoryNames: Record<ProductCategory, string[]> = {
  groceries: [
    'Staple Pantry Basket',
    'Cold-Pressed Oils Pack',
    'Whole Grain Essentials',
    'Community Breakfast Box',
    'Organic Pulses Mix',
    'Family Spice Rack',
    'Heritage Rice Selection',
    'Millet Superfood Pack',
    'Jaggery & Sweeteners Combo',
    'Local Honey Duo',
    'Artisanal Pasta Kit',
    'Farmhouse Soup Bundle',
    'Weekend Brunch Crate',
    'Community Snack Medley',
    'Sprouted Lentil Mix',
    'Hearty Broth Base',
    'Immunity Booster Basket',
    'Sunrise Tea & Coffee Set',
    'Festive Baking Essentials',
    'Zero-waste Grocery Starter'
  ],
  vegetables: [
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
    'Gourmet Mushrooms',
    'Rainbow Bell Peppers',
    'Curry Leaf Bunch',
    'Herb Planter Kit',
    'Seasonal Root Medley',
    'Hydroponic Lettuce'
  ],
  clothing: [
    'Handwoven Cotton Scarf',
    'Indie Print T-shirt',
    'Eco Dye Kurta',
    'Recycled Fabric Tote',
    'Organic Cotton Socks',
    'Block Print Bandana',
    'Linen Summer Shirt',
    'Upcycled Denim Apron',
    'Handloom Throw',
    'Minimalist Canvas Cap',
    'Artisan Bead Bracelet',
    'Kalamkari Wrap Skirt',
    'Crochet Beanie',
    'Everyday Bamboo Tee',
    'Naturally Dyed Stole',
    'Cotton Lounge Set',
    'Statement Tote Bag',
    'Heritage Weave Dupatta'
  ],
  services: [
    'Home Cleaning Session',
    'Community Handyman Slot',
    'Garden Care Visit',
    'Pet Walking Hour',
    'Personal Tutoring',
    'AC Deep Cleaning',
    'Appliance Repair Help',
    'Car Wash at Doorstep',
    'Curtain & Sofa Shampoo',
    'Bike Service Pickup',
    'Yoga Coaching Hour',
    'Music Lesson Slot',
    'Home Baking Workshop',
    'Photography Mini-shoot',
    'Interior Styling Consult',
    'Laundry & Ironing Run',
    'Laptop Troubleshooting',
    'Kids Activity Session',
    'Elderly Care Visit'
  ],
  dairy: [
    'A2 Cow Milk (1L)',
    'Fresh Paneer (200g)',
    'Greek Yogurt Cup',
    'Organic Ghee (250g)',
    'Classic Butter (500g)',
    'Curd Family Pack',
    'Flavored Lassi',
    'Cheddar Cheese Block',
    'Fresh Cream (200ml)',
    'Buttermilk Pack',
    'Paneer Tikka Cubes',
    'Protein Rich Whey Bottle',
    'Probiotic Kefir Drink',
    'Almond Butter Spread',
    'Masala Chaas Duo',
    'Herbed Cheese Spread',
    'Buffalo Milk (1L)',
    'Vanilla Pudding Cups',
    'Coffee Creamer Pack'
  ],
  homemade: [
    'Artisan Pickle Jar',
    'Millet Cookies Box',
    'Cold Brew Concentrate',
    'Hand-poured Soy Candle',
    'Nut Butter Sampler',
    'Granola Breakfast Jars',
    'Sourdough Starter Kit',
    'Herbal Bath Salt Vials',
    'Coconut Jaggery Laddoos',
    'Sun-dried Tomato Spread',
    'Seed Crackers Tin',
    'Handmade Soap Bars',
    'Chutney Trio Pack',
    'Floral Room Mist',
    'Artisan Fudge Box',
    'Craft Kombucha Batch',
    'Local Spice Rub Set',
    'Festive Sweet Platter',
    'Wellness Herb Infusion'
  ]
};

const sellerByCategory: Record<ProductCategory, { id: string; name: string; rating: number; city: string; phone: string; email: string }>
  = {
    groceries: { id: 'seller-grocer', name: 'Community Mart', rating: 4.7, city: 'Hyderabad', phone: '+91-99440-11111', email: 'grocer@communitymart.com' },
    vegetables: { id: 'seller-farmer', name: 'Fresh Produce Farm', rating: 4.8, city: 'Pune', phone: '+91-99440-22222', email: 'farmer@freshproduce.com' },
    clothing: { id: 'seller-clothing', name: 'Local Wear Co.', rating: 4.6, city: 'Delhi', phone: '+91-99440-33333', email: 'threads@localwear.com' },
    services: { id: 'seller-services', name: 'Home Helpers', rating: 4.5, city: 'Mumbai', phone: '+91-99440-44444', email: 'services@homehelpers.com' },
    dairy: { id: 'seller-dairy', name: 'Delight Milk Co.', rating: 4.9, city: 'Bengaluru', phone: '+91-99440-55555', email: 'dairy@delightmilk.com' },
    homemade: { id: 'seller-homemade', name: 'Craft Kitchen', rating: 4.9, city: 'Chennai', phone: '+91-99440-66666', email: 'maker@craftkitchen.com' }
  };

const buildProduct = (category: ProductCategory, productName: string, index: number): Product => {
  const seller = sellerByCategory[category];
  const creator = sampleCreators[index % sampleCreators.length];
  const marketPrice = 120 + index * 5 + (category === 'services' ? 200 : 0);
  const c2cPrice = marketPrice - 20;
  const stock = index % 5 === 0 ? 0 : 15 + index;
  const isPreorderAvailable = stock === 0 || category === 'services';
  const availabilityStatus = stock > 0 ? 'inStock' : isPreorderAvailable ? 'preorder' : 'outOfStock';
  const image = sampleImages[index % sampleImages.length];
  const videoUrl = videoLinks[index % videoLinks.length];
  const hoverMedia = hoverAnimations[index % hoverAnimations.length];
  const today = new Date();
  today.setDate(today.getDate() + (index % 6));

  return {
    id: `${category}-${index + 1}`,
    productName,
    description: `${productName} sourced directly from the community seller with transparent practices and care.`,
    category,
    sku: `${category.substring(0, 3)}-${index + 1}`,
    marketPrice,
    c2cPrice,
    priceDiscount: marketPrice - c2cPrice,
    images: [image],
    stock,
    sellerId: seller.id,
    sellerName: seller.name,
    sellerRating: seller.rating,
    reviewCount: 5 + index,
    sellerContact: { phone: seller.phone, email: seller.email },
    sellerLocations: [
      { address: `${seller.name} Storefront`, city: seller.city },
      { address: `${seller.city} community hub`, city: seller.city }
    ],
    deliveryOptions: { courier: category !== 'services', directVisit: category !== 'services' },
    availableDates: [today.toISOString()],
    upcomingScheduled: [
      {
        date: today.toISOString(),
        quantity: 10 + index
      }
    ],
    isActive: true,
    availabilityStatus,
    isPreorderAvailable,
    videoUrl,
    hoverMedia,
    verificationStatus: 'verified',
    createdById: creator.id,
    createdByEmail: creator.email,
    createdByName: creator.name,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

const buildCategoryProducts = (category: ProductCategory): Product[] =>
  categoryNames[category].map((name, index) => buildProduct(category, name, index));

export const MOCK_PRODUCTS: Product[] = [
  ...buildCategoryProducts('groceries'),
  ...buildCategoryProducts('vegetables'),
  ...buildCategoryProducts('clothing'),
  ...buildCategoryProducts('services'),
  ...buildCategoryProducts('dairy'),
  ...buildCategoryProducts('homemade')
];

export const MOCK_CUSTOMERS: CustomerProfile[] = [
  {
    id: 'buyer-sample',
    email: 'buyer@example.com',
    firstName: 'Sample',
    lastName: 'Buyer',
    phone: '+91-88888-12345',
    address: 'Community Road 5',
    city: 'Hyderabad',
    locationNote: 'Near the lakeside park',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'customer-c2c1',
    email: 'c2c1@gmail.com',
    firstName: 'C2C',
    lastName: 'One',
    phone: '+91-90000-10001',
    address: 'Sunrise Residency',
    city: 'Hyderabad',
    locationNote: 'Block A',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'customer-c2c2',
    email: 'c2c2@gmail.com',
    firstName: 'C2C',
    lastName: 'Two',
    phone: '+91-90000-10002',
    address: 'Park View Lane',
    city: 'Bengaluru',
    locationNote: 'Next to lake',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
