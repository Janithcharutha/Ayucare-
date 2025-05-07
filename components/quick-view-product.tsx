"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QuickViewProductProps {
  product: {
    id: number
    name: string
    slug: string
    category: string
    categoryName: string
    image: string
    originalPrice: number
    discountedPrice: number
    description: string
    contents?: string[]
  }
}

export default function QuickViewProduct({ product }: QuickViewProductProps) {
  const [quantity, setQuantity] = useState(1)

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  const discount = Math.round(((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Product Image */}
      <div>
        <div className="relative">
          <div className="absolute top-4 left-4 z-10 bg-black text-white rounded-full px-4 py-1 text-sm font-medium">
            {discount}% OFF
          </div>
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={500}
            height={500}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
      </div>

      {/* Product Details */}
      <div>
        <p className="text-sm text-gray-500 mb-1">{product.categoryName}</p>
        <h2 className="font-playfair text-2xl mb-4">{product.name}</h2>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-gray-500 line-through">Rs.{product.originalPrice.toLocaleString()}</span>
          <span className="text-xl font-semibold">Rs.{product.discountedPrice.toLocaleString()}</span>
        </div>

        <div className="text-sm text-gray-600 mb-2">
          <p>
            3 X Rs.{(product.discountedPrice / 3).toFixed(2)} with{" "}
            <span className="bg-blue-900 text-white px-2 py-0.5 rounded text-xs">installpay</span>
          </p>
        </div>

        <div className="text-sm text-gray-600 mb-6">
          <p>
            or 3 X Rs.{(product.discountedPrice / 3).toFixed(2)} with <span className="font-bold">KOKO</span>
          </p>
        </div>

        <p className="text-gray-700 mb-6">{product.description}</p>

        {product.contents && (
          <div className="mb-6">
            <h3 className="font-medium mb-2">Gift Box Contents:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {product.contents.map((item, index) => (
                <li key={index} className="text-gray-700">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center border border-gray-300">
            <button className="px-3 py-2 border-r border-gray-300" onClick={decrementQuantity}>
              <Minus className="h-4 w-4" />
            </button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
              className="h-10 w-16 text-center border-none focus:outline-none"
            />
            <button className="px-3 py-2 border-l border-gray-300" onClick={incrementQuantity}>
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <Button className="bg-[#c9a77c] hover:bg-[#b89669] text-white px-8">ADD TO BAG</Button>
        </div>

        <Link href={`/gifting/${product.slug}`} className="text-black hover:underline">
          View full details
        </Link>
      </div>
    </div>
  )
}
