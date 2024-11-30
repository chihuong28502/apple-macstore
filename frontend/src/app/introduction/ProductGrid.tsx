import Link from 'next/link'
import Image from 'next/image'

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
    name: 'iMac',
    description: 'Sáng sáng.',
    image: 'https://www.apple.com/v/home/bv/images/promos/ipad-air/promo_ipadair_ai__3fv1eitzqv6y_large.jpg',
    background: 'bg-white',
    textColor: 'text-black'
  },
  {
    name: 'iPad air',
    description: 'Hai kích cỡ. Chip nhanh hơn. Đa zi năng.',
    image: 'https://www.apple.com/v/home/bv/images/promos/ipad-air/promo_ipadair_ai__3fv1eitzqv6y_large.jpg',
    background: 'bg-black',
    textColor: 'text-white'
  },
  {
    name: 'WATCH SERIES 10',
    description: 'Mỏng hơn. Mãi đỉnh.',
    image: 'https://www.apple.com/v/home/bv/images/promos/apple-watch-series-10/promo_apple_watch_series_10_avail_lte__c70y29goir42_large.jpg',
    background: 'bg-black',
    textColor: 'text-white'
  },
  {
    name: 'AirPods Pro',
    description: 'Nay với tính năng Chủ Động Khử Tiếng Ồn.',
    image: 'https://www.apple.com/v/home/bv/images/promos/apple-watch-series-10/promo_apple_watch_series_10_avail_lte__c70y29goir42_large.jpg',
    background: 'bg-white',
    textColor: 'text-black'
  }
]

export function ProductGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-3 py-3">
      {products.map((product) => (
        <div key={product.name} className={`${product.background} ${product.textColor} p-12 flex flex-col items-center justify-end text-center rounded-3xl`}>
          <h3 className="text-4xl font-semibold mb-2">{product.name}</h3>
          <p className="text-xl mb-4">{product.description}</p>
          <div className="flex space-x-4 mb-6">
            <Link href="#" className="text-[#2997ff] text-xl hover:underline">
              Tìm hiểu thêm
              <span className="ml-1">{'>'}</span>
            </Link>
            <Link href="#" className="text-[#2997ff] text-xl hover:underline">
              Mua
              <span className="ml-1">{'>'}</span>
            </Link>
          </div>
          <Image src={product.image} alt={product.name} width={400} height={300} className="w-full h-auto" />
        </div>
      ))}
    </div>
  )
}

