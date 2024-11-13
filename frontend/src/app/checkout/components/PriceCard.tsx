'use client'

function PriceCard({ price }: any) {
  return (
    <> <div className="lg:absolute shadow-2xl lg:left-0 lg:bottom-0 bg-mainContent w-full p-4 rounded-md">
      <h4 className="flex flex-wrap gap-4 text-base text-fontColor font-bold">
        Total Price: <span className="ml-auto">{price?.selectedTotal.toLocaleString()}</span>
      </h4>
      <h4 className="flex flex-wrap gap-4 text-base text-fontColor font-bold">
        Tax (10%): <span className="ml-auto">{price?.taxAmount.toLocaleString()}</span>
      </h4>
      <h4 className="flex flex-wrap gap-4 text-base text-fontColor font-bold">
        Grand Total: <span className="ml-auto">{(price?.selectedTotal + price?.taxAmount).toLocaleString()}</span>
      </h4>
    </div></>
  )
}

export default PriceCard