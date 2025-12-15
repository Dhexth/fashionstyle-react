export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;  
  imageUrl?: string;
  category?: string;
  code?: string;  
  stock?: number;
}