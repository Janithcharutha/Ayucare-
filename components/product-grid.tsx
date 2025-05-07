"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface Product {
  _id: string
  name: string
  slug: string
  description: string
  price: number
  images: string[]
  category: string
  categoryName: string
  subcategory: string
  subcategoryName: string
  stock: number
  featured: boolean
  status: string
}

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-medium mb-4">No products found</h2>
        <p className="text-gray-600 mb-8">Try a different category or check back later.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((product) => (
        <div key={product._id} className="group">
          <Link href={`/products/${product.category}/${product.subcategory}/${product.slug}`}>
            <div className="mb-4 overflow-hidden rounded-lg">
              <Image
                src={product.images[0] || `/placeholder.svg?height=300&width=300&text=${product.name}`}
                alt={product.name}
                width={300}
                height={300}
                className="w-full h-[300px] object-cover transition-transform duration-500 group-hover:scale-110"
                priority={false}
              />
            </div>
          </Link>
          <h3 className="font-playfair text-xl mb-1">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{product.subcategoryName}</p>
          <p className="text-gray-700 mb-3">Rs. {product.price.toLocaleString()}</p>
          <Button className="w-full">Add to Cart</Button>
        </div>
      ))}
    </div>
  )
}
