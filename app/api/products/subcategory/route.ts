import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const subcategoryId = searchParams.get('subcategoryId')

    if (!categoryId || !subcategoryId) {
      return NextResponse.json(
        { error: "Category ID and subcategory ID are required" },
        { status: 400 }
      )
    }

    const db = await connectToDatabase()
    
    const products = await db.collection("products")
      .find({ 
        category: categoryId,
        subcategory: subcategoryId,
        status: "active"
      })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(products.map(product => ({
      ...product,
      _id: product._id.toString()
    })))

  } catch (error) {
    console.error("Error fetching subcategory products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}