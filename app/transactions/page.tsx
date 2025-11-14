"use client"

import { Product, Transaction } from '@/type';
import { useUser } from '@clerk/nextjs';
import React, { useState } from 'react'

const Page = () => {
    const { user } = useUser()
    const email = user?.primaryEmailAddress?.emailAddress || "";
    const [products, setProducts] = useState<Product[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    return (
        <div>

        </div>
    )
}

export default Page
