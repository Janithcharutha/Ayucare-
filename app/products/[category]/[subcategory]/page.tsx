import { Suspense } from "react"
import { notFound } from "next/navigation"
import CategoryHeader from "@/components/category-header"
import ProductGrid from "@/components/product-grid"
import LoadingSpinner from "@/components/loading-spinner"
import type { Category, Product } from "@/lib/types"

async function getCategoryData(slug: string): Promise<Category | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories?slug=${slug}`, {
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

async function getSubcategoryProducts(categoryId: string, subcategoryId: string): Promise<Product[]> {
  try {
    const queryParams = new URLSearchParams({
      categoryId,
      subcategoryId
    }).toString()
    
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/subcategory?${queryParams}`,
      { cache: 'no-store' }
    )

    if (!res.ok) {
      console.error('Failed to fetch products:', await res.text())
      return []
    }
    return res.json()
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export default async function SubcategoryPage({
  params,
}: {
  params: { category: string; subcategory: string }
}) {
  const categoryData = await getCategoryData(params.category)
  if (!categoryData) notFound()

  const currentSubcategory = categoryData.subcategories.find(
    sub => sub.slug === params.subcategory
  )
  if (!currentSubcategory) notFound()

  const products = await getSubcategoryProducts(
    categoryData._id.toString(),
    currentSubcategory._id.toString()
  )

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="container mx-auto py-8">
        <CategoryHeader 
          category={categoryData}
          subcategories={categoryData.subcategories}
          currentSubcategory={params.subcategory}
        />
        <ProductGrid products={products} />
      </div>
    </Suspense>
  )
}