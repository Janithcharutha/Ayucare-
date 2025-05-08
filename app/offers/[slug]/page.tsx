"use client"

import { Suspense, use } from "react"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Minus, Plus, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Product {
  _id: string
  name: string
  slug: string
  description: string
  price: number
  images: string[]  // Changed from image to images to match DB
  category: string
  tags: string[]
  productCode: string
  size: string | null
  rating: number
  reviewCount: number
  items: {
    name: string
    description: string
  }[]
}

interface Offer {
  _id: string
  productId: string
  discountedPrice: number
  discountPercentage: number
  product: Product
}

function OfferContent({ slug }: { slug: string }) {
  const [quantity, setQuantity] = useState(1)
  const [offer, setOffer] = useState<Offer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getFirstImage = (images?: string[]): string => {
    if (!images || !Array.isArray(images) || images.length === 0) {
      return "/placeholder.svg"
    }
    // Add console.log to debug
    console.log('First image:', images[0])
    return images[0]
  }

  useEffect(() => {
    if (!slug) return

    const fetchOffer = async () => {
      try {
        // First fetch product by slug
        const productResponse = await fetch(`/api/products/by-slug/${slug}`)
        if (!productResponse.ok) throw new Error('Failed to fetch product')
        const product = await productResponse.json()

        // Then fetch offer using product ID
        const offerResponse = await fetch(`/api/offers/by-product/${product._id}`)
        if (!offerResponse.ok) throw new Error('Failed to fetch offer')
        const offerData = await offerResponse.json()

        setOffer(offerData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    fetchOffer()
  }, [slug])

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  if (loading) {
    return (
      <div className="container mx-auto py-12 flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-12">
        <h1 className="text-2xl font-bold">Error</h1>
        <p className="text-red-600">{error}</p>
        <Link href="/offers" className="text-blue-600 hover:underline">
          Return to offers
        </Link>
      </div>
    )
  }

  if (!offer || !offer.product) {
    return (
      <div className="container mx-auto py-12">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link href="/offers" className="text-blue-600 hover:underline">
          Return to offers
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-gray-800">
          HOME
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/offers" className="hover:text-gray-800">
          OFFERS
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-gray-800">{offer.product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="relative">
          {/* Offer badge */}
          <div className="absolute top-4 left-4 z-10 bg-black text-white rounded-full px-4 py-1 text-sm font-medium">
            {offer.discountPercentage}% OFF
          </div>

          <div className="bg-[#f5f0e8] rounded-lg overflow-hidden">
            <Image
              src={getFirstImage(offer.product.images)} // Changed from image to images
              alt={offer.product.name}
              width={600}
              height={600}
              className="w-full h-auto object-contain"
              priority
              unoptimized={process.env.NODE_ENV === 'development'}
            />
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="font-playfair text-3xl mb-2">
            {offer.product.name} {offer.product.size && `(${offer.product.size})`}
          </h1>

          {/* Rating Stars */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= offer.product.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span>({offer.product.reviewCount} reviews)</span>
          </div>

          {/* Prices */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-gray-500 line-through">Rs.{offer.product.price.toLocaleString()}</span>
            <span className="text-2xl font-semibold">
              Rs.{offer.discountedPrice.toLocaleString()}
            </span>
          </div>

          {/* Quantity and Add to Bag */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center border border-gray-300">
              <button className="px-3 py-2 border-r border-gray-300" onClick={decrementQuantity}>
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                className="h-10 w-16 text-center border-none focus:outline-none"
              />
              <button className="px-3 py-2 border-l border-gray-300" onClick={incrementQuantity}>
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button className="bg-[#c9a77c] hover:bg-[#b89669] text-white px-8">ADD TO BAG</Button>
          </div>

          {/* Product Description */}
          <div className="mb-8">
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-gray-700">{offer.product.description}</p>
          </div>

          {/* Kit Contents */}
          {offer.product.items && offer.product.items.length > 0 && (
            <div className="mb-8">
              <h3 className="font-medium mb-2">Kit Contents</h3>
              <ul className="space-y-4">
                {offer.product.items.map((item, index) => (
                  <li key={index} className="border-b pb-4">
                    <h4 className="font-medium mb-1">{item.name}</h4>
                    <p className="text-gray-600">{item.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Product Metadata */}
          <div className="text-sm text-gray-600 mb-6">
            {offer.product.productCode && (
              <p>Product Code: {offer.product.productCode}</p>
            )}
            {offer.product.category && (
              <p>Category: {offer.product.category}</p>
            )}
            {offer.product.tags && Array.isArray(offer.product.tags) && offer.product.tags.length > 0 && (
              <p>Tags: {offer.product.tags.join(", ")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OfferDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // Unwrap params using React.use()
  const resolvedParams = use(params)
  
  return (
    <Suspense fallback={
      <div className="container mx-auto py-12 flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-xl">Loading offer details...</div>
      </div>
    }>
      <OfferContent slug={resolvedParams.slug} />
    </Suspense>
  )
}
