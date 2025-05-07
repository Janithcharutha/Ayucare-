import { Suspense } from "react"
import { notFound } from "next/navigation"
import LoadingSpinner from "@/components/loading-spinner"
import ProductGrid from "@/components/product-grid"
import type { Product, Category } from "@/lib/types"
import CategoryHeader from "@/components/category-header"

async function getCategoryData(slug: string): Promise<Category | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories?slug=${slug}`)
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/category?category=${categoryId}`,
      {
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
  params
}: {
  params: { category: string }
}) {
  const categoryData = await getCategoryData(params.category)
  if (!categoryData) notFound()

  const products = await getCategoryProducts(categoryData._id.toString())

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="container mx-auto py-8">
        <CategoryHeader
          title={categoryData.name}
          description=            {categoryData.description}
          category={categoryData}
          subcategories={categoryData.subcategories}
          currentSubcategory={null}
        />
        <ProductGrid products={products} />
      </div>
    </Suspense>
  )
}
