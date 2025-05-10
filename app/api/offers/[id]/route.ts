import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid offer ID" }, { status: 400 })
    }

    const db = await connectToDatabase()
    const offer = await db.collection("offers").findOne({ _id: new ObjectId(id) })

    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    }

    // Convert MongoDB ObjectId to string
    return NextResponse.json({
      ...offer,
      _id: offer._id.toString(),
      productId: offer.productId.toString(),
    })
  } catch (error) {
    console.error("Error fetching offer:", error)
    return NextResponse.json({ error: "Failed to fetch offer" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { discountPercentage, startDate, endDate, status } = body

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid offer ID" }, { status: 400 })
    }

    // Validate required fields
    if (!discountPercentage || !startDate || !endDate) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 })
    }

    const db = await connectToDatabase()

    // Get the current offer
    const currentOffer = await db.collection("offers").findOne({ _id: new ObjectId(id) })

    if (!currentOffer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    }

    // Get the product
    const product = await db.collection("products").findOne({ _id: currentOffer.productId })

    if (!product) {
      return NextResponse.json({ error: "Associated product not found" }, { status: 404 })
    }

    // Calculate new discounted price
    const discountedPrice = Math.round(product.price * (1 - Number(discountPercentage) / 100))

    // Update offer
    const updatedOffer = {
      discountPercentage: Number(discountPercentage),
      discountedPrice,
      startDate,
      endDate,
      status: status || "active",
      updatedAt: new Date(),
    }

    const result = await db
      .collection("offers")
      .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: updatedOffer }, { returnDocument: "after" })

    if (!result) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    }

    // Update product with new discounted price if offer is active
    if (status !== "inactive") {
      await db.collection("products").updateOne({ _id: currentOffer.productId }, { $set: { discountedPrice } })
    } else {
      // Remove discount if offer is inactive
      await db.collection("products").updateOne({ _id: currentOffer.productId }, { $set: { discountedPrice: null } })
    }

    // Convert MongoDB ObjectId to string for response
    return NextResponse.json({
      ...result,
      _id: result._id.toString(),
      productId: result.productId.toString(),
    })
  } catch (error) {
    console.error("Error updating offer:", error)
    return NextResponse.json({ error: "Failed to update offer" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid offer ID" }, { status: 400 })
    }

    const db = await connectToDatabase()

    // Get the offer to find the associated product
    const offer = await db.collection("offers").findOne({ _id: new ObjectId(id) })

    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    }

    // Delete offer
    await db.collection("offers").deleteOne({ _id: new ObjectId(id) })

    // Remove discount from product
    await db.collection("products").updateOne({ _id: offer.productId }, { $set: { discountedPrice: null } })

    return NextResponse.json({ message: "Offer deleted successfully" })
  } catch (error) {
    console.error("Error deleting offer:", error)
    return NextResponse.json({ error: "Failed to delete offer" }, { status: 500 })
  }
}
