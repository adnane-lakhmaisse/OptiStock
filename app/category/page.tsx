"use client"

import React, { useEffect, useState } from 'react'
import Wrapper from '../components/Wrapper'
import CategoryModal from '../components/CategoryModal'
import { useUser } from '@clerk/nextjs';
import { createCategory, deleteCategory, getAllCategories, updateCategory } from '../actions';
import { toast } from 'react-toastify';
import { Category } from '@prisma/client';
import EmptyState from '../components/EmptyState';
import { PenLine, Trash2 } from 'lucide-react';

export default function Page() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress || "";
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const openCreateModal = () => {
    setName("");
    setDescription("");
    setLoading(false);
    setEditMode(false);
    (document.getElementById('category-modal') as HTMLDialogElement)?.showModal();
  }

  const openEditModal = (category: Category) => {
    setName(category.name);
    setDescription(category.description || "");
    setLoading(false);
    setEditMode(true);
    setEditingCategoryId(category.id);
    (document.getElementById('category-modal') as HTMLDialogElement)?.showModal();
  }

  const closeModal = () => {
    setName("");
    setDescription("");
    setLoading(false);
    setEditMode(false);
    (document.getElementById('category-modal') as HTMLDialogElement)?.close();
  }

  const handleCreateCategory = async () => {
    setLoading(true);
    if (email) {
      await createCategory(name, email, description);
    }
    await loadCategories();
    closeModal();
    setLoading(false);
    toast.success("Category created successfully");
  }

  const handleUpdateCategory = async (categoryId: string) => {
    if (!editingCategoryId) return;
    setLoading(true);
    if (email) {
      await updateCategory(categoryId, email, name, description);
    }
    await loadCategories();
    closeModal();
    setLoading(false);
    setEditingCategoryId(null);
    toast.success("Category updated successfully");
  }

  const handleDeleteCategory = async (categoryId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this category? All items under this category will also be deleted.");
    if (!confirmDelete) return;   

    setLoading(true);
    if (email) {
      await deleteCategory(categoryId, email);
    }
    await loadCategories();
    setLoading(false);
    toast.success("Category deleted successfully");
  }

  const loadCategories = async () => {
    if (email) {
      const data = await getAllCategories(email);
      if (data) {
        setCategories(data);
      }
    }
  }

  useEffect(() => {
    if (email) {
      loadCategories();
    }
  }, [email]);

  return (
    <Wrapper>
      <h1>Category Page</h1>
      <div>
        <div className='mb-2 '>
          <button className='btn btn-primary text-white mt-4' onClick={openCreateModal}>
            add category
          </button>
        </div>

        {categories.length === 0 ? (
          <EmptyState message="No categories found." IconComponent="Group" />
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {categories.map((category) => (
              <div key={category.id} className='mb-2 p-5 border-2 border-base-200 flex justify-between items-center rounded-3xl cursor-pointer' >
                <div>
                  <h2 className='font-bold text-lg'>{category.name}</h2>
                  <p className='text-sm text-gray-600 mt-2'>{category.description}</p>
                </div>
                <div>
                  <button
                    className='btn btn-ghost btn-sm'
                    onClick={() => openEditModal(category)}
                  >
                    <PenLine className='w-4 h-4 text-primary' />
                  </button>
                  <button
                    className='btn btn-ghost btn-sm'
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2 className='w-4 h-4 text-error' />
                  </button>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <CategoryModal
        name={name}
        description={description}
        loading={loading}
        onChangeName={setName}
        onChangeDescription={setDescription}
        onClose={closeModal}
        onSubmit={editMode ? () => handleUpdateCategory(editingCategoryId!) : handleCreateCategory}
        editMode={editMode} />
    </Wrapper>
  )
}
