import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const db = await connectToDatabase()
    const products = await db.collection("products").find({}).toArray()

    // Convert MongoDB ObjectId to string for each product
    const formattedProducts = products.map((product) => ({
      ...product,
      _id: product._id.toString(),
    }))

    return NextResponse.json(formattedProducts)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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
      categoryName,
      subcategory,
      subcategoryName,
      stock,
      featured,
      status,
    } = body

    // Validate required fields
    if (!name || !slug || !price || !category || !subcategory) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 })
    }

    // Check if product with the same slug already exists
    const db = await connectToDatabase()
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
      categoryName,
      subcategory,
      subcategoryName,
      stock: Number(stock) || 0,
      featured: featured || false,
      status: status || "active",
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
