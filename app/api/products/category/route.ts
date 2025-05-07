import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      )
    }

    const db = await connectToDatabase()
    
    const products = await db.collection("products")
      .find({ 
        category,
        status: "active" 
      })
      .sort({ createdAt: -1 })
      .toArray()

    const formattedProducts = products.map(product => ({
      ...product,
      _id: product._id.toString()
    }))

    return NextResponse.json(formattedProducts, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    })
  } catch (error) {
    console.error("Error fetching category products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}