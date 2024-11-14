import Link from "next/link";

function Page() {
  return (
    <nav>
      <Link href=" ">Dashboard Home</Link>
      <Link href=" /product">Products</Link>
      <Link href=" /category">Categories</Link>
      <Link href=" /user">Users</Link>
    </nav>
  );
}

export default Page;
