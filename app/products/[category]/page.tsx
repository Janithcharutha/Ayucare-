import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import CategoryHeader from '@/components/category-header'
import ProductGrid from '@/components/product-grid'
import LoadingSpinner from '@/components/loading-spinner'
import type { Category, Product } from "@/lib/types"

async function getCategoryData(slug: string): Promise<Category | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories?slug=${slug}`, {
      cache: 'force-cache',
      next: { revalidate: 3600 }
    })
    if (!res.ok) return null
    const data = await res.json()
    return data[0] || null
  } catch (error) {
    console.error('Error fetching category:', error)
    return null
  }
}

async function getCategoryProducts(categoryId: string): Promise<Product[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products?category=${categoryId}`,
      {
        cache: 'force-cache',
        next: { revalidate: 3600 }
      }
    )
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export default async function CategoryPage({
  params,
}: {
  params: { category: string }
}) {
  // Ensure params.category is awaited
  const categorySlug = await Promise.resolve(params.category)
  const categoryData = await getCategoryData(categorySlug)

  if (!categoryData) {
    notFound()
  }

  const categoryId = categoryData._id.toString()
  const products = await getCategoryProducts(categoryId)

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="container mx-auto py-8">
        <CategoryHeader
          title={categoryData.name}
          description={categoryData.description}
          category={categoryData}
          subcategories={categoryData.subcategories}
          currentSubcategory={null}
        />
        <ProductGrid products={products} />
      </div>
    </Suspense>
  )
}

// Add loading UI
export function Loading() {
  return <LoadingSpinner />
}

// Add not found UI
export function NotFound() {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center">
        <h1 className="text-2xl font-medium mb-4">Category not found</h1>
        <p className="text-gray-500">The category you're looking for doesn't exist.</p>
      </div>
    </div>
  )
}
