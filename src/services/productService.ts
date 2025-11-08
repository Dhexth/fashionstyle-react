import { Product } from "../types/product";

const demo: Product[] = [
  {
    id: "p-1",
    name: "Polera Básica Blanca",
    image: "/images/productos/polera-blanca.jpg",
    price: 19990,
    description: "Polera 100% algodón",
    category: "Ropa"
  },
  {
    id: "p-2",
    name: "Jeans Slim Fit", 
    image: "/images/productos/jeans-slim-fit.jpg",
    price: 39990,
    description: "Jeans cómodos y resistentes",
    category: "Ropa"
  },
  {
    id: "p-3",
    name: "Vestido Floral",
    image: "/images/productos/vestido-floral.jpg",
    price: 45990,
    description: "Vestido ligero y elegante",
    category: "Ropa"
  },
  {
    id: "p-4",
    name: "Abrigo Invernal",
    image: "/images/productos/abrigo-invernal.jpg",
    price: 59990,
    description: "Abrigo cálido para invierno",
    category: "Ropa"
  },
  {
    id: "p-5",
    name: "Chaqueta de Cuero",
    image: "/images/productos/chaqueta-cuero.jpg",
    price: 79990,
    description: "Chaqueta de cuero genuino",
    category: "Ropa"
  },
  {
    id: "p-6",
    name: "Zapatillas Urbanas",
    image: "/images/productos/zapatillas-urbanas.jpg",
    price: 54990,
    description: "Zapatillas cómodas para ciudad",
    category: "Calzado"
  }
];

export async function fetchProducts(): Promise<Product[]> {
  await new Promise((r) => setTimeout(r, 200));
  return demo;
}

export async function fetchProductById(id: string): Promise<Product | null> {
  await new Promise((r) => setTimeout(r, 150));
  return demo.find((p) => p.id === id) ?? null;
}