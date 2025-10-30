"use server";

import prisma from "@/lib/prisma";
import { FormDataType, Product } from "@/type";
import type { Category } from "@prisma/client";

export async function checkAndAddAssociation(email: string, name: string) {
  if (!email) return;
  try {
    const existingAssociation = await prisma.association.findUnique({
      where: {
        email,
      },
    });
    if (!existingAssociation && name) {
      await prisma.association.create({
        data: {
          email,
          name,
        },
      });
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getAssociation(email: string) {
  if (!email) return;
  try {
    const existingAssociation = await prisma.association.findUnique({
      where: {
        email,
      },
    });
    return existingAssociation;
  } catch (error) {
    console.error(error);
  }
}

export async function createCategory(
  name: string,
  email: string,
  description: string
) {
  if (!name) return;
  try {
    const association = await getAssociation(email);
    if (!association) {
      throw new Error("Association not found with this email");
    }
    await prisma.category.create({
      data: {
        name,
        description: description || "",
        associationId: association.id,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create category");
  }
}

export async function updateCategory(
  id: string,
  email: string,
  name: string,
  description: string
) {
  if (!id || !email || !name) {
    throw new Error("ID, email and name are required to update a category");
  }
  try {
    const association = await getAssociation(email);
    if (!association) {
      throw new Error("Association not found with this email");
    }
    await prisma.category.update({
      where: {
        id: id,
        associationId: association.id,
      },
      data: {
        name,
        description: description || "",
        associationId: association.id,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update category");
  }
}

export async function deleteCategory(id: string, email: string) {
  if (!id || !email) {
    throw new Error("ID and email are required to delete a category");
  }
  try {
    const association = await getAssociation(email);
    if (!association) {
      throw new Error("Association not found with this email");
    }
    await prisma.category.delete({
      where: {
        id: id,
        associationId: association.id,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete category");
  }
}

export async function getAllCategories(
  email: string
): Promise<Category[] | undefined> {
  if (!email) {
    throw new Error("Email is required to get categories");
  }
  try {
    const association = await getAssociation(email);
    if (!association) {
      throw new Error("Association not found with this email");
    }
    const categories = await prisma.category.findMany({
      where: {
        associationId: association.id,
      },
    });
    return categories;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get categories");
  }
}

export async function createProduct(formData: FormDataType, email: string) {
  const { name, description, price, quantity, categoryId, unit, imageUrl } =
    formData;
  if (!name || !price || !email || !categoryId) {
    throw new Error(
      "Name, price, categoryId and email are required to create a product"
    );
  }
  const safeImageUrl = imageUrl || "";
  const safeUnit = unit || "";

  try {
    const association = await getAssociation(email);
    if (!association) {
      throw new Error("Association not found with this email");
    }
    await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        quantity: quantity ? Number(quantity) : 0,
        categoryId,
        unit: safeUnit,
        imageUrl: safeImageUrl,
        associationId: association.id,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create product");
  }
}

export async function updateProduct(formData: FormDataType, email: string) {
  const { id, name, description, price, imageUrl, categoryId } = formData;
  if (!id || !price || !email || !categoryId) {
    throw new Error(
      "ID, price, email and categoryId are required to update a product"
    );
  }
  const safeImageUrl = imageUrl || "";
  try {
    const association = await getAssociation(email);
    if (!association) {
      throw new Error("Association not found with this email");
    }
    await prisma.product.update({
      where: {
        id: id,
        associationId: association.id,
      },
      data: {
        name,
        description: description || "",
        price: Number(price),
        imageUrl: safeImageUrl,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update product");
  }
}

export async function deleteProduct(id: string, email: string) {
  if (!id || !email) {
    throw new Error("ID and email are required to delete a product");
  }
  try {
    const association = await getAssociation(email);
    if (!association) {
      throw new Error("Association not found with this email");
    }
    await prisma.product.delete({
      where: {
        id: id,
        associationId: association.id,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete product");
  }
}

export async function getAllProducts(email: string) : Promise<Product[] | undefined> {
    if (!email) {
        throw new Error("Email is required to get products");
    }
    try {
        const association = await getAssociation(email);
        if (!association) {
            throw new Error("Association not found with this email");
        }
        const products = await prisma.product.findMany({
            where: {
                associationId: association.id,
            },
            include: {
                category: true,
            },
        });
        return products.map(product => ({
            ...product,
        categoryName: product.category ? product.category.name : "",
        }))

    } catch (error) {
        console.error(error);
        throw new Error("Failed to get products");
    }
}

export async function getProductById(ProductId: string, email: string) : Promise<Product | undefined> {
    if (!ProductId || !email) {
        throw new Error("ID and email are required to get a product");
    }
    try {
        const association = await getAssociation(email);
        if (!association) {
            throw new Error("Association not found with this email");
        }
        const product = await prisma.product.findUnique({
            where: {
                id: ProductId,
                associationId: association.id,
            },
            include: {
                category: true,
            },
        });
        if (!product) {
            throw new Error("Product not found");
        }
        return {
            ...product,
            categoryName: product.category ? product.category.name : "",
        };
    } catch (error) {
        console.error(error);
        throw new Error("Failed to get product");
    }
}