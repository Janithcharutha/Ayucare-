import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"



export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
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

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 })
    }

    // Validate required fields
    if (!name || !slug || !price || !category || !subcategory) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 })
    }

    const db = await connectToDatabase()

    // Check if another product with the same slug exists (excluding this one)
    const existingProduct = await db.collection("products").findOne({ slug, _id: { $ne: new ObjectId(id) } })

    if (existingProduct) {
      return NextResponse.json({ error: "Another product with this slug already exists" }, { status: 400 })
    }

    // Update product
    const updatedProduct = {
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
      updatedAt: new Date(),
    }

    const result = await db
      .collection("products")
      .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: updatedProduct }, { returnDocument: "after" })

    if (!result) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Convert MongoDB ObjectId to string for response
    return NextResponse.json({
      ...result,
      _id: result._id.toString(),
    })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 })
    }

    const db = await connectToDatabase()

    // Check if product exists
    const product = await db.collection("products").findOne({ _id: new ObjectId(id) })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Delete product
    await db.collection("products").deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
