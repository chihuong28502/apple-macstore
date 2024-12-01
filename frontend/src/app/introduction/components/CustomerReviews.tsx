'use client'
import { Avatar, Rate } from 'antd'

const reviews = [
  {
    name: 'John Doe',
    avatar: '/images/avatar1.jpg',
    rating: 5,
    comment: 'The MacBook Pro has completely transformed my workflow. It\'s incredibly fast and efficient!'
  },
  {
    name: 'Jane Smith',
    avatar: '/images/avatar2.jpg',
    rating: 4,
    comment: 'I love my new iMac! The display is stunning and it handles all my design work with ease.'
  },
  {
    name: 'Mike Johnson',
    avatar: '/images/avatar3.jpg',
    rating: 5,
    comment: 'As a developer, the MacBook Pro is a game-changer. The battery life is amazing!'
  }
]

export default function CustomerReviews() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <Avatar src={review.avatar} size={64} />
                <div className="ml-4">
                  <h3 className="font-bold">{review.name}</h3>
                  <Rate disabled defaultValue={review.rating} />
                </div>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

