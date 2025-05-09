import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function BundleKitsPage() {
  const bundles = [
    {
      id: 1,
      name: "Skincare Essentials",
      price: 4500,
      description: "Complete daily skincare routine with our bestsellers",
      products: ["Face Cleanser", "Toner", "Moisturizer", "Sunscreen"],
      savings: 1000
    },
    {
      id: 2,
      name: "Hair Care Bundle",
      price: 3800,
      description: "Transform your hair care routine with natural products",
      products: ["Herbal Shampoo", "Hair Oil", "Hair Mask", "Leave-in Conditioner"],
      savings: 800
    },
    {
      id: 3,
      name: "Body Care Set",
      price: 5200,
      description: "Luxurious body care products for daily pampering",
      products: ["Body Wash", "Body Scrub", "Body Lotion", "Hand Cream"],
      savings: 1200
    }
  ]

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
          <div key={bundle.id} className="bg-white rounded-lg overflow-hidden shadow-md">
            <div className="relative h-[250px]">
              <Image
                src={`/placeholder.svg?height=250&width=400&text=${bundle.name}`}
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
                  {bundle.products.map((product, index) => (
                    <li key={index}>{product}</li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xl font-semibold">RS. {bundle.price}.00</p>
                  <p className="text-green-600 text-sm">Save RS. {bundle.savings}.00</p>
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