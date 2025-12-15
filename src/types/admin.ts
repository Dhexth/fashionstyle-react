export type Product = {
  id: string;
  code: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  critical?: number;
  category: string;
  image?: string;
};

export type User = {
  id: string;
  run: string; // sin puntos ni guion, ej: 19011022K
  name: string;
  lastName: string;
  email: string;
  role: "Administrador" | "Vendedor" | "Cliente";
  region?: string;
  comuna?: string;
  address?: string;
  birthDate?: string;
};
