import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import ProductGrid from "@/components/product-grid"
import type { Product } from "@/lib/types"

// Add this function to fetch products
async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
      next: { revalidate: 3600 }
    })
    
    if (!res.ok) {
      throw new Error('Failed to fetch products')
    }
    
    return res.json()
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

// Add this function to get unique categories from products
function getUniqueCategories(products: Product[]): string[] {
  const categories = new Set(products.map(product => product.categoryName))
  return Array.from(categories).sort()
}

export default async function ShopPage() {
  const products = await getProducts()
  const categories = getUniqueCategories(products)

  // Get unique product types
  const productTypes = Array.from(new Set(products.map(p => p.subcategoryName))).sort()

  return (
    <div className="container mx-auto py-12">
      <h1 className="font-playfair text-4xl mb-8 text-center">Shop All Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar filters */}
        <div className="space-y-8">
          <div>
            <h3 className="font-playfair text-xl mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox id={`category-${category}`} />
                  <Label htmlFor={`category-${category}`}>{category}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-playfair text-xl mb-4">Price Range</h3>
            <Slider 
              defaultValue={[0, 5000]} 
              min={0} 
              max={Math.max(...products.map(p => p.price), 5000)} 
              step={100} 
            />
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>RS. 0</span>
              <span>RS. {Math.max(...products.map(p => p.price)).toLocaleString()}</span>
            </div>
          </div>

          <div>
            <h3 className="font-playfair text-xl mb-4">Product Type</h3>
            <div className="space-y-2">
              {productTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox id={`type-${type}`} />
                  <Label htmlFor={`type-${type}`}>{type}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product grid */}
        <div className="md:col-span-3">
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  )
}
