'use client'
import { Card } from 'antd'

const { Meta } = Card

const products = [
  {
    name: 'MacBook Pro',
    image: 'https://www.apple.com/v/home/bv/images/promos/macbook-pro/promo_macbookpro_announce__gdf98j6tj2ie_large.jpg',
    description: 'Supercharged for pros.',
    price: '$1,999'
  },
  {
    name: 'iMac',
    image: 'https://www.apple.com/v/home/bv/images/promos/macbook-pro/promo_macbookpro_announce__gdf98j6tj2ie_large.jpg',
    description: 'Say hello to the new iMac.',
    price: '$1,299'
  }
]

export default function FeaturedProducts() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((product, index) => (
            <Card
              key={index}
              hoverable
              cover={<img className='object-cover' src={product.image} alt={product.name} width={600} height={400}  />}
              className="w-full"
            >
              <Meta title={product.name} description={product.description} />
              {/* <p className="mt-4 text-xl font-bold text-blue-500">{product.price}</p> */}
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

