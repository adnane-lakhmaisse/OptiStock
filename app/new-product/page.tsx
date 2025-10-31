"use client"
import React, { useEffect, useState } from 'react'
import Wrapper from '../components/Wrapper'
import { useUser } from '@clerk/nextjs';
import { FormDataType } from '@/type';
import { Category } from '@prisma/client';
import { createProduct, getAllCategories } from '../actions';
import { FileImage } from 'lucide-react';
import ProductImage from '../components/ProductImage';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function Page() {
  const { user } = useUser()
  const email = user?.primaryEmailAddress?.emailAddress || "";
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<FormDataType>({
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    quantity: 0,
    unit: '',
    imageUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please select an image file.");
      return;
    }
    try {
      const imageData = new FormData();
      imageData.append('image', file);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: imageData,
      });
      const data = await response.json();

      if (data.success) {
        const updatedFormData = {
          ...formData,
          imageUrl: data.imageUrl,
        };
        setFormData(updatedFormData);

        await createProduct(updatedFormData, email );
        router.push('/products');
        toast.success("Product created successfully!");

      } else {
        toast.error("Image upload failed: " + data.message);
      }

    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (email) {
          const data = await getAllCategories(email);
          if (data) {
            setCategories(data);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, [email]);

  return (
    <Wrapper>
      <div className='flex justify-center items-center'>
        <div >
          <h1 className='text-2xl mb-4 font-bold'> Create new product</h1>
          <section className='flex md:flex-row flex-col'>
            <div className='space-y-4 md:w-[450px]'>
              <input
                className='input input-bordered w-full'
                type='text'
                name='name'
                id='name'
                placeholder='Name'
                value={formData.name}
                onChange={(e) => handleChange(e)}
              />
              <textarea
                className='textarea textarea-bordered w-full'
                name='description'
                id='description'
                placeholder='Description'
                value={formData.description}
                onChange={(e) => handleChange(e)}
              />
              <input
                className='input input-bordered w-full'
                type='number'
                name='price'
                id='price'
                placeholder='Price'
                value={formData.price}
                onChange={(e) => handleChange(e)}
              />
              <select className='select select-bordered w-full' value={formData.categoryId} name='categoryId' onChange={(e) => handleChange(e)}>
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <select className='select select-bordered w-full' value={formData.unit} name='unit' onChange={(e) => handleChange(e)}>
                <option value="">Select unit</option>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="l">l</option>
                <option value="ml">ml</option>
                <option value="pcs">pcs</option>
                <option value="pack">pack</option>
                <option value="box">box</option>
                <option value="bottle">bottle</option>
              </select>
              <input
                type='file'
                accept='image/*'
                placeholder='Image'
                className='file-input file-input-bordered w-full'
                onChange={(e) => handleFileChange(e)}
              />
              <button className='btn btn-primary text-white ' onClick={() => { handleSubmit() }}>
                Create Product
              </button>
            </div>

            <div className='md:ml-4 md:w-[300px]  mt-4 md:mt-0 border-2 border-primary md:h-[300px] flex items-center justify-center p-4 rounded-3xl'>
              {previewUrl ? (
                <ProductImage src={previewUrl} alt='Product Image' heightClass='h-60' widthClass='w-60' />
              ) : (
                <div className='w-64 h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg'>
                  <FileImage strokeWidth={1} className='w-10 h-10 text-primary' />
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </Wrapper>
  )
}
