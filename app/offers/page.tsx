"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import QuickViewProduct from "@/components/quick-view-product"

interface Offer {
  _id: string
  productName: string
  productSlug: string
  productCategory: string
  productCategoryName: string
  productImage: string[]
  originalPrice: number
  discountedPrice: number
  productDescription: string
  discountPercentage: number
  startDate: string
  endDate: string
}

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch("/api/offers")
        if (!response.ok) throw new Error("Failed to fetch offers")
        const data = await response.json()
        setOffers(data)
      } catch (err) {
        setError("Failed to load offers")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchOffers()
  }, [])

  if (loading) return <div className="text-center py-12">Loading...</div>
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>

  // Pagination
  const offersPerPage = 3
  const totalPages = Math.ceil(offers.length / offersPerPage)
  const paginatedOffers = offers.slice(
    (currentPage - 1) * offersPerPage,
    currentPage * offersPerPage
  )

  return (
    <div className="container mx-auto py-12">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-gray-800">HOME</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-gray-800">OFFERS</span>
      </div>

      <h1 className="font-playfair text-4xl mb-8 text-center">Special Offers</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {paginatedOffers.map((offer) => (
          <div key={offer._id} className="group relative">
            <div className="absolute top-4 left-4 z-10 bg-black text-white rounded-full px-4 py-1 text-sm font-medium">
              {offer.discountPercentage}% OFF
            </div>

            <div className="relative mb-4 overflow-hidden rounded-lg">
              <Link href={`/products/${offer.productCategory}/${offer.productSlug}`}>
                <Image
                  src={
                    offer.productImage?.[0] 
                      ? offer.productImage[0]
                      : '/placeholder.svg'
                  }
                  alt={offer.productName}
                  width={400}
                  height={400}
                  className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized={offer.productImage?.[0]?.startsWith('http')}
                  priority
                />
              </Link>

              <Dialog>
                <DialogTrigger asChild>
                  
                </DialogTrigger>
                <DialogContent className="sm:max-w-[900px]">
                  {selectedOffer && (
                    <QuickViewProduct 
                      product={{
                        productName: selectedOffer.productName,
                        productDescription: selectedOffer.productDescription,
                        productImage: selectedOffer.productImage,
                        originalPrice: selectedOffer.originalPrice,
                        discountedPrice: selectedOffer.discountedPrice
                      }} 
                    />
                  )}
                </DialogContent>
              </Dialog>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">{offer.productCategoryName}</p>
              <h3 className="font-playfair text-xl mb-2">
                <Link href={`/products/${offer.productCategory}/${offer.productSlug}`} className="hover:text-gray-600">
                  {offer.productName}
                </Link>
              </h3>

              <div className="flex justify-center items-center gap-2 mb-4">
                <span className="text-gray-500 line-through">
                  Rs.{offer.originalPrice.toLocaleString()}
                </span>
                <span className="font-semibold">
                  Rs.{offer.discountedPrice.toLocaleString()}
                </span>
              </div>


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
          </div>
        </div>
      )}
    </div>
  )
}
