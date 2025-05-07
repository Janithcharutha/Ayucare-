"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getProductsBySubcategory } from "@/lib/products"
import type { Product } from "@/lib/products"

interface RelatedProductsProps {
  category: string
  subcategory: string
  currentProductId: string // Changed from number to string to match MongoDB _id
}

export default function RelatedProducts({ category, subcategory, currentProductId }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  // Number of products to show at different screen sizes
  const itemsToShow = {
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
  }

  // Get the number of items to show based on screen width
  const [visibleItems, setVisibleItems] = useState(itemsToShow.md)

  useEffect(() => {
    // Get all products from the same subcategory
    const subcategoryProducts = getProductsBySubcategory(category, subcategory)

    // Filter out the current product
    const filteredProducts = subcategoryProducts.filter((product) => product.id !== currentProductId)

    setProducts(filteredProducts)

    // Set the number of visible items based on screen size
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) {
        setVisibleItems(itemsToShow.sm)
      } else if (width < 768) {
        setVisibleItems(itemsToShow.md)
      } else if (width < 1024) {
        setVisibleItems(itemsToShow.lg)
      } else {
        setVisibleItems(itemsToShow.xl)
      }
    }

    // Initial call
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [category, subcategory, currentProductId])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + visibleItems >= products.length ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? Math.max(0, products.length - visibleItems) : prevIndex - 1))
  }

  // If no related products, don't render anything
  if (products.length === 0) {
    return null
  }

  return (
    <div className="relative">
      {/* Navigation buttons */}
      {products.length > visibleItems && (
        <>
          <button
            onClick={prevSlide}
            className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white border rounded-full p-2 shadow-md z-10"
            aria-label="Previous products"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white border rounded-full p-2 shadow-md z-10"
            aria-label="Next products"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Products carousel */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / visibleItems)}%)` }}
        >
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0" style={{ width: `${100 / visibleItems}%` }}>
              <div className="p-2">
                <Link href={`/products/${product.category}/${product.subcategory}/${product.slug}`}>
                  <div className="mb-4 overflow-hidden rounded-lg">
                    <Image
                      src={product.image || `/placeholder.svg?height=300&width=300&text=${product.name}`}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-[300px] object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                </Link>
                <h3 className="font-playfair text-lg mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.size}</p>
                <p className="text-gray-700 mb-3">Rs. {product.price.toLocaleString()}</p>
                <Button className="w-full bg-[#c9a77c] hover:bg-[#b89669]">Add to Cart</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
