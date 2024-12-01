import { CheckCircleOutlined } from '@ant-design/icons'

const features = [
  'Powerful M1 chip',
  'Stunning Retina display',
  'All-day battery life',
  'Sleek and lightweight design',
  'macOS Big Sur',
  'Secure and private'
]

export default function ProductFeatures() {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Mac?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <CheckCircleOutlined className="text-green-500 text-2xl mr-4" />
              <p className="text-lg my-0">{feature}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

