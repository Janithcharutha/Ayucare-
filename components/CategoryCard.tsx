import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Category } from "@/lib/types"

interface CategoryCardProps {
  category: Category
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <div className="flex-shrink-0 w-64 sm:w-72 relative overflow-hidden rounded-lg shadow-md group">
      {category.image && (
        <Image
          src={category.image}
          alt={category.name}
          width={288}
          height={288}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
        <h3 className="font-playfair text-white text-xl sm:text-2xl text-center px-2">
          {category.title || category.name}
        </h3>
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <Link href={`/products/${category.slug}`}>
          <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black text-sm">
            Shop Now
          </Button>
        </Link>
      </div>
    </div>
  )
}
