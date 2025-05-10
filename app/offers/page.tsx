"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface OfferProduct {
  _id: string
  name: string
  slug: string
  category: string
  categoryName: string
  image: string[]
  originalPrice: number
  discountedPrice: number
  description: string
  contents?: string[]
  discountPercentage: number
}

export default function OffersPage() {
  const [offerProducts, setOfferProducts] = useState<OfferProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch('/api/offers')
        if (!response.ok) throw new Error('Failed to fetch offers')
        const data = await response.json()
        setOfferProducts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch offers')
      } finally {
        setLoading(false)
      }
    }

    fetchOffers()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <div className="animate-pulse">Loading offers...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="text-blue-600 hover:underline"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-gray-800">
          HOME
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-gray-800">OFFERS</span>
      </div>

      <h1 className="font-playfair text-4xl mb-8 text-center">Special Offers</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {offerProducts.map((product) => (
          <div 
            key={product._id} 
            className="group bg-white rounded-lg shadow-md overflow-hidden"
          >
            {/* Offer badge */}
            <div className="absolute top-4 left-4 z-10 bg-black text-white rounded-full px-4 py-1 text-sm font-medium">
              {product.discountPercentage}% OFF
            </div>

            {/* Product image - Fixed aspect ratio container */}
            <div className="relative aspect-square bg-[#f5f0e8]">
              <Link href={`/offers/${product.slug}`}>
                <Image
                  src={product.image[0] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                  priority={false}
                  sizes="(max-width: 640px) 100vw, 
                         (max-width: 768px) 50vw,
                         (max-width: 1024px) 33vw,
                         25vw"
                />
              </Link>
            </div>

            {/* Product details */}
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">{product.categoryName}</p>
              <h3 className="font-playfair text-lg mb-2 line-clamp-2 min-h-[3.5rem]">
                <Link href={`/offers/${product.slug}`} className="hover:text-gray-600">
                  {product.name}
                </Link>
              </h3>

              <div className="flex justify-center items-center gap-2">
                <span className="text-gray-500 line-through text-sm">
                  Rs.{product.originalPrice.toLocaleString()}
                </span>
                <span className="font-semibold text-lg text-[#c9a77c]">
                  Rs.{product.discountedPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
