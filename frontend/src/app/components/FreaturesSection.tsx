'use client'

import { motion } from 'framer-motion'
import { CheckCircleOutlined } from '@ant-design/icons'

const features = [
  'Powerful Performance',
  'Stunning Retina Display',
  'All-Day Battery Life',
  'Seamless Integration',
  'Advanced Security',
  'Professional-Grade Apps',
]

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">Why Choose Apple</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-800 rounded-lg p-6 shadow-lg"
            >
              <CheckCircleOutlined className="text-green-500 text-2xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature}</h3>
              <p className="text-gray-400">Experience the best-in-class technology with Apple.</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

