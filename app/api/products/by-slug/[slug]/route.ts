import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const db = await connectToDatabase()
    
    const product = await db.collection("products")
      .findOne({ 
        slug: params.slug,
        status: "active"
      })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Convert MongoDB _id to string
    const formattedProduct = {
      ...product,
      _id: product._id.toString()
    }

    return NextResponse.json(formattedProduct)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}