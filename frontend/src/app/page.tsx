import HeroSection from './components/HeroSection'
import FeaturedProducts from './components/FeaturedProducts'
import ProductFeatures from './components/ProductFeatures'
import CustomerReviews from './components/CustomerReviews'
import CallToAction from './components/CallToAction'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-fontColor">
      <HeroSection />
      <FeaturedProducts />
      <ProductFeatures />
      <CustomerReviews />
      <CallToAction />
    </main>
  )
}

