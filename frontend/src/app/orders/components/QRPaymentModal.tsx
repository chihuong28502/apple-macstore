'use client'

import { Modal } from 'antd'
import Image from 'next/image'
import { useState, useEffect } from 'react'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  qrLink: string
}

interface BankInfo {
  accountNumber: string
  bankName: string
  amount: number
  description: string
}

export default function PaymentModal({ isOpen, onClose, qrLink }: PaymentModalProps) {
  const [copied, setCopied] = useState(false)
  const [bankInfo, setBankInfo] = useState<BankInfo | null>(null)

  useEffect(() => {
    if (qrLink) {
      const url = new URL(qrLink)
      const params = new URLSearchParams(url.search)
      setBankInfo({
        accountNumber: params.get('acc') || '',
        bankName: params.get('bank') || '',
        amount: parseFloat(params.get('amount') || '0'),
        description: decodeURIComponent(params.get('des') || '')
      })
    }
  }, [qrLink])

  const handleCopyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  if (!bankInfo) return null

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={480}
      className="rounded-2xl overflow-hidden"
      closeIcon={
        <button className="absolute right-4 top-4 text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      }
    >
      <div className="p-4">
        <div className="text-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800">Scan QR to Pay</h3>
          <p className="text-gray-500 mt-2">Please scan this QR code with your banking app</p>
        </div>

        <div className="bg-black p-8 rounded-xl flex justify-center items-center mb-6">
          <div className="relative w-64 h-64">
            <Image
              src={qrLink}
              alt="Payment QR Code"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="bg-gray-50 p-2 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Bank Account</span>
              <button
                onClick={() => handleCopyText(bankInfo.accountNumber)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-gray-800 font-medium">{bankInfo.accountNumber}</p>
            <p className="text-gray-500 text-sm mt-1">{bankInfo.bankName}</p>
          </div>

          <div className="bg-gray-50 p-2 rounded-lg">
            <span className="text-gray-600">Amount</span>
            <p className="text-gray-800 font-medium mt-1">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(bankInfo.amount)}
            </p>
          </div>

          <div className="bg-gray-50 p-2 rounded-lg">
            <span className="text-gray-600">Payment Reference</span>
            <p className="text-gray-800 font-medium mt-1">{bankInfo.description}</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Please ensure to include the payment reference when making the transfer
          </p>
        </div>
      </div>
    </Modal>
  )
}

