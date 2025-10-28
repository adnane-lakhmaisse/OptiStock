import React from 'react'

import NavBar from './NavBar'
import { ToastContainer } from 'react-toastify'

type WrapperProps = {
  children: React.ReactNode
}

export default function Wrapper({ children }: WrapperProps) {
  return (
    <div className='px-5 md-px:[10%] mt-8 mb-10'>
      <NavBar />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={true}
        draggable={true}
        pauseOnHover={true}
        theme="light"
      />

      {children}
    </div>
  )
}
