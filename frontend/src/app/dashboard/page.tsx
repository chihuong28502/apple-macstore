import MenuSidebarDashboard from '@/components/sidebars/MenuSidebarDashboard'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

function page() {
  
  return (
    <nav>
      <Link href="/dashboard">Dashboard Home</Link>
      <Link href="/dashboard/product">Products</Link>
      <Link href="/dashboard/category">Categories</Link>
      <Link href="/dashboard/user">Users</Link>
    </nav>
  )
}

export default page