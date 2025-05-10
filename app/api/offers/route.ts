import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const db = await connectToDatabase()
    const offers = await db.collection("offers").find({}).toArray()

    // Convert MongoDB ObjectId to string for each offer
    const formattedOffers = offers.map((offer) => ({
      ...offer,
      _id: offer._id.toString(),
      productId: offer.productId.toString(),
    }))

    return NextResponse.json(formattedOffers)
  } catch (error) {
    console.error("Error fetching offers:", error)
    return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, discountPercentage, startDate, endDate } = body

    // Validate required fields
    if (!productId || !discountPercentage || !startDate || !endDate) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 })
    }

    const db = await connectToDatabase()

    // Check if product exists
    if (!ObjectId.isValid(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 })
    }

    const product = await db.collection("products").findOne({ _id: new ObjectId(productId) })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if offer for this product already exists
    const existingOffer = await db.collection("offers").findOne({ productId: new ObjectId(productId) })

    if (existingOffer) {
      return NextResponse.json({ error: "Offer for this product already exists" }, { status: 400 })
    }

    // Calculate discounted price
    const discountedPrice = Math.round(product.price * (1 - Number(discountPercentage) / 100))

    // Create new offer
    const newOffer = {
      productId: new ObjectId(productId),
      productName: product.name,
      productSlug: product.slug,
      productImage: product.images?.[0] || null,
      originalPrice: product.price,
      discountedPrice,
      discountPercentage: Number(discountPercentage),
      startDate,
      endDate,
      status: "active",
      createdAt: new Date(),
    }

    const result = await db.collection("offers").insertOne(newOffer)

    // Update product with discounted price
    await db.collection("products").updateOne({ _id: new ObjectId(productId) }, { $set: { discountedPrice } })

    // Return the created offer with string ID
    return NextResponse.json({
      ...newOffer,
      _id: result.insertedId.toString(),
      productId: productId,
    })
  } catch (error) {
    console.error("Error creating offer:", error)
    return NextResponse.json({ error: "Failed to create offer" }, { status: 500 })
  }
}
