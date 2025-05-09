import { cache } from 'react'
import { connectToDatabase } from './mongodb'
import { ObjectId } from "mongodb"

export const getCategoryData = cache(async (slug: string) => {
  try {
    const db = await connectToDatabase()
    
    const category = await db
      .collection("categories")
      .findOne({ slug })

    if (!category) return null

    return {
      ...category,
      _id: category._id.toString()
    }
  } catch (error) {
    console.error("Error fetching category:", error)
    return null
  }
})

export interface Product {
  _id: string
  name: string
  description: string
  price: number
  images: string[]
  categoryName: string
  categorySlug: string
  subcategoryName: string
  subcategorySlug: string
  size?: string
  code?: string
  tags?: string[]
  keyIngredients?: {
    name: string
    benefits: string[]
  }[]
  keyBenefits?: string[]
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const db = await connectToDatabase()
    const product = await db.collection("products").findOne({ slug })
    
    if (!product) return null
    
    // Add type assertion to ensure all required fields are present
    const formattedProduct: Product = {
      _id: product._id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      images: product.images,
      categoryName: product.categoryName,
      categorySlug: product.categorySlug,
      subcategoryName: product.subcategoryName,
      subcategorySlug: product.subcategorySlug,
      size: product.size,
      code: product.code,
      tags: product.tags,
      keyIngredients: product.keyIngredients,
      keyBenefits: product.keyBenefits
    }
    
    return formattedProduct
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

