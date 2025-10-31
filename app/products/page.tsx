"use client"
import React, { useEffect, useState } from 'react'
import Wrapper from '../components/Wrapper'
import { useUser } from '@clerk/nextjs';
import { Product } from '@/type';
import { getAllProducts } from '../actions';
import EmptyState from '../components/EmptyState';
import ProductImage from '../components/ProductImage';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';

export default function Page() {
  const { user } = useUser()
  const email = user?.primaryEmailAddress?.emailAddress || "";
  const [products, setProducts] = useState<Product[]>([]);

  

  const fetchProducts = async () => {
    try {
      if (email) {
        const products = await getAllProducts(email);
        if (products) {
          setProducts(products);
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    };
  }

  useEffect(() => {
    if (email) {
      fetchProducts();
    }
  }, [email]);

  return (
    <Wrapper>
      <div className='overflow-x-auto'>
        {products.length === 0 ? (
          <EmptyState message="No products found." IconComponent="PackageSearch" />
        ) : (
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th></th>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id}>
                  <th>{index + 1}</th>
                  <td>
                    <ProductImage src={product.imageUrl} alt={product.imageUrl} heightClass="h-12" widthClass='w-12' />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>${product.price}</td>
                  <td className='capitalize'>{product.quantity} {product.unit}</td>
                  <td>{product.categoryName}</td>
                  <td>
                    <Link href={`/edit-product/${product.id}`} className="btn btn-xs btn-primary mr-2 text-white w-fit">Edit</Link>
                    <button className="btn btn-xs btn-error mr-2 text-white w-fit"><Trash2 className='w-3 h-3'/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Wrapper>
  )
}

