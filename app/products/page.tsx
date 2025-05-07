import { Suspense } from "react"
import { Metadata } from "next"
import ProductGrid from "@/components/product-grid"
import LoadingSpinner from "@/components/loading-spinner"
import type { Product } from "@/lib/types"

export const metadata: Metadata = {
  title: "All Products - Aroma Bliss",
  description: "Browse our complete collection of natural and organic products."
}

async function getAllProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
      cache: 'force-cache',
      next: { revalidate: 3600 }
    })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export default async function ProductsPage() {
  const products = await getAllProducts()

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="container mx-auto py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair font-medium mb-4">All Products</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our complete collection of natural and organic products designed to enhance your well-being.
          </p>
        </div>
        <ProductGrid products={products} />
      </div>
    </Suspense>
  )
}