import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const db = await connectToDatabase()
    
    // Don't await params.productId directly, it's already available
    const offer = await db.collection("offers").aggregate([
      {
        $match: {
          productId: new ObjectId(params.productId),
          status: "active",
          startDate: { $lte: new Date().toISOString().split('T')[0] },
          endDate: { $gte: new Date().toISOString().split('T')[0] }
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 1,
          discountedPrice: 1,
          discountPercentage: 1,
          product: 1
        }
      }
    ]).toArray()

    if (!offer[0]) {
      return NextResponse.json(
        { error: "No active offer found for this product" },
        { status: 404 }
      )
    }

    return NextResponse.json(offer[0])
  } catch (error) {
    console.error("Error fetching offer:", error)
    return NextResponse.json(
      { error: "Failed to fetch offer" },
      { status: 500 }
    )
  }
}