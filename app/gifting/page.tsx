import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function GiftingPage() {
  // Sample gift box data
  const giftBoxes = [
    {
      id: 1,
      name: "Seasonal Bliss Box",
      price: 5000,
      description: "A curated selection of our seasonal favorites for a complete wellness experience.",
      items: ["Vitamin C Serum", "Ceylon Tea Face Mask", "Cinnamon Body Scrub", "Lavender Essential Oil"],
    },
    {
      id: 2,
      name: "Relaxation Gift Set",
      price: 4500,
      description: "The perfect gift for someone who needs to unwind and relax.",
      items: ["Lavender Essential Oil", "Sandalwood Soap", "Herbal Tea Blend", "Aromatherapy Candle"],
    },
    {
      id: 3,
      name: "Skincare Essentials",
      price: 6000,
      description: "A complete skincare routine featuring our bestselling products.",
      items: ["Vitamin C Serum", "Turmeric Face Cream", "Aloe Vera Gel", "Ceylon Tea Face Mask"],
    },
    {
      id: 4,
      name: "Luxury Spa Box",
      price: 7500,
      description: "Transform your bathroom into a luxury spa with this premium gift set.",
      items: ["Cinnamon Body Scrub", "Coconut Hair Oil", "Bath Salts", "Body Butter", "Face Towel"],
    },
  ]

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="font-playfair text-4xl mb-4">Seasonal GiftBoxes</h1>
        <p className="max-w-2xl mx-auto text-gray-700">
          Our specially curated gift boxes combine the finest natural products from Ceylon. Perfect for gifting or
          treating yourself to a complete wellness experience.
        </p>
      </div>

      {/* Hero image */}
      <div className="relative h-[400px] mb-16">
        <Image
          src="/placeholder.svg?height=400&width=1200&text=Seasonal+Gift+Boxes"
          alt="Seasonal Gift Boxes"
          fill
          className="object-cover rounded-lg"
        />
      </div>

      {/* Gift boxes grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {giftBoxes.map((box) => (
          <div key={box.id} className="bg-white rounded-lg overflow-hidden shadow-md">
            <div className="relative h-[300px]">
              <Image
                src={`/placeholder.svg?height=300&width=600&text=${box.name}`}
                alt={box.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="font-playfair text-2xl mb-2">{box.name}</h2>
              <p className="text-gray-700 mb-4">{box.description}</p>
              <div className="mb-4">
                <h3 className="font-medium mb-2">Includes:</h3>
                <ul className="list-disc list-inside text-gray-700">
                  {box.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xl font-semibold">RS. {box.price}.00</p>
                <Button>Add to Cart</Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Custom gift box section */}
      <div className="mt-20 bg-beige p-8 rounded-lg">
        <div className="text-center mb-8">
          <h2 className="font-playfair text-3xl mb-4">Create Your Own Gift Box</h2>
          <p className="max-w-2xl mx-auto text-gray-700">
            Customize a gift box with your favorite products for a personalized gifting experience.
          </p>
        </div>
        <div className="flex justify-center">
          <Button size="lg">Start Creating</Button>
        </div>
      </div>
    </div>
  )
}
