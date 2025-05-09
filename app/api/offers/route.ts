import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const db = await connectToDatabase()
    
    const offers = await db
      .collection("offers")
      .aggregate([
        {
          $match: { 
            status: "active",
            startDate: { 
              $lte: new Date().toISOString().split('T')[0]
            },
            endDate: { 
              $gte: new Date().toISOString().split('T')[0]
            }
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
            productId: 1,
            discountPercentage: 1,
            discountedPrice: 1,
            startDate: 1,
            endDate: 1,
            status: 1,
            createdAt: 1,
            productName: "$product.name",
            productSlug: "$product.slug",
            productCategory: "$product.category",
            productCategoryName: "$product.categoryName",
            productImage: { $first: "$product.images" },
            originalPrice: "$product.price",
            productDescription: "$product.description"
          }
        }
      ])
      .toArray()

    const transformedOffers = offers.map(offer => ({
      ...offer,
      _id: offer._id.toString(),
      productId: offer.productId.toString(),
      productImage: Array.isArray(offer.productImage) 
        ? offer.productImage.map((img: string) => 
            img.startsWith('http') ? img : `${process.env.NEXT_PUBLIC_STORAGE_URL}${img}`
          )
        : offer.productImage 
          ? [offer.productImage].map((img: string) => 
              img.startsWith('http') ? img : `${process.env.NEXT_PUBLIC_STORAGE_URL}${img}`
            )
          : [],
      startDate: new Date(offer.startDate).toISOString().split('T')[0],
      endDate: new Date(offer.endDate).toISOString().split('T')[0]
    }))

    return NextResponse.json(transformedOffers)
  } catch (error) {
    console.error("Error fetching offers:", error)
    return NextResponse.json(
      { error: "Failed to fetch offers" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const db = await connectToDatabase()
    const { productId, discountPercentage, startDate, endDate } = await request.json()

    // Validate required fields
    if (!productId || !discountPercentage || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Get product details
    const product = await db.collection("products").findOne({ 
      _id: new ObjectId(productId) 
    })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Calculate discounted price
    const discountedPrice = Math.round(
      product.price * (1 - discountPercentage / 100)
    )

    const newOffer = {
      productId: new ObjectId(productId),
      discountPercentage,
      discountedPrice,
      startDate,
      endDate,
      status: "active",
      createdAt: new Date()
    }

    const result = await db.collection("offers").insertOne(newOffer)

    // Update product with discounted price
    await db.collection("products").updateOne(
      { _id: new ObjectId(productId) },
      { $set: { discountedPrice } }
    )

    return NextResponse.json({
      ...newOffer,
      _id: result.insertedId.toString(),
      productId: productId
    })
  } catch (error) {
    console.error("Error creating offer:", error)
    return NextResponse.json(
      { error: "Failed to create offer" },
      { status: 500 }
    )
  }
}
