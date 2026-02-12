
import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Silver Wave Highlight',
    price: 3499.00,
    description: 'A radiant silver-toned highlighter for a metallic glow.',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800',
    inStock: true,
    variants: [
      { name: 'Shade', options: ['Pure Silver', 'Moonlight Gold', 'Champagne Frost'] }
    ]
  },
  {
    id: '2',
    name: 'Midnight Velvet Lipstick',
    price: 1899.00,
    description: 'Deep matte black lipstick with extreme pigment.',
    image: 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?q=80&w=800',
    inStock: true,
    variants: [
      { name: 'Finish', options: ['Matte', 'Satin', 'Glossy'] }
    ]
  },
  {
    id: '3',
    name: 'Ocean Pearl Serum',
    price: 6499.00,
    description: 'Infused with crushed pearls for deep skin hydration.',
    image: 'https://images.unsplash.com/photo-1570172619380-2126ad04840b?q=80&w=800',
    inStock: true,
    variants: [
      { name: 'Size', options: ['30ml', '50ml', '100ml'] }
    ]
  }
];

// REPLACE THESE WITH YOUR ACTUAL DETAILS TO RECEIVE MONEY
export const MERCHANT_UPI_ID = '9652694202@ibl'; 
export const MERCHANT_NAME = 'Koushik';

export const LOGO_URL = 'https://image2url.com/r2/default/images/1770824221925-f75c7eca-c8bb-41fd-acae-d50d244edb5f.png';
