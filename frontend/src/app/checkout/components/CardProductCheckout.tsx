'use client'


function CardProductCheckout({ item }: any) {
  return (
    <div><div
      className="border-2 cursor-pointer hover:scale-[1.02] flex flex-col gap-2 shadow-lg transition-shadow duration-300 ease-in-out rounded-lg"
      key={item?.variantId}
    >
      <div className="py-2 px-3 shrink-0 bg-mainContent rounded-lg flex justify-between">
        <div className='mr-2'>
            <h3 className="text-base text-fontColor font-bold text-nowrap">
              {item?.productName}
            </h3>
            <img
              loading="lazy"
              width={140}
              height={140}
              alt={item?.productImages[0]._id}
              src={item?.productImages[0].image}
              className="object-contain rounded-lg"
            />
          <p className="flex gap-2">
            Color: <span className="">{item?.color}</span>
          </p>
        </div>
        <ul className="text-sm text-fontColor space-y-2 mt-2">
          <li className="flex gap-2">
            RAM: <span className="ml-auto">{item?.ram} GB</span>
          </li>
          <li className="flex gap-2">
            SSD: <span className="ml-auto">{item?.ssd} GB</span>
          </li>
          <li className="flex gap-2">
            Quantity: <span className="ml-auto">{item?.quantity}</span>
          </li>
          <li className="flex gap-2">
            Price: <span className="ml-auto">{item?.price.toLocaleString()}</span>
          </li>
          <li className="flex gap-2">
            Total: <span className="ml-auto">{(item?.price * item?.quantity).toLocaleString()}</span>
          </li>
        </ul>
      </div>
    </div></div>
  )
}

export default CardProductCheckout