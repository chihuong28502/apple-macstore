export default function ProductLayout({ children }: { children: React.ReactNode }) {
  
  
  return (
    <div>
      <header className="p-4 bg-gray-800 text-white">
        <h1>Product Section</h1>
      </header>
      <main>{children}</main>
    </div>
  );
}
