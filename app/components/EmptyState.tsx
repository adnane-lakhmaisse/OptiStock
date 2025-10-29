import { icons } from 'lucide-react';
import React from 'react'

interface EmptyStateProps {
    message : string;
    IconComponent : keyof typeof icons;
}

export default function EmptyState({ message, IconComponent }: EmptyStateProps) {
  const Icon = icons[IconComponent];

  return (
    <div className='w-full h-full my-20 flex justify-center items-center flex-col'> 
      <div>
        <Icon strokeWidth={1} className='w-30 h-30 text-primary'/>
      </div>
      <p className='text-primary mt-4 text-sm'>
        {message}
      </p>
    </div>
  )
}
