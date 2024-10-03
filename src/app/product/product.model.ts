export interface Product {
  name: string;
  sku: string;
  category: string;
  description: string;
  size: string;
  weight: string;
  price: number;
  priceUnitary: number;
  priceWholesale: number;
  quantity: number;
  image: any;
}

export interface ProductListPaginated {
  startIndex: number;
  endIndex: number;
  count: number;
  page: number;
  pages: number;
  totalProductsPage: number;
  products: Product[];
}

export interface Page {
  index: number;
}

export interface LimitOptions {
  values: number[];
}

export enum ClientType {
  Retail = 'Retail',
  Wholesale = 'Wholesale'
}
