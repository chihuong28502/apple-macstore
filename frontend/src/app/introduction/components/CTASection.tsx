'use client'

import { motion } from 'framer-motion'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { Button } from 'antd'

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-purple-900 to-indigo-900">
      <div
        // style={{
        //   backgroundImage: 'url(https://www.apple.com/v/home/bv/images/promos/macbook-pro/promo_macbookpro_announce__gdf98j6tj2ie_large.jpg)',
        //   backgroundSize: 'cover',
        //   backgroundPosition: 'center',
        //   height: '400px',
        //   borderRadius: '10px',
        //   marginBottom: '20px',
        //   boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
        //   overflow: 'hidden',
        //   filter: 'grayscale(100%)',
        // }}
        className="container mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-8"
        >
          Ready to Elevate Your Experience?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl mb-12"
        >
          Join millions of satisfied Apple users and transform the way you work and create.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button
            type="primary"
            size="large"
            icon={<ShoppingCartOutlined />}
            className="bg-white text-purple-900 hover:bg-gray-200 hover:text-purple-800 border-none px-8 py-3 text-lg font-semibold rounded-full"
          >
            Shop Now
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

