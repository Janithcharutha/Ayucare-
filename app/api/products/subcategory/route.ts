import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const subcategoryId = searchParams.get('subcategoryId')

    console.log('Searching with IDs:', { categoryId, subcategoryId })

    if (!categoryId || !subcategoryId) {
      return NextResponse.json(
        { error: "Category ID and subcategory ID are required" },
        { status: 400 }
      )
    }

    const db = await connectToDatabase()
    
    // Match your actual product schema
    const query = {
      category: categoryId,
      subcategory: subcategoryId,
      status: "active"
    }

    console.log('MongoDB query:', JSON.stringify(query, null, 2))
    
    const products = await db.collection("products")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray()

    console.log(`Found ${products.length} products`)

    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}