'use client'

import { Carousel } from 'antd'
import { motion } from 'framer-motion'
import Image from 'next/image'

const products = [
  { name: 'MacBook Pro', image: '/macbook-pro.jpg', description: 'Supercharged for pros.' },
  { name: 'iMac', image: '/imac.jpg', description: 'Packed with power, designed for simplicity.' },
  { name: 'MacBook Air', image: '/macbook-air.jpg', description: 'Light. Speed.' },
]

export default function ProductShowcase() {
  return (
    <section className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">Our Products</h2>
        <Carousel autoplay>
          {products.map((product, index) => (
            <div key={index} className="px-4">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-gray-900 rounded-lg overflow-hidden shadow-xl"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={600}
                  height={400}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-400">{product.description}</p>
                </div>
              </motion.div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  )
}

