"use client"

interface QuickViewProductProps {
  product: {
    name: string
    description: string
    image: string
    originalPrice: number
    discountedPrice: number
    contents?: string[]
  }
}

export default function QuickViewProduct({ product }: QuickViewProductProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-[400px] object-cover rounded-lg"
        />
      </div>
      <div>
        <h2 className="font-playfair text-2xl mb-4">{product.name}</h2>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-gray-500 line-through">
            Rs.{product.originalPrice.toLocaleString()}
          </span>
          <span className="text-xl font-semibold">
            Rs.{product.discountedPrice.toLocaleString()}
          </span>
        </div>
        <p className="text-gray-600 mb-4">{product.description}</p>
        {product.contents && (
          <div className="mb-4">
            <h3 className="font-medium mb-2">Contents:</h3>
            <ul className="list-disc list-inside text-gray-600">
              {product.contents.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800">
          Add to Cart
        </button>
      </div>
    </div>
  )
}
