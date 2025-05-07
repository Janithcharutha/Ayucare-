import { connectToDatabase } from "@/lib/mongodb"
import { cache } from "react"
import type { Product } from '@/lib/types'

export interface Category {
  _id: string
  name: string
  slug: string
  image: string
  featured: boolean
  status: 'active' | 'inactive'
  order?: number
}

export const getCategories = cache(async () => {
  try {
    const db = await connectToDatabase()
    
    const categories = await db
      .collection("categories")
      .find({ 
        status: "active",
        featured: true 
      })
      .sort({ order: 1 })
      .toArray()

    return categories.map(category => ({
      _id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      image: category.image || "/placeholder.svg",
      featured: category.featured || false,
      status: category.status
    }))
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
})

export const getFeaturedProducts = cache(async (): Promise<Product[]> => {
  try {
    const db = await connectToDatabase()
    
    const products = await db
      .collection("products")
      .find({ 
        featured: true,
        status: "active" 
      })
      .sort({ createdAt: -1 })
      .limit(8)
      .toArray()

    return products.map(product => ({
      _id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      stock: product.stock || 0,
      images: product.images || [],
      category: product.category,
      categoryName: product.categoryName,
      subcategory: product.subcategory,
      subcategoryName: product.subcategoryName,
      featured: true,
      status: 'active',
      createdAt: product.createdAt || new Date(),
      updatedAt: product.updatedAt || new Date()
    }))
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return []
  }
})