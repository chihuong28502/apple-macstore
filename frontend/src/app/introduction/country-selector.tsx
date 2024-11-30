'use client'

import { useState } from 'react'
import { Select, Button } from 'antd'
import { CloseOutlined, CheckOutlined } from '@ant-design/icons'

export function CountrySelector() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-[980px] mx-auto flex items-center justify-between py-3 px-4">
        <p className="text-[12px] leading-[1.33337] text-[#1d1d1f] font-normal max-w-[650px]">
          Choose another country or region to see content specific to your location and shop online.
        </p>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Select
              defaultValue="vietnam"
              style={{ width: 200 }}
              options={[
                { value: 'vietnam', label: 'Việt Nam' },
                { value: 'us', label: 'United States' },
              ]}
              suffixIcon={<CheckOutlined style={{ color: '#0066CC' }} />}
              className="text-[12px]"
            />
          </div>
          <Button 
            type="primary"
            className="h-8 px-4 bg-[#0071e3] hover:bg-[#0077ED] text-[12px] leading-[1.33337]"
          >
            Continue
          </Button>
          <Button
            type="text"
            icon={<CloseOutlined className="text-[#1d1d1f]" />}
            onClick={() => setIsVisible(false)}
            className="flex items-center justify-center w-8 h-8 hover:bg-[#f5f5f7]"
          />
        </div>
      </div>
    </div>
  )
}

