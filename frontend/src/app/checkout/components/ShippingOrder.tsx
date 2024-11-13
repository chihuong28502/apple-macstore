"use client"

function ShippingOrder({ customerShipping, selectedShipping }: any) {
  return (
    <div>
      <h2 className="text-xl font-bold text-fontColor">Địa chỉ giao hàng</h2>
      <div className="grid sm:grid-cols-1 gap-4 mt-4">
        {customerShipping
          .filter((shipping: any) => shipping._id === selectedShipping) // Lọc danh sách theo selectedShipping
          .map((shipping: any) => (
            <div
              key={shipping._id}
              className="border-2 border-gray-200  rounded-md p-3 cursor-pointer bg-mainContent"
            >
              <h3 className="text-lg font-bold text-fontColor">
                {shipping.firstName} {shipping.lastName}
              </h3>
              <p className="text-xl text-fontColor">Số điện thoại: {shipping.phoneNumber}</p>
              <p className="text-xl text-fontColor">Thành phố: {shipping.city}</p>
              <p className="text-xl text-fontColor">Địa chỉ: {shipping.address}</p>
            </div>
          ))}
      </div>
    </div>
  )
}

export default ShippingOrder