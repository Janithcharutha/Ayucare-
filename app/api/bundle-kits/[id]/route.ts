import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid bundle kit ID" }, { status: 400 })
    }

    const db = await connectToDatabase()
    const bundleKit = await db.collection("bundleKits").findOne({ _id: new ObjectId(id) })

    if (!bundleKit) {
      return NextResponse.json({ error: "Bundle kit not found" }, { status: 404 })
    }

    // Convert MongoDB ObjectId to string
    return NextResponse.json({
      ...bundleKit,
      _id: bundleKit._id.toString(),
      // Add any other ObjectId conversions if needed
    })
  } catch (error) {
    console.error("Error fetching bundle kit:", error)
    return NextResponse.json({ error: "Failed to fetch bundle kit" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params
    const body = await request.json()
    // Add the fields you need to update
    const { name, description, price, products } = body

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid bundle kit ID" }, { status: 400 })
    }

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const db = await connectToDatabase()

    // Process products to ensure they all have _id
    const processedProducts = (products || []).map((product: any) => {
      if (product._id) {
        // If it's a string, convert to ObjectId
        return {
          ...product,
          _id: typeof product._id === "string" ? new ObjectId(product._id) : product._id,
        }
      }
      // If no _id, create a new one
      return {
        ...product,
        _id: new ObjectId(),
      }
    })

    // Update bundle kit
    const updatedBundleKit = {
      name,
      description: description || "",
      price: price || 0,
      products: processedProducts,
      updatedAt: new Date(),
    }

    const result = await db
      .collection("bundleKits")
      .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: updatedBundleKit }, { returnDocument: "after" })

    if (!result) {
      return NextResponse.json({ error: "Bundle kit not found" }, { status: 404 })
    }

    // Convert MongoDB ObjectId to string for response
    return NextResponse.json({
      ...result,
      _id: result._id.toString(),
      products: result.products.map((product: any) => ({
        ...product,
        _id: product._id.toString(),
      })),
    })
  } catch (error) {
    console.error("Error updating bundle kit:", error)
    return NextResponse.json({ error: "Failed to update bundle kit" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid bundle kit ID" }, { status: 400 })
    }

    const db = await connectToDatabase()

    // Check if bundle kit exists
    const bundleKit = await db.collection("bundleKits").findOne({ _id: new ObjectId(id) })

    if (!bundleKit) {
      return NextResponse.json({ error: "Bundle kit not found" }, { status: 404 })
    }

    // Delete bundle kit
    await db.collection("bundleKits").deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ message: "Bundle kit deleted successfully" })
  } catch (error) {
    console.error("Error deleting bundle kit:", error)
    return NextResponse.json({ error: "Failed to delete bundle kit" }, { status: 500 })
  }
}