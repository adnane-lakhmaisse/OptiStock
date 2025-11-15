import { Transaction } from '@/type'
import React from 'react'
import ProductImage from './ProductImage';

const TransactionComponent = ({ transaction }: { transaction: Transaction }) => {
    const formattedDate = new Date(transaction.createdAt).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
    return (
        <div className='p-4 border-2 border-base-200 flex items-center rounded-3xl w-full'>
            <div className=''>
                {transaction.imageUrl && (
                    <ProductImage
                        src={transaction.imageUrl}
                        alt={transaction.imageUrl}
                        heightClass="h-12"
                        widthClass='w-12'
                    />
                )}
            </div>
            <div className='w-full flex items-center ml-4 justify-between' >
                <div className='' >
                    <p className='font-semibold' >{transaction.productName}</p>
                    <div className='badge badge-soft badge-primary mt-2'>{transaction.categoryName}</div>
                </div>
                <div className='flex flex-end flex-col' >
                    <div className='text-right' >
                        <div>{transaction.type == "IN" ? (
                            <div>
                                <span className='text-purple-700 font-bold text-xl capitalize' >
                                    +{transaction.quantity} {transaction.unit}
                                </span>
                            </div>
                        ) : (
                            <div>
                                <span className='text-pink-600 font-bold text-xl capitalize' >
                                    -{transaction.quantity} {transaction.unit}
                                </span>
                            </div>
                        )}
                        </div>
                        <div className='text-xs '>{formattedDate}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TransactionComponent
