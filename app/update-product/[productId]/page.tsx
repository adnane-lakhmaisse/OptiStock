"use client"

import { getProductById, updateProduct } from '@/app/actions';
import ProductImage from '@/app/components/ProductImage';
import Wrapper from '@/app/components/Wrapper';
import { FormDataType, Product } from '@/type';
import { useUser } from '@clerk/nextjs';
import { FileImage } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

export default function Page({ params }: { params: Promise<{ productId: string }> }) {
    const { user } = useUser()
    const email = user?.primaryEmailAddress?.emailAddress || "";
    const router = useRouter()
    const [product, setProduct] = useState<Product | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormDataType>({
        id: '',
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        categoryName: '',
        categoryId: ''
    });

    const fetchProduct = async () => {
        try {
            const { productId } = await params;
            if (email) {
                const fetchedProduct = await getProductById(productId, email);
                if (fetchedProduct) {
                    setProduct(fetchedProduct);
                    setFormData({
                        id: fetchedProduct.id,
                        name: fetchedProduct.name,
                        description: fetchedProduct.description,
                        price: fetchedProduct.price,
                        imageUrl: fetchedProduct.imageUrl,
                        categoryName: fetchedProduct.categoryName,
                        categoryId: fetchedProduct.categoryId // ← Zedt hadi!
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching product:", error);
        }
    }

    useEffect(() => {
        fetchProduct();
    }, [email]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === 'price' || name === 'quantity' ? Number(value) : value,
        }));
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);
        setPreviewUrl(selectedFile ? URL.createObjectURL(selectedFile) : null);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let imageUrl = formData.imageUrl; // Start with existing image

        try {
            // Ila kant file jdida, upload-ha
            if (file) {
                // Delete l image l9dima (ghir ila kant kayna)
                if (formData.imageUrl) {
                    try {
                        const responseDelete = await fetch('/api/upload', {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ imageUrl: formData.imageUrl }), // ← Changed 'path' to 'imageUrl'
                        });

                        const dataDelete = await responseDelete.json();

                        if (!dataDelete.success) {
                            console.warn('Could not delete old image:', dataDelete.error);
                        }
                    } catch (deleteError) {
                        console.warn('Error deleting old image:', deleteError);
                    }
                }

                // Upload l image jdida
                const imageData = new FormData();
                imageData.append('image', file);
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: imageData,
                });
                const data = await response.json();

                if (!data.success) {
                    throw new Error('Error uploading new image');
                }

                // ← HADI HIYA L MUHIMMA: Update imageUrl b path jdida!
                // L API kat-return 'imageUrl' machi 'path'
                imageUrl = data.imageUrl;

                console.log('New image uploaded:', imageUrl); // For debugging
            }

            // Update l product (m3a imageUrl jdida!)
            await updateProduct({
                ...formData,
                imageUrl: imageUrl, // ← Use updated imageUrl
                categoryId: formData.categoryId
            }, email);

            router.push('/products');
            toast.success("Product updated successfully!");

        } catch (error) {
            console.error('Error updating product:', error);
            toast.error("Error updating product. Please try again.");
        }
    }

    return (
        <Wrapper>
            <div className='flex justify-center items-center'>
                {product ? (
                    <div>
                        <h1 className='text-2xl mb-4 font-bold'>Update Product:</h1>
                        <div className='flex md:flex-row flex-col md:items-center ' >
                            <form className='space-y-4 md:w-[450px]' onSubmit={handleSubmit}>
                                <label className='text-sm font-semibold mb-2' >Name</label>
                                <input
                                    className='input input-bordered w-full'
                                    type='text'
                                    name='name'
                                    id='name'
                                    placeholder='Name'
                                    value={formData.name}
                                    onChange={(e) => handleInputChange(e)}
                                />

                                <label className='text-sm font-semibold mb-2' >Description</label>
                                <textarea
                                    className='textarea textarea-bordered w-full'
                                    name='description'
                                    id='description'
                                    placeholder='Description'
                                    value={formData.description}
                                    onChange={(e) => handleInputChange(e)}
                                />

                                <label className='text-sm font-semibold mb-2' >Category</label>
                                <input
                                    className='input input-bordered w-full'
                                    type='text'
                                    name='categoryName'
                                    id='categoryName'
                                    value={formData.categoryName}
                                    disabled
                                />
                                <label className='text-sm font-semibold mb-2' > Image / Price </label>
                                <div className='flex' >
                                    <input
                                        type='file'
                                        accept='image/*'
                                        placeholder='Image'
                                        className='file-input file-input-bordered w-full'
                                        onChange={(e) => handleFileChange(e)}
                                    />
                                    <input
                                        className='input input-bordered w-full ml-2'
                                        type='number'
                                        name='price'
                                        id='price'
                                        placeholder='Price'
                                        value={formData.price}
                                        onChange={(e) => handleInputChange(e)}
                                    />
                                </div>
                                <button type='submit' className='btn btn-primary text-white mt-3' >
                                    Update Product
                                </button>
                            </form>

                            <div className='flex md:flex-col md:ml-4 mt-4 md:mt-0' >

                                <div className='md:ml-4 md:w-[200px]  mt-4 md:mt-0 border-2 border-primary md:h-[200px]  items-center justify-center p-4 rounded-3xl mb-4 hidden md:flex'>
                                    {formData.imageUrl ? (
                                        <ProductImage src={formData.imageUrl} alt={product.name} heightClass='h-40' widthClass='w-40' />
                                    ) : (
                                        <div className='w-40 h-40 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg'>
                                            <FileImage strokeWidth={1} className='w-10 h-10 text-primary' />
                                        </div>
                                    )}
                                </div>

                                <div className='md:ml-4 w-full mt-4 md:mt-0 border-2 border-primary md:h-[200px] flex items-center justify-center p-4 rounded-3xl'>
                                    {previewUrl ? (
                                        <ProductImage src={previewUrl} alt='Product Image' heightClass='h-40' widthClass='w-40' />
                                    ) : (
                                        <div className='w-40 h-40 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg'>
                                            <FileImage strokeWidth={1} className='w-10 h-10 text-primary' />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center items-center w-full h-64">
                        <span className="loading loading-spinner text-primary"></span>
                    </div>
                )}
            </div>
        </Wrapper>
    )
}