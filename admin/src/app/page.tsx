import Link from 'next/link'

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