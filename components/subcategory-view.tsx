"use client"

import Link from 'next/link'
import ProductGrid from "@/components/product-grid"
import CategoryHeader from "@/components/category-header"
import type { Category, Product } from "@/lib/types"

interface SubcategoryViewProps {
  categoryData: Category
  currentSubcategory: Category['subcategories'][0]
  products: Product[]
}

export default function SubcategoryView({
  categoryData,
  currentSubcategory,
  products
}: SubcategoryViewProps) {
  return (
    <>
      <CategoryHeader
        title={currentSubcategory.name}
        description={currentSubcategory.description}
        category={categoryData}
        subcategories={categoryData.subcategories}
        currentSubcategory={currentSubcategory.slug}
      />
      <ProductGrid products={products} />
    </>
  )
}