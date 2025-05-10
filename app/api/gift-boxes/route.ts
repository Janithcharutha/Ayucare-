import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const db = await connectToDatabase()
    const giftBoxes = await db.collection("giftBoxes").find({}).toArray()

    // Convert MongoDB ObjectId to string for each gift box
    const formattedGiftBoxes = giftBoxes.map((giftBox) => ({
      ...giftBox,
      _id: giftBox._id.toString(),
      products: giftBox.products.map((product: any) => ({
        ...product,
        productId: product.productId.toString(),
      })),
    }))

    return NextResponse.json(formattedGiftBoxes)
  } catch (error) {
    console.error("Error fetching gift boxes:", error)
    return NextResponse.json({ error: "Failed to fetch gift boxes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, description, price, discountedPrice, images, products, featured, status, isCustomizable } = body

    // Validate required fields
    if (!name || !slug || !products || products.length === 0) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 })
    }

    // Check if gift box with the same slug already exists
    const db = await connectToDatabase()
    const existingGiftBox = await db.collection("giftBoxes").findOne({ slug })

    if (existingGiftBox) {
      return NextResponse.json({ error: "Gift box with this slug already exists" }, { status: 400 })
    }

    // Convert product IDs to ObjectId
    const processedProducts = products.map((product: any) => ({
      ...product,
      productId: typeof product.productId === "string" ? new ObjectId(product.productId) : product.productId,
    }))

    // Create new gift box
    const newGiftBox = {
      name,
      slug,
      description: description || "",
      price: Number(price),
      discountedPrice: discountedPrice ? Number(discountedPrice) : null,
      images: images || [],
      products: processedProducts,
      featured: featured || false,
      status: status || "active",
      isCustomizable: isCustomizable || false,
      createdAt: new Date(),
    }

    const result = await db.collection("giftBoxes").insertOne(newGiftBox)

    // Return the created gift box with string IDs
    return NextResponse.json({
      ...newGiftBox,
      _id: result.insertedId.toString(),
      products: processedProducts.map((product: any) => ({
        ...product,
        productId: product.productId.toString(),
      })),
    })
  } catch (error) {
    console.error("Error creating gift box:", error)
    return NextResponse.json({ error: "Failed to create gift box" }, { status: 500 })
  }
}
