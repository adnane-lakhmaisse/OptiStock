import React from 'react'
import { ToastContainer } from 'react-toastify/unstyled'
import NavBar from './NavBar'

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
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

      {children} 
    </div>
  )
}
