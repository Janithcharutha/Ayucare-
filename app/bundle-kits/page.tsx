import Image from "next/image"
import { Button } from "@/components/ui/button"
import type { BundleKit } from "@/types/bundle-kit"

// Make the component async to fetch data
async function BundleKitsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
  // Fetch bundles from the API
  const response = await fetch(`${baseUrl}/api/bundle-kits`, {
    cache: 'no-store', // Disable caching to always get fresh data
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch bundle kits')
  }

  const bundles: BundleKit[] = await response.json()

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="font-playfair text-4xl mb-4">Bundle Kits</h1>
        <p className="max-w-2xl mx-auto text-gray-700">
          Save more when you buy our carefully curated product bundles. 
          Each kit is designed to give you the best results and value.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {bundles.map((bundle) => (
          <div 
            key={typeof bundle._id === 'string' ? bundle._id : bundle._id?.toString()} 
            className="bg-white rounded-lg overflow-hidden shadow-md"
          >
            <div className="relative h-[250px]">
              <Image
                src={bundle.images[0] || `/placeholder.svg?height=250&width=400&text=${bundle.name}`}
                alt={bundle.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="font-playfair text-2xl mb-2">{bundle.name}</h2>
              <p className="text-gray-700 mb-4">{bundle.description}</p>
              <div className="mb-4">
                <h3 className="font-medium mb-2">Includes:</h3>
                <ul className="list-disc list-inside text-gray-700">
                  {bundle.products.map((product) => (
                    <li 
                      key={typeof product.productId === 'string' 
                        ? product.productId 
                        : product.productId.toString()
                      }
                    >
                      {product.productName}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xl font-semibold">
                    RS. {bundle.price.toFixed(2)}
                  </p>
                  {bundle.discountedPrice && (
                    <p className="text-green-600 text-sm">
                      Save RS. {(bundle.price - bundle.discountedPrice).toFixed(2)}
                    </p>
                  )}
                </div>
                <Button>Add to Cart</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BundleKitsPage