"use client"

import { Product, Transaction } from '@/type';
import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react'
import Wrapper from '../components/Wrapper';
import { getAllProducts, getTransactions } from '../actions';
import EmptyState from '../components/EmptyState';
import TransactionComponent from '../components/TransactionComponent';
import { RotateCcw } from 'lucide-react';

const ITEMS_PER_PAGE = 5

const Page = () => {
    const { user } = useUser()
    const email = user?.primaryEmailAddress?.emailAddress || "";
    const [products, setProducts] = useState<Product[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [startDate, setStartDate] = useState<string>('')
    const [endDate, setEndDate] = useState<string>('')
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1)

    const fetchData = async () => {
        try {
            if (email) {
                const products = await getAllProducts(email);
                const transactions = await getTransactions(email)
                if (products) {
                    setProducts(products);
                }
                if (transactions) {
                    setTransactions(transactions);
                }
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        };
    }

    useEffect(() => {
        if (email) {
            fetchData();
        }
    }, [email]);

    useEffect(() => {
        let filtered = transactions;
        if (selectedProduct) {
            filtered = filtered.filter((transaction) => transaction.productId === selectedProduct.id)
        }
        if (startDate) {
            filtered = filtered.filter((transaction) => new Date(transaction.createdAt) >= new Date(startDate))
        }
        if (endDate) {
            filtered = filtered.filter((transaction) => new Date(transaction.createdAt) <= new Date(endDate))
        }
        setFilteredTransactions(filtered);
        setCurrentPage(1);

    }, [selectedProduct, startDate, endDate, transactions]);

    const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const currentTransactions = filteredTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE)


    return (
        <Wrapper>
            <div className='flex justify-between items-center flex-wrap gap-4 p-12 px-40'>
                <div className='flex md:justify-between w-full mb-4 space-x-2 md:space-x-0 mt-4'>
                    <div>
                        <select
                            className='select select-bordered md:w-64'
                            value={selectedProduct?.id || ''}
                            onChange={(e) => {
                                const product = products.find((product) => product.id == e.target.value) || null
                                setSelectedProduct(product)
                            }}
                        >
                            <option value=''>All products</option>
                            {products.map((product) => (
                                <option value={product.id} key={product.id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className='flex items-center space-x-2' >
                        <input
                            type="text"
                            placeholder='Start date'
                            className='input input-bordered'
                            value={startDate}
                            onFocus={(e) => e.target.type = "date"}
                            onBlur={(e) => {
                                if (!e.target.value) {
                                    e.target.type = "text"
                                }
                            }}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder='End date'
                            className='input input-bordered'
                            value={endDate}
                            onFocus={(e) => e.target.type = "date"}
                            onBlur={(e) => {
                                if (!e.target.value) {
                                    e.target.type = "text"
                                }
                            }}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                        <button
                            className='btn btn-primary text-white'
                            onClick={() => {
                                setSelectedProduct(null);
                                setStartDate('');
                                setEndDate('');
                            }}
                        >
                            <RotateCcw className='h-4 w-4' />
                        </button>
                    </div>
                </div>
                {transactions.length == 0 ? (
                    <EmptyState message='No transactions for the moment.' IconComponent='CaptionsOff' />
                ) : (
                    <div className='space-y-4 w-full'>
                        {currentTransactions.map((transaction) => (
                            <TransactionComponent key={transaction.id} transaction={transaction} />
                        ))}
                    </div>
                )}
                {filteredTransactions.length > ITEMS_PER_PAGE && (
                    <div className="join">
                        <button className="join-item btn" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>«</button>
                        <button className="join-item btn">Page {currentPage}</button>
                        <button className="join-item btn" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>»</button>
                    </div>
                )}
            </div>
        </Wrapper>
    )
}

export default Page
