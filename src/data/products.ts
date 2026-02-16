export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: 'vetement' | 'accessoire' | 'goodies';
  variant?: string;
  image?: string;
  isNew?: boolean;
  inStock: boolean;
  sizes?: string[];
}

export const products: Product[] = [
  {
    id: 'hoodie-noir',
    name: 'Hoodie BinHarry',
    description: 'Hoodie confortable avec le logo BinHarry brodé',
    price: 35,
    category: 'vetement',
    variant: 'Noir',
    isNew: true,
    inStock: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'tshirt-blanc',
    name: 'T-Shirt BinHarry',
    description: 'T-shirt classique avec le logo BinHarry',
    price: 15,
    category: 'vetement',
    variant: 'Blanc',
    isNew: true,
    inStock: true,
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'tshirt-noir',
    name: 'T-Shirt BinHarry',
    description: 'T-shirt classique avec le logo BinHarry',
    price: 15,
    category: 'vetement',
    variant: 'Noir',
    isNew: false,
    inStock: true,
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'casquette',
    name: 'Casquette BinHarry',
    description: 'Casquette brodée avec le logo BinHarry',
    price: 12,
    category: 'accessoire',
    variant: 'Noir',
    isNew: true,
    inStock: true,
  },
  {
    id: 'tote-bag',
    name: 'Tote Bag BinHarry',
    description: 'Sac en toile réutilisable avec le logo BinHarry',
    price: 8,
    category: 'accessoire',
    variant: 'Naturel',
    isNew: false,
    inStock: true,
  },
  {
    id: 'mug',
    name: 'Mug BinHarry',
    description: 'Mug céramique avec le logo BinHarry',
    price: 10,
    category: 'goodies',
    variant: 'Blanc',
    isNew: false,
    inStock: true,
  },
  {
    id: 'stickers-pack',
    name: 'Pack de Stickers',
    description: '5 stickers BinHarry pour décorer ton laptop',
    price: 5,
    category: 'goodies',
    variant: 'Multicolore',
    isNew: true,
    inStock: true,
  },
  {
    id: 'gourde',
    name: 'Gourde BinHarry',
    description: 'Gourde isotherme 500ml avec le logo BinHarry',
    price: 18,
    category: 'goodies',
    variant: 'Noir',
    isNew: true,
    inStock: false,
  },
];

export const categories = [
  { id: 'all', name: 'Tout' },
  { id: 'vetement', name: 'Vêtements' },
  { id: 'accessoire', name: 'Accessoires' },
  { id: 'goodies', name: 'Goodies' },
];
