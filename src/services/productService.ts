// src/services/productService.ts
import { Product } from "../types/product";
import { productsAPI } from "./api";

/**
 * Transforma producto del backend al formato del frontend - VERSIÓN MEJORADA
 */
function transformProduct(product: any): Product {
  console.log('Transformando producto:', product);
  
  // Validaciones más robustas
  if (!product) {
    console.warn('Producto nulo recibido');
    return getDefaultProduct();
  }

  // Construir URL correcta para imágenes
  const getImageUrl = (imagePath: string) => {
    if (!imagePath || imagePath.trim() === '') {
      return "https://via.placeholder.com/300x300/EFEFEF/666666?text=Imagen+no+disponible";
    }
    
    // Si ya es una URL completa
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Si es una ruta local
    const baseUrl = 'http://localhost:8080';
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    
    return `${baseUrl}${cleanPath}`;
  };

  // Mapeo de categorías más flexible
  const getCategoryName = (categoryData: any): string => {
    if (typeof categoryData === 'string') return categoryData;
    if (typeof categoryData === 'number') {
      const categoryMap: { [key: number]: string } = {
        1: "Ropa",
        2: "Calzado", 
        3: "Accesorios"
      };
      return categoryMap[categoryData] || "Otra categoría";
    }
    return "Sin categoría";
  };

  // Mapeo con valores por defecto
  const transformedProduct: Product = {
    id: product.id?.toString() || `temp-${Date.now()}`,
    name: product.nombre || product.name || "Producto sin nombre",
    description: product.descripcion || product.description || "Sin descripción disponible",
    image: getImageUrl(product.imagen || product.image),
    price: Number(product.precio || product.price || 0),
    stock: product.stock !== undefined ? Number(product.stock) : 10,
    category: getCategoryName(product.categoria || product.categoria_id || product.category)
  };

  console.log('Producto transformado:', transformedProduct);
  return transformedProduct;
}

function getDefaultProduct(): Product {
  return {
    id: 'default',
    name: 'Producto no disponible',
    description: 'Este producto no pudo ser cargado',
    image: 'https://via.placeholder.com/300x300/EFEFEF/666666?text=Error+cargando',
    price: 0,
    stock: 0,
    category: 'Error'
  };
}

/**
 * Obtiene TODOS los productos del backend Spring Boot - VERSIÓN CORREGIDA
 */
export async function fetchProducts(): Promise<Product[]> {
  try {
    console.log('Cargando productos desde backend...');
    
    // Hacer petición directa para diagnóstico
    const testResponse = await fetch('http://localhost:8080/api/v1/productos');
    console.log('Status de respuesta:', testResponse.status, testResponse.statusText);
    
    if (!testResponse.ok) {
      throw new Error(`Error del servidor: ${testResponse.status} ${testResponse.statusText}`);
    }
    
    const rawData = await testResponse.json();
    console.log('Datos crudos del backend:', rawData);
    console.log('Cantidad de productos recibidos:', rawData.length);
    
    if (!rawData || rawData.length === 0) {
      console.warn('El backend respondió con array vacío');
      return [];
    }
    
    // Mostrar estructura completa del primer producto
    console.log('Estructura del primer producto:', JSON.stringify(rawData[0], null, 2));
    
    const transformedProducts = rawData.map(transformProduct);
    console.log('Productos transformados:', transformedProducts.length);
    
    return transformedProducts;
    
  } catch (error) {
    console.error('Error cargando productos:', error);
    return [];
  }
}

/**
 * Obtiene un producto específico por ID del backend - VERSIÓN CORREGIDA
 */
export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    console.log(`Cargando producto ${id}...`);
    
    const testResponse = await fetch(`http://localhost:8080/api/v1/productos/${id}`);
    console.log(`Status de respuesta: ${testResponse.status} ${testResponse.statusText}`);
    
    if (testResponse.status === 404) {
      throw new Error(`Producto con ID ${id} no encontrado en el servidor`);
    }
    
    if (!testResponse.ok) {
      throw new Error(`Error del servidor: ${testResponse.status} ${testResponse.statusText}`);
    }
    
    const rawData = await testResponse.json();
    console.log('Producto crudo del backend:', rawData);
    
    const transformedProduct = transformProduct(rawData);
    console.log('Producto transformado:', transformedProduct);
    
    return transformedProduct;
    
  } catch (error) {
    console.error(`Error cargando producto ${id}:`, error);
    return null;
  }
}

/**
 * Obtiene productos destacados del backend
 */
export async function fetchFeaturedProducts(): Promise<Product[]> {
  try {
    console.log('Cargando productos destacados...');
    
    const allProducts = await fetchProducts();
    const featuredProducts = allProducts.slice(0, 6);
    console.log(`Usando ${featuredProducts.length} productos como destacados`);
    
    return featuredProducts;
    
  } catch (error) {
    console.error('Error cargando productos destacados:', error);
    return [];
  }
}

/**
 * Busca productos por nombre en el backend
 */
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    console.log(`Buscando productos: ${query}`);
    
    const allProducts = await fetchProducts();
    const filteredProducts = allProducts.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    );
    
    console.log(`Encontrados ${filteredProducts.length} productos para: ${query}`);
    return filteredProducts;
    
  } catch (error) {
    console.error('Error buscando productos:', error);
    return [];
  }
}

/**
 * Obtiene productos por categoría del backend
 */
export async function fetchProductsByCategory(categoryName: string): Promise<Product[]> {
  try {
    console.log(`Cargando productos de categoría ${categoryName}...`);
    
    const allProducts = await fetchProducts();
    const categoryProducts = allProducts.filter(p => 
      p.category?.toLowerCase() === categoryName.toLowerCase()
    );
    
    console.log(`Encontrados ${categoryProducts.length} productos en categoría ${categoryName}`);
    return categoryProducts;
    
  } catch (error) {
    console.error(`Error cargando productos de categoría ${categoryName}:`, error);
    return [];
  }
}