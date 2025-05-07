import { cache } from 'react'
import { connectToDatabase } from './mongodb'

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