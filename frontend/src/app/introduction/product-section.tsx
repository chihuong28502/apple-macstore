import Link from 'next/link'
import Image from 'next/image'

interface ProductSectionProps {
  title: string
  subtitle?: string
  logo?: string
  background: string
  textColor?: 'dark' | 'light'
  className?: string
}

export function ProductSection({ 
  title, 
  subtitle,
  logo,
  background,
  textColor = 'dark',
  className = ''
}: ProductSectionProps) {
  const textColorClasses = textColor === 'dark' 
    ? 'text-[#1d1d1f]' 
    : 'text-white'

  const linkColor = textColor === 'dark' 
    ? 'text-[#06c]' 
    : 'text-[#2997ff]'

  return (
    <section 
      className={`min-h-[624px] rounded-xl flex flex-col items-center justify-end pb-[52px] ${className}`}
      style={{
        background: `url(${background}) center top no-repeat`,
        backgroundSize: 'cover'
      }}
    >
      {logo ? (
        <Image
          src={logo}
          alt={title}
          width={198}
          height={69}
          className="mb-[11px]"
        />
      ) : (
        <h2 className={`text-[56px] leading-[1.07143] font-semibold tracking-[-0.005em] ${textColorClasses} mb-[6px]`}>
          {title}
        </h2>
      )}
      
      {subtitle && (
        <p className={`text-[28px] leading-[1.10722] font-normal ${textColorClasses} mb-[13px]`}>
          {subtitle}
        </p>
      )}
      
      <div className="flex items-center justify-center gap-[35px]">
        <Link href="#" className={`${linkColor} text-[21px] leading-[1.381] font-normal hover:underline`}>
          Tìm hiểu thêm
          <span className="ml-[0.15em]">{'>'}</span>
        </Link>
        <Link href="#" className={`${linkColor} text-[21px] leading-[1.381] font-normal hover:underline`}>
          Mua
          <span className="ml-[0.15em]">{'>'}</span>
        </Link>
      </div>
    </section>
  )
}

