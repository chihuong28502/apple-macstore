'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const products = [
  {
    name: 'MacBook Pro',
    description: 'Một tuyệt tác của trí tuệ.',
    image: 'https://www.apple.com/v/home/bv/images/promos/macbook-pro/promo_macbookpro_announce__gdf98j6tj2ie_large.jpg',
    background: 'bg-black',
    textColor: 'text-white'
  },
  {
    name: 'Mac mini',
    description: 'Xuống cỡ. Lên trình.',
    image: 'https://www.apple.com/v/home/bv/images/promos/mac-mini/promo_macmini_announce__bwha5fjvaioi_large.jpg',
    background: 'bg-white',
    textColor: 'text-black'
  },
  {
    name: 'iPad air',
    description: 'Hai kích cỡ. Chip nhanh hơn. Đa zi năng.',
    image: 'https://www.apple.com/v/home/bv/images/promos/ipad-air/promo_ipadair_ai__3fv1eitzqv6y_large.jpg',
    background: 'bg-black',
    textColor: 'text-black'
  },
  {
    name: 'WATCH SERIES 10',
    description: 'Mỏng hơn. Mãi đỉnh.',
    image: 'https://www.apple.com/v/home/bv/images/promos/apple-watch-series-10/promo_apple_watch_series_10_avail_lte__c70y29goir42_large.jpg',
    background: 'bg-black',
    textColor: 'text-black'
  }
]

export function ProductGrid() {
  const route = useRouter()
  return (
    <Link href={`/product`} className="grid grid-cols-1 md:grid-cols-2 gap-3 px-3 py-3 hover:cursor-pointer">
      {products.map((product) => (
        <div
          key={product.name}
          className={`${product.background} ${product.textColor} hover:scale-[1.02] shadow-2xl py-40 flex flex-col items-center justify-between text-center rounded-3xl relative`}
          style={{
            backgroundImage: `url(${product.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'transform 0.3s ease-in-out', 
          }}
        >
          <div className="absolute top-3 z-10">
            <h3 className="text-xl font-semibold my-1">{product.name}</h3>
            <p className="text-sm my-1">{product.description}</p>
          </div>
        </div>
      ))}
    </Link>

  )
}
