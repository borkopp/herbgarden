'use client'

import { ProductGridItem } from '@/components/ProductGridItem'
import type { Product } from '@/payload-types'
import { motion, type Variants } from 'framer-motion'
import React from 'react'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1] 
    } 
  },
}

type Props = {
  products: Partial<Product>[]
}

export const ShopPageClient: React.FC<Props> = ({ products }) => {
  return (
    <div className="min-h-screen bg-white pt-12 pb-32">
      {/* Hero Section */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 md:mb-32"
      >
        <motion.span 
          variants={itemVariants}
          className="text-[9px] font-bold tracking-[0.2em] uppercase text-black/40 mb-6 block"
        >
          SENSORY ENHANCEMENT LABORATORY
        </motion.span>
        
        <motion.h1 
          variants={itemVariants}
          className="font-display text-5xl md:text-7xl lg:text-[7rem] leading-[0.85] tracking-tighter text-black uppercase"
        >
          THE BOTANIC<br />
          <span className="text-transparent" style={{ WebkitTextStroke: '2px #e5e5e5' }}>COLLECTION</span>
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="mt-8 text-black/60 text-xs md:text-sm leading-relaxed max-w-lg font-medium"
        >
          Explore our highly concentrated botanical essences, derived from organic sources. Designed for precision flavoring with a sharp, refreshing finish that lingers.
        </motion.p>
      </motion.div>

      {/* Products Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {products?.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col items-start justify-center py-24 border-t border-black/5"
          >
            <h3 className="text-xl font-display uppercase tracking-widest text-black mb-4">No Extracts Available</h3>
            <p className="text-black/60 text-sm font-medium max-w-sm">
              Our laboratory is currently preparing the next batch of pure botanical essences. Check back soon.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 border-t border-black/5 pt-16"
          >
            {products.map((product) => {
              return (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductGridItem product={product} />
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </div>
  )
}
