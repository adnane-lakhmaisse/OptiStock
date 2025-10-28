"use client"

import React, { useState } from 'react'
import Wrapper from '../components/Wrapper'
import CategoryModal from '../components/CategoryModal'
import { useUser } from '@clerk/nextjs';
import { createCategory, updateCategory } from '../actions';
import { toast } from 'react-toastify';

export default function Page() {
  const {user} = useUser();
  const email = user?.primaryEmailAddress?.emailAddress || "" ;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  const openCreateModal = () => {
    setName("");
    setDescription("");
    setLoading(false);
    setEditMode(false);
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
    if(email) {
      await createCategory(name, email, description);
    }
    closeModal();
    setLoading(false);
    toast.success("Category created successfully");
  }


  const handleUpdateCategory = async (categoryId : string) => {
    if(!editingCategoryId) return ;
    setLoading(true);
    if(email) {
      await updateCategory(categoryId, email, name, description);
    }
    closeModal();
    setLoading(false);
    setEditingCategoryId(null);
    toast.success("Category updated successfully");
  }

  return (
    <Wrapper>
      <h1>Category Page</h1>
      <div>
        <div className='mb-2 '>
          <button className='btn btn-primary text-white mt-4' onClick={openCreateModal}>
            add category
          </button>
        </div>
      </div>
      <CategoryModal 
        name={name} 
        description={description} 
        loading={loading} 
        onChangeName={setName}
        onChangeDescription={setDescription}
        onClose={closeModal}   
        onSubmit={handleCreateCategory} 
        editMode={editMode} />
    </Wrapper>
  )
}
