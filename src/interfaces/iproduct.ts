export interface IProduct {
  id: number;
  name: string;
  category: string;
  price: number | null; // Allow null
  currency: string;
  stock?: number;
  description: string;
  image?: string;
}
