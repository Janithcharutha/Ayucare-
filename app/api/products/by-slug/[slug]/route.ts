import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

interface Subcategory {
  _id: ObjectId
  name: string
  slug: string
}

interface Category {
  _id: ObjectId
  name: string
  slug: string
  subcategories: Subcategory[]
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const db = await connectToDatabase()
    const slug = await Promise.resolve(params.slug)
    
    const product = await db.collection("products")
      .findOne({ 
        slug,
        status: "active"
      })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Get category and subcategory data
    const category = await db.collection("categories")
      .findOne<Category>({ _id: new ObjectId(product.category) })

    const subcategory = category?.subcategories
      ?.find((sub: Subcategory) => sub._id.toString() === product.subcategory)

    const formattedProduct = {
      ...product,
      _id: product._id.toString(),
      categorySlug: category?.slug || '',
      categoryName: category?.name || '',
      subcategorySlug: subcategory?.slug || '',
      subcategoryName: subcategory?.name || ''
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