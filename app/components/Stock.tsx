import { Product } from '@/type';
import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react'
import { getAllProducts } from '../actions';
import ProductComponent from './ProductComponent';

export default function Stock() {
    const { user } = useUser();
    const email = user?.primaryEmailAddress?.emailAddress || "";
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<string>('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState<number>(0);

    const handleProductChange = (productId: string) => {
        const product = products.find((product) => product.id == productId);
        setSelectedProduct(product || null);
        setSelectedProductId(productId);
    }

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
        <div>
            {/* You can open the modal using document.getElementById('ID').showModal() method */}
            <dialog id="my_modal_stock" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Stock Management</h3>
                    <p className="py-4">Add quantities to the products available in your Stock</p>
                    <form className='space-y-2 '>
                        <label className='block'> Select product</label>
                        <select
                            value={selectedProductId}
                            className='select select-bordored w-full'
                            required
                            onChange={(e) => handleProductChange(e.target.value)}
                        >
                            <option value=''>Select product</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>{product.name} - {product.categoryName}</option>
                            ))}
                        </select>
                        {selectedProduct && <ProductComponent product={selectedProduct} />}

                        <label className='block'> Add quantity </label>
                        <input
                            type="number"
                            placeholder='Quantity'
                            value={quantity}
                            required
                            onChange={(e)=>setQuantity(Number(e.target.value))}
                            className='input input-bordered w-full'
                        />
                        <button className='btn btn-primary w-fit text-white' type='submit'>
                            Add to stock
                        </button>
                    </form>
                </div>
            </dialog>
        </div>
    )
}
