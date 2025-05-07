import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { Category, Subcategory } from "@/lib/types"

interface CategoryHeaderProps {
  title?: string
  description?: string
  category: Category
  subcategories: Subcategory[]
  currentSubcategory: string | null
}

export default function CategoryHeader({
  category,
  subcategories,
  currentSubcategory,
}: CategoryHeaderProps) {
  const title = category.title || category.name // Use name as fallback
  const description = category.description

  return (
    <div className="mb-12">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/products" className="hover:text-gray-800">
          Products
        </Link>
        {category && (
          <>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link href={`/products/${category.slug}`} className="hover:text-gray-800">
              {category.title || category.name}
            </Link>
          </>
        )}
        {currentSubcategory && (
          <>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-800">{title}</span>
          </>
        )}
      </div>

      {/* Centered Header with Title, Image, and Description */}
      <div className="text-center mb-12">
        <h1 className="font-playfair text-4xl mb-6">{title}</h1>

        {category.image && (
          <div className="mx-auto max-w-4xl mb-6 rounded-lg overflow-hidden">
            <div className="relative aspect-[16/9]">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        )}

        {description && (
          <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
        )}
      </div>

      {/* Subcategory navigation */}
      {subcategories && subcategories.length > 0 && (
        <>
          <div className="flex flex-wrap gap-3 justify-left mt-6">
            {category && (
              <Link href={`/products/${category.slug}`}>
                <Button variant={!currentSubcategory ? "default" : "outline"} className="rounded-full">
                  All {category.title || category.name}
                </Button>
              </Link>
            )}
            {subcategories.map((subcategory) => (
              <Link key={subcategory.slug} href={`/products/${category?.slug || ""}/${subcategory.slug}`}>
                <Button
                  variant={currentSubcategory === subcategory.slug ? "default" : "outline"}
                  className="rounded-full"
                >
                  {subcategory.title || subcategory.name}
                </Button>
              </Link>
            ))}
          </div>
          <Separator className="my-8" />
        </>
      )}
    </div>
  )
}
