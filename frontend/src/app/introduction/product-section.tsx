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
    ? 'text-[#fff]'
    : 'text-[#fff]'

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

      <div className="flex items-center justify-center gap-4">
        <Link href="#" className={`${linkColor} bg-slate-400 px-4 py-2 rounded-3xl text-xl  leading-[1.381] font-thin hover:opacity-75`}>
          Tìm hiểu thêm
        </Link>
        <Link href="#" className={`border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-1 rounded-3xl  text-xl  leading-[1.381] font-thin`}>
          Mua
        </Link>
      </div>
    </section>
  )
}

