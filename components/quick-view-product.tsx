"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Product {
  id: number
  name: string
  slug: string
  category?: string
  categoryName?: string
  image: string
  originalPrice: number
  discountedPrice: number
  rating: number
  reviewCount: number
  description: string
  contents?: string[]
}

export function QuickViewProduct({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  const installmentAmount = (product.discountedPrice / 3).toFixed(2)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Product Image */}
      <div className="bg-[#f5f0e8] rounded-lg overflow-hidden">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          width={400}
          height={400}
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Product Details */}
      <div>
        <h2 className="font-playfair text-2xl mb-2">{product.name}</h2>
        
        <div className="flex items-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-gray-500 line-through">Rs.{product.originalPrice.toLocaleString()}</span>
          <span className="text-xl font-semibold">Rs.{product.discountedPrice.toLocaleString()}</span>
        </div>

        <div className="text-gray-600 mb-6">
          <p className="flex items-center gap-2">
            3 X Rs.{installmentAmount} with
            <span className="bg-blue-900 text-white px-2 py-0.5 rounded text-xs">installpay</span>
            <span className="text-gray-400 cursor-help">ⓘ</span>
          </p>
          <p className="mt-2 flex items-center gap-2">
            or 3 X Rs.{installmentAmount} with 
            <span className="font-bold">KOKO</span>
            <span className="text-gray-400 cursor-help">ⓘ</span>
          </p>
        </div>

        <div className="mb-6">
          <p className="text-gray-700">{product.description}</p>
        </div>

        {product.contents && (
          <div className="space-y-2 mb-6">
            <p className="font-medium">Contents:</p>
            <ul className="list-disc pl-5">
              {product.contents.map((item, index) => (
                <li key={index} className="text-gray-700">{item}</li>
              ))}
            </ul>
          </div>
        )}
\
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center border border-gray-300">
            <button 
              className="px-3 py-2 border-r border-gray-300" 
              onClick={decrementQuantity}
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value) || 1)}
              className="h-10 w-16 text-center border-none focus:outline-none"
              aria-label="Quantity"
            />
            <button 
              className="px-3 py-2 border-l border-gray-300" 
              onClick={incrementQuantity}
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <Button className="bg-[#c9a77c] hover:bg-[#b89669] text-white px-8">
            ADD TO BAG
          </Button>
        </div>

        <Link 
          href={`/offers/${product.slug}`} 
          className="text-[#c9a77c] hover:text-[#b89669] font-medium"
        >
          View full details →
        </Link>
      </div>
    </div>
  )
}
