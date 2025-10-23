import { Product } from '../types';

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Camiseta Básica de Algodón',
    categoryId: 'cat-1',
    barcode: '1234567890123',
    costPrice: 8,
    salePrice: 19.99,
    imageUrl: 'https://picsum.photos/seed/prod1-white/400/400',
    sizes: [
      { sizeId: 'size-2', quantity: 10 },
      { sizeId: 'size-3', quantity: 15 },
      { sizeId: 'size-4', quantity: 12 },
    ],
    variants: [
      {
        id: 'var-1b',
        name: 'Negro',
        imageUrl: 'https://picsum.photos/seed/prod1-black/400/400',
        sizes: [
          { sizeId: 'size-2', quantity: 8 },
          { sizeId: 'size-3', quantity: 20 },
          { sizeId: 'size-4', quantity: 10 },
          { sizeId: 'size-5', quantity: 5 },
        ],
      },
       {
        id: 'var-1c',
        name: 'Rojo',
        imageUrl: 'https://picsum.photos/seed/prod1-red/400/400',
        sizes: [
          { sizeId: 'size-3', quantity: 7 },
          { sizeId: 'size-4', quantity: 7 },
        ],
      },
    ],
  },
  {
    id: 'prod-2',
    name: 'Jeans Slim Fit',
    categoryId: 'cat-2',
    barcode: '2345678901234',
    costPrice: 25,
    salePrice: 59.99,
    imageUrl: 'https://picsum.photos/seed/prod2-blue/400/400',
    sizes: [
      { sizeId: 'size-2', quantity: 5 },
      { sizeId: 'size-3', quantity: 8 },
      { sizeId: 'size-4', quantity: 6 },
    ],
    // This product has no variants
  },
  {
    id: 'prod-3',
    name: 'Zapatillas Urbanas',
    categoryId: 'cat-3',
    barcode: '3456789012345',
    costPrice: 40,
    salePrice: 89.99,
    imageUrl: 'https://picsum.photos/seed/prod3-grey/400/400',
    sizes: [
      { sizeId: 'size-3', quantity: 10 },
      { sizeId: 'size-4', quantity: 10 },
      { sizeId: 'size-5', quantity: 8 },
    ],
    variants: [
       {
        id: 'var-3b',
        name: 'Rojo',
        imageUrl: 'https://picsum.photos/seed/prod3-red/400/400',
        sizes: [
          { sizeId: 'size-3', quantity: 5 },
          { sizeId: 'size-4', quantity: 7 },
        ],
      },
    ],
  },
  {
    id: 'prod-4',
    name: 'Gorra de Béisbol',
    categoryId: 'cat-4',
    barcode: '4567890123456',
    costPrice: 10,
    salePrice: 24.99,
    imageUrl: 'https://picsum.photos/seed/prod4/400/400',
    sizes: [
        { sizeId: 'size-6', quantity: 30 },
    ],
  },
];