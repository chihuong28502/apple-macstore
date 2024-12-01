import { Button } from 'antd'

export default function CallToAction() {
  return (
    <section className="py-16 bg-blue-600 text-fontColor">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Experience the Power of Mac?</h2>
        <p className="text-xl mb-8">Get your MacBook or iMac today and transform the way you work and create.</p>
        <Button type="primary" size="large" className="bg-white text-blue-600 border-white hover:bg-gray-100 hover:border-gray-100">
          Shop Now
        </Button>
      </div>
    </section>
  )
}

