import React from 'react'


export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container my-16 pb-4">
      {children}
    </div>
  )
}
