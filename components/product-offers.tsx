// "use client"

// import { useEffect, useState } from "react"
// import Image from "next/image"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"

// interface ProductOffersProps {
//   productId?: string
//   type?: 'regular' | 'bundle' | 'gift'
//   quickView?: boolean
//   offer?: ProductOffer
// }

// export default function ProductOffers({ 
//   productId, 
//   type = 'regular',
//   quickView = false,
//   offer 
// }: ProductOffersProps) {
//   const [offers, setOffers] = useState<ProductOffer[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchOffers = async () => {
//       try {
//         const url = productId 
//           ? `/api/offers?productId=${productId}&type=${type}`
//           : `/api/offers?type=${type}`
        
//         const response = await fetch(url)
//         const data = await response.json()
//         setOffers(data)
//       } catch (error) {
//         console.error('Error fetching offers:', error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchOffers()
//   }, [productId, type])

//   if (quickView && offer) {
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <div className="relative h-[400px] rounded-lg overflow-hidden">
//           <Image
//             src={offer.productImage?.[0] || '/placeholder.svg'}
//             alt={offer.productName}
//             fill
//             className="object-cover"
//             unoptimized={offer.productImage?.[0]?.startsWith('http')}
//           />
//         </div>
//         <div className="flex flex-col">
//           <h2 className="font-playfair text-2xl mb-2">{offer.productName}</h2>
//           <div className="flex items-center gap-2 mb-4">
//             <span className="text-gray-500 line-through">
//               Rs.{offer.originalPrice.toLocaleString()}
//             </span>
//             <span className="text-2xl font-semibold">
//               Rs.{offer.discountedPrice.toLocaleString()}
//             </span>
//             <span className="bg-black text-white text-sm px-2 py-1 rounded">
//               {offer.discountPercentage}% OFF
//             </span>
//           </div>
//           <p className="text-gray-600 mb-6">{offer.productDescription}</p>
//           <Link 
//             href={`/products/${offer.categorySlug}/${offer.productSlug}`}
//             className="bg-black text-white py-3 px-6 rounded text-center hover:bg-gray-800 transition-colors"
//           >
//             Add to Cart
//           </Link>
//         </div>
//       </div>
//     )
//   }

//   if (loading) {
//     return <div>Loading offers...</div>
//   }

//   if (offers.length === 0) {
//     return null
//   }

//   return (
//     <div className="mt-8">
//       <h2 className="font-playfair text-2xl mb-4">
//         {type === 'bundle' ? 'Bundle Kits' : 
//          type === 'gift' ? 'Gifting Deals' : 
//          'Special Offers'}
//       </h2>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {offers.map((offer) => (
//           <div key={offer._id} className="group relative">
//             <div className="absolute top-4 left-4 z-10">
//               <Badge variant="secondary" className="bg-black text-white">
//                 {offer.discountPercentage}% OFF
//               </Badge>
//             </div>
            
//             <Link href={`/products/${offer.categorySlug}/${offer.productSlug}`}>
//               <div className="relative overflow-hidden rounded-lg mb-4">
//                 <Image
//                   src={offer.productImage[0] || '/placeholder.svg'}
//                   alt={offer.productName}
//                   width={400}
//                   height={400}
//                   className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
//                 />
//               </div>
              
//               <div className="text-center">
//                 <h3 className="font-medium mb-2">{offer.productName}</h3>
//                 <div className="flex items-center justify-center gap-2">
//                   <span className="text-gray-500 line-through">
//                     Rs.{offer.originalPrice.toLocaleString()}
//                   </span>
//                   <span className="text-xl font-semibold">
//                     Rs.{offer.discountedPrice.toLocaleString()}
//                   </span>
//                 </div>
//               </div>
//             </Link>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }