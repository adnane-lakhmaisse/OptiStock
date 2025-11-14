"use client"

import { OrderItem, Product } from '@/type';
import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react'
import Wrapper from '../components/Wrapper';
import { deductStockWithTransaction, getAllProducts } from '../actions';
import ProductComponent from '../components/ProductComponent';
import EmptyState from '../components/EmptyState';
import ProductImage from '../components/ProductImage';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Page = () => {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [order, setOrder] = useState<OrderItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProductsIds, setSelectedProductsIds] = useState<string[]>([]);

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

  const filteredAvailableProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).filter((product) => !selectedProductsIds.includes(product.id)).slice(0, 10);

  const handleAddToCart = (product: Product) => {
    setOrder((prevOrder) => {
      const existingProduct = prevOrder.find((item) => item.productId === product.id);
      let updatedOrder;
      if (existingProduct) {
        updatedOrder = prevOrder.map((item) =>
          item.productId === product.id ? {
            ...item, quantity: Math.min(item.quantity + 1, product.quantity)
          } : item
        )
      } else {
        updatedOrder = [...prevOrder, {
          productId: product.id,
          quantity: 1,
          unit: product.unit,
          imageUrl: product.imageUrl,
          name: product.name,
          availableQuantity: product.quantity,
        }]
      }

      setSelectedProductsIds((prevSelected) =>
        prevSelected.includes(product.id) ? prevSelected : [...prevSelected, product.id]
      );
      return updatedOrder;
    })
  }

  const handleQuantityChange = (productId: string, quantity: number) => {
    setOrder((prevOrder) =>
      prevOrder.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    )
  }

  const handleRemoveFromCart = (productId: string) => {
    setOrder((prevOrder) => {
      const updatedOrder = prevOrder.filter((item) =>
        item.productId !== productId
      )
      setSelectedProductsIds((prevSelectedProductsIds) =>
        prevSelectedProductsIds.filter((id) => id !== productId)
      )
      return updatedOrder;
    })
  }

  const handleSubmit = async () => {
    try {
      if (order.length == 0) {
        toast.error('Please add products to the order.')
        return;
      }

      const response = await deductStockWithTransaction(order, email)

      if (response?.success) {
        toast.success('Donation confirmed successfully.')
        setOrder([]);
        setSelectedProductsIds([]);
        fetchProducts();
      } else {
        toast.error(`${response?.message}`)
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Wrapper>
      <div className='flex md:flex-row flex-col-reverse pt-4'>
        <div className='md:w-1/3'>
          <input
            type="text"
            placeholder='Search a product...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='input input-bordered w-full mb-4'
          />
          <div className='space-y-4' >
            {filteredAvailableProducts.length > 0 ? (
              filteredAvailableProducts.map((product, index) => (
                <ProductComponent
                  product={product}
                  key={index}
                  add={true}
                  handleAddToCart={handleAddToCart}
                />
              ))
            ) : (
              <EmptyState
                message="No products found."
                IconComponent="PackageSearch"
              />
            )}
          </div>

        </div>

        <div className='md:w-2/3 p-4 md:ml-4 mb-4 md:mb-0 h-fit border-2 border-base-200 rounded-3xl overflow-x-auto'>
          {order.length > 0 ? (
            <>
              <table className='table w-full scroll-auto' >
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {order.map((item) => (
                    <tr key={item.productId}>
                      <td>
                        <ProductImage
                          src={item.imageUrl}
                          alt={item.imageUrl}
                          heightClass="h-12"
                          widthClass="w-12"
                        />
                      </td>
                      <td>{item.name}</td>
                      <td>
                        <input
                          type="number"
                          value={item.quantity}
                          min={1}
                          max={item.availableQuantity}
                          onChange={(e) => handleQuantityChange(item.productId, Number(e.target.value))}
                          className='input input-bordered mb-4 w-20'
                        />
                      </td>
                      <td className='capitalize'>{item.unit}</td>
                      <td>
                        <button className="btn btn-sm btn-error text-white w-fit" onClick={() => handleRemoveFromCart(item.productId)}>
                          <Trash2 className='w-4 h-4' />
                        </button>
                      </td>
                    </tr>
                  )
                  )}
                </tbody>
              </table>
              <button className='btn btn-primary text-white mt-4 w-fit' onClick={handleSubmit}>
                Confirm the donation.
              </button>
            </>
          ) : (
            <EmptyState message='No products in the cart.' IconComponent='HandHeart' />
          )}
        </div>
      </div>
    </Wrapper>
  )
}

export default Page
