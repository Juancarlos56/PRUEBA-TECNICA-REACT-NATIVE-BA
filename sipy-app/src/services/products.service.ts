import { API_BASE_URL } from '../constants';
import { Product, ProductsResponse, Category } from '../types';

export const getProducts = async (
  limit = 20,
  skip = 0
): Promise<ProductsResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/products?limit=${limit}&skip=${skip}`
  );
  if (!response.ok) throw new Error('Error al obtener productos');
  return response.json();
};

export const getProductById = async (id: number): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!response.ok) throw new Error('Error al obtener producto');
  return response.json();
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_BASE_URL}/products/categories`);
  if (!response.ok) throw new Error('Error al obtener categorías');
  return response.json();
};

export const getProductsByCategory = async (
  category: string,
  limit = 20,
  skip = 0
): Promise<ProductsResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/products/category/${category}?limit=${limit}&skip=${skip}`
  );
  if (!response.ok) throw new Error('Error al obtener productos por categoría');
  return response.json();
};

export const searchProducts = async (
  query: string
): Promise<ProductsResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/products/search?q=${query}`
  );
  if (!response.ok) throw new Error('Error al buscar productos');
  return response.json();
};
