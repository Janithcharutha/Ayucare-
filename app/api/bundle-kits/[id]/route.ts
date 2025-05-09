import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

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
      products: bundleKit.products.map((product: any) => ({
        ...product,
        productId: product.productId.toString(),
      })),
    })
  } catch (error) {
    console.error("Error fetching bundle kit:", error)
    return NextResponse.json({ error: "Failed to fetch bundle kit" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, slug, description, price, discountedPrice, images, products, featured, status } = body

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid bundle kit ID" }, { status: 400 })
    }

    // Validate required fields
    if (!name || !slug || !products || products.length === 0) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 })
    }

    const db = await connectToDatabase()

    // Check if another bundle kit with the same slug exists (excluding this one)
    const existingBundle = await db.collection("bundleKits").findOne({ slug, _id: { $ne: new ObjectId(id) } })

    if (existingBundle) {
      return NextResponse.json({ error: "Another bundle kit with this slug already exists" }, { status: 400 })
    }

    // Convert product IDs to ObjectId
    const processedProducts = products.map((product: any) => ({
      ...product,
      productId: typeof product.productId === "string" ? new ObjectId(product.productId) : product.productId,
    }))

    // Update bundle kit
    const updatedBundleKit = {
      name,
      slug,
      description: description || "",
      price: Number(price),
      discountedPrice: discountedPrice ? Number(discountedPrice) : null,
      images: images || [],
      products: processedProducts,
      featured: featured || false,
      status: status || "active",
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
        productId: product.productId.toString(),
      })),
    })
  } catch (error) {
    console.error("Error updating bundle kit:", error)
    return NextResponse.json({ error: "Failed to update bundle kit" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

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
