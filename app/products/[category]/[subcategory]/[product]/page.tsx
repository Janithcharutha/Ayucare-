"use client"

import { Metadata } from 'next'
import { getProduct, type Product } from '@/lib/api'
import Image from "next/image"
import Link from "next/link"
import { 
  ChevronRight, Star, Facebook, Twitter, 
  Mail, Instagram, Linkedin, Minus, Plus 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import RelatedProducts from "@/components/related-products"

type Props = {
  params: {
    category: string
    subcategory: string
    product: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.product)
  
  return {
    title: product?.name,
    description: product?.description
  }
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.product)

  if (!product) {
    return <div>Product not found</div>
  }

  // Add explicit types to map parameters
  const renderImage = (image: string, index: number) => (
    <div key={index} className="overflow-hidden rounded-lg border cursor-pointer">
      <Image
        src={image}
        alt={`${product.name} - Image ${index + 1}`}
        width={150}
        height={150}
        className="w-full h-auto object-cover"
      />
    </div>
  )

  return (
    <div className="container mx-auto py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-gray-800">HOME</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href={`/products/${product.categorySlug}`} className="hover:text-gray-800">
          {product.categoryName}
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href={`/products/${product.categorySlug}/${product.subcategorySlug}`} className="hover:text-gray-800">
          {product.subcategoryName}
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <div className="mb-4 overflow-hidden rounded-lg relative">
            <Image
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {product.images.map(renderImage)}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="font-playfair text-3xl mb-2">
            {product.name} {product.size && `(${product.size})`}
          </h1>

          {/* Rating Stars */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>

          <p className="text-2xl font-semibold mb-4">Rs.{product.price.toLocaleString()}</p>
          {/* Quantity and Add to Bag */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center border border-gray-300">
              <button 
                className="px-3 py-2 border-r border-gray-300"
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="number"
                min="1"
                value={1}
                className="h-10 w-16 text-center border-none focus:outline-none"
              />
              <button 
                className="px-3 py-2 border-l border-gray-300"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button className="bg-[#c9a77c] hover:bg-[#b89669] text-white px-8">
              ADD TO BAG
            </Button>
          </div>

          {/* Product Description */}
          <div className="mb-8">
            <h3 className="font-medium mb-2">What is it?</h3>
            <p className="text-gray-700">{product.description}</p>
          </div>

          {/* Product Metadata */}
          <div className="text-sm text-gray-600 mb-6">
            {product.code && <p>Product Code: {product.code}</p>}
            <p>Category: {product.subcategoryName}</p>
            {product.tags && <p>Tags: {product.tags.join(", ")}</p>}
          </div>

          {/* Social Share */}
          <div className="flex gap-2 mb-8">
            {[
              { Icon: Facebook, href: "#" },
              { Icon: Twitter, href: "#" },
              { Icon: Mail, href: "#" },
              { Icon: Instagram, href: "#" },
              { Icon: Linkedin, href: "#" },
            ].map(({ Icon, href }, index) => (
              <Link 
                key={index} 
                href={href} 
                className="p-2 border rounded-full hover:bg-gray-100"
              >
                <Icon className="h-4 w-4" />
              </Link>
            ))}
          </div>

          {/* Accordions */}
          <div className="border-t pt-4">
            <Accordion type="single" collapsible className="w-full">
              {/* Product Details Accordion */}
              <AccordionItem value="details">
                <AccordionTrigger>Product Details</AccordionTrigger>
                <AccordionContent>
                  {/* Key Ingredients */}
                  {product.keyIngredients && product.keyIngredients.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-medium mb-2">Key Ingredients</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        {product.keyIngredients.map((ingredient, index: number) => (
                          <li key={index}>
                            <p className="font-medium">{ingredient.name}</p>
                            <ul className="list-[–] pl-5 mt-1">
                              {ingredient.benefits.map((benefit: string, i: number) => (
                                <li key={i}>{benefit}</li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Key Benefits */}
                  {product.keyBenefits && product.keyBenefits.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Key Benefits</h3>
                      <ul className="list-[–] pl-5 space-y-1">
                        {product.keyBenefits.map((benefit: string, index: number) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              {/* Reviews Accordion */}
              <AccordionItem value="reviews">
                <AccordionTrigger className="text-left font-medium">Reviews</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h3 className="font-medium mb-4">Customer Reviews</h3>
                      {/* Reviews content */}
                    </div>

                    <div>
                      <h3 className="font-medium mb-4">Write a Review</h3>
                      <form className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block mb-1 text-sm">
                            Name
                          </label>
                          <input type="text" id="name" className="w-full p-2 border rounded-md" required />
                        </div>
                        <div>
                          <label htmlFor="email" className="block mb-1 text-sm">
                            Email
                          </label>
                          <input type="email" id="email" className="w-full p-2 border rounded-md" required />
                        </div>
                        <div>
                          <label className="block mb-1 text-sm">Rating</label>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button key={star} type="button" className="focus:outline-none">
                                <Star className="h-6 w-6 text-gray-300 hover:text-yellow-400 hover:fill-yellow-400" />
                              </button>
                            ))}
                          </div>
                          <label htmlFor="review" className="block mb-1 text-sm">
                            Review
                          </label>
                          <textarea id="review" rows={4} className="w-full p-2 border rounded-md" required></textarea>
                        </div>
                        <Button type="submit" className="bg-[#c9a77c] hover:bg-[#b89669]">
                          Submit Review
                        </Button>
                      </form>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="font-playfair text-3xl mb-8 text-center">Related Products</h2>
        <RelatedProducts 
          category={params.category} 
          subcategory={params.subcategory} 
          currentProductId={product._id} 
        />
      </div>
    </div>
  )
}
