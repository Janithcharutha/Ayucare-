import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import type { Product } from '@/lib/types'

export async function GET() {
  try {
    const db = await connectToDatabase()
    
    const products = await db.collection("products")
      .find({ status: "active" })
      .sort({ createdAt: -1 })
      .toArray()

    const formattedProducts = products.map(product => ({
      ...product,
      _id: product._id.toString()
    }))

    return NextResponse.json(formattedProducts, {
      headers: {
        'Cache-Control': 'no-store'
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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name,
      slug,
      description,
      price,
      discountedPrice,
      images,
      category,
      subcategory,
      stock,
      featured,
      status,
      keyIngredients,
      keyBenefits,
    } = body

    // Validate required fields
    if (!name || !slug || !price || !category || !subcategory) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 })
    }

    const db = await connectToDatabase()

    // Verify category and subcategory exist and get their names
    const categoryData = await db.collection("categories").findOne({ 
      _id: new ObjectId(category) 
    })
    
    if (!categoryData) {
      return NextResponse.json({ error: "Category not found" }, { status: 400 })
    }

    const subcategoryData = categoryData.subcategories.find(
      (sub: any) => sub._id.toString() === subcategory
    )
    
    if (!subcategoryData) {
      return NextResponse.json({ error: "Subcategory not found" }, { status: 400 })
    }

    // Check if product with the same slug already exists
    const existingProduct = await db.collection("products").findOne({ slug })

    if (existingProduct) {
      return NextResponse.json({ error: "Product with this slug already exists" }, { status: 400 })
    }

    // Create new product
    const newProduct = {
      name,
      slug,
      description: description || "",
      price: Number(price),
      discountedPrice: discountedPrice ? Number(discountedPrice) : null,
      images: images || [],
      category,
      categoryName: categoryData.name,
      subcategory,
      subcategoryName: subcategoryData.name,
      stock: Number(stock) || 0,
      featured: featured || false,
      status: status || "active",
      keyIngredients: keyIngredients || [],
      keyBenefits: keyBenefits || [],
      createdAt: new Date(),
    }

    const result = await db.collection("products").insertOne(newProduct)

    // Return the created product with string ID
    return NextResponse.json({
      ...newProduct,
      _id: result.insertedId.toString(),
    })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
