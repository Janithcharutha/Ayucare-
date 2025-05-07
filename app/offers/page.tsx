"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import QuickViewProduct from "@/components/quick-view-product"

interface OfferProduct {
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

export default function OffersPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState<OfferProduct | null>(null)

  // Sample offer products data
  const offerProducts: OfferProduct[] = [
    {
      id: 1,
      name: "Seasonal Gift Box – Combo 1",
      slug: "seasonal-gift-box-combo-1",
      category: "gifting",
      categoryName: "GIFTING",
      image: "/placeholder.svg?height=400&width=400&text=Gift+Box+1",
      originalPrice: 16600,
      discountedPrice: 13280,
      description: "A curated selection of our bestselling products for a complete skincare routine.",
      contents: ["Kasthuri Kaha Night Cream", "Vitamin C Serum", "Manjistha Face Wash", "Aloe Vera Gel"],
    },
    {
      id: 2,
      name: "Seasonal Gift Box – Combo 6",
      slug: "seasonal-gift-box-combo-6",
      category: "gifting",
      categoryName: "GIFTING",
      image: "/placeholder.svg?height=400&width=400&text=Gift+Box+6",
      originalPrice: 19150,
      discountedPrice: 15320,
      description: "Our premium collection of skincare essentials in an elegant gift box.",
      contents: ["Turmeric Face Cream", "Hyaluronic Acid Serum", "Rose Water Toner", "Sandalwood Face Mask"],
    },
    {
      id: 3,
      name: "Seasonal Gift Box – Combo 5",
      slug: "seasonal-gift-box-combo-5",
      category: "gifting",
      categoryName: "GIFTING",
      image: "/placeholder.svg?height=400&width=400&text=Gift+Box+5",
      originalPrice: 19350,
      discountedPrice: 15480,
      description: "A luxurious gift set featuring our most popular products for glowing skin.",
      contents: ["Vitamin C Brightening Cream", "Manjistha Face Mask", "Aloe Vera Toner", "Coconut Cleansing Oil"],
    },
    {
      id: 4,
      name: "Seasonal Gift Box – Combo 2",
      slug: "seasonal-gift-box-combo-2",
      category: "gifting",
      categoryName: "GIFTING",
      image: "/placeholder.svg?height=400&width=400&text=Gift+Box+2",
      originalPrice: 15800,
      discountedPrice: 12640,
      description: "A perfect gift set for those new to natural skincare.",
      contents: ["Aloe Vera Day Cream", "Rose Water Mist", "Neem Face Wash", "Turmeric Soap"],
    },
    {
      id: 5,
      name: "Seasonal Gift Box – Combo 3",
      slug: "seasonal-gift-box-combo-3",
      category: "gifting",
      categoryName: "GIFTING",
      image: "/placeholder.svg?height=400&width=400&text=Gift+Box+3",
      originalPrice: 17900,
      discountedPrice: 14320,
      description: "A comprehensive skincare routine in one beautiful gift box.",
      contents: ["Kasthuri Kaha Day Cream", "Vitamin C Serum", "Aloe Vera Gel", "Sandalwood Soap"],
    },
    {
      id: 6,
      name: "Seasonal Gift Box – Combo 4",
      slug: "seasonal-gift-box-combo-4",
      category: "gifting",
      categoryName: "GIFTING",
      image: "/placeholder.svg?height=400&width=400&text=Gift+Box+4",
      originalPrice: 18500,
      discountedPrice: 14800,
      description: "Our bestselling products combined in an elegant gift box.",
      contents: ["Turmeric Night Cream", "Manjistha Serum", "Rose Face Wash", "Coconut Body Lotion"],
    },
  ]

  // Pagination
  const productsPerPage = 3
  const totalPages = Math.ceil(offerProducts.length / productsPerPage)

  const paginatedProducts = offerProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {paginatedProducts.map((product) => (
          <div key={product.id} className="group relative">
            {/* Offer badge */}
            <div className="absolute top-4 left-4 z-10 bg-black text-white rounded-full px-4 py-1 text-sm font-medium">
              Offer
            </div>

            {/* Product image */}
            <div className="relative mb-4 overflow-hidden rounded-lg">
              <Link href={`/gifting/${product.slug}`}>
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>

              {/* Quick view button */}
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={() => setSelectedProduct(product)}
                  >
                    QUICK VIEW
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[900px]">
                  {selectedProduct && <QuickViewProduct product={selectedProduct} />}
                </DialogContent>
              </Dialog>
            </div>

            {/* Product details */}
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">{product.categoryName}</p>
              <h3 className="font-playfair text-xl mb-2">
                <Link href={`/gifting/${product.slug}`} className="hover:text-gray-600">
                  {product.name}
                </Link>
              </h3>

              <div className="flex justify-center items-center gap-2 mb-2">
                <span className="text-gray-500 line-through">Rs.{product.originalPrice.toLocaleString()}</span>
                <span className="font-semibold">Rs.{product.discountedPrice.toLocaleString()}</span>
              </div>

              <div className="text-sm text-gray-600 mb-2">
                <p>
                  3 X Rs.{(product.discountedPrice / 3).toFixed(2)} with{" "}
                  <span className="bg-blue-900 text-white px-2 py-0.5 rounded text-xs">installpay</span>
                </p>
              </div>

              <div className="text-sm text-gray-600 mb-4">
                <p>
                  or 3 X Rs.{(product.discountedPrice / 3).toFixed(2)} with <span className="font-bold">KOKO</span>
                </p>
              </div>

              <Link href={`/gifting/${product.slug}`}>
                <Button variant="outline" className="w-full border-black hover:bg-black hover:text-white">
                  SELECT OPTIONS
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentPage === index + 1
                    ? "bg-black text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {index + 1}
              </button>
            ))}
            {currentPage < totalPages && (
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
