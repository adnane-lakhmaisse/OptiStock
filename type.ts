import { Product as PrismaProduct } from "@prisma/client";
import { Transaction as PrismaTransaction } from "@prisma/client";
export interface Product extends PrismaProduct {
  categoryName?: string;
}

export interface FormDataType {
  id?: string;
  name: string;
  description: string;
  price: number;
  quantity?: number;
  categoryId?: string;
  unit?: string;
  categoryName?: string;
  imageUrl?: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  unit: string;
  imageUrl: string;
  name: string;
  availableQuantity: number;
}

export interface Transaction extends PrismaTransaction {
  categoryName: string | null;
  productName: string | null;
  imageUrl?: string | null;
  price: number;   
  unit: string | null;
}
