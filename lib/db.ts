import { connectToDatabase } from "@/lib/mongodb"
import { cache } from "react"

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