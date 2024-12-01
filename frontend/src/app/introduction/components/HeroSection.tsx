import Image from 'next/image'
import { Button } from 'antd'

export default function HeroSection() {
  return (
    <section
      style={{
        backgroundImage: 'url(https://www.apple.com/v/home/bv/images/heroes/holiday-2024/hero_holiday_2024_startframe__kdegyfjrojm2_mediumtall.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat:'no-repeat',
        borderRadius: '10px',
        marginBottom: '20px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
        filter: 'grayscale(100%)',
      }}
      className="relative h-[100vh] w-full flex items-center justify-center overflow-hidden bg-[f5f5f5]">
      <div className="absolute z-10 text-center text-fontColor  bottom-3">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">Discover the Power of Mac</h1>
        <p className="text-xl mb-6">Unleash your creativity with our latest MacBook and iMac</p>
        <Button type="primary" size="large" className="bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600">
          Shop Now
        </Button>
      </div>
    </section>
  )
}

