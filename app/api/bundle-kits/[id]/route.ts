import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import type { BundleKit, BundleProduct } from '@/types/bundle-kit'

// Define the params type
type RouteParams = {
  params: { id: string },
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const db = await connectToDatabase()

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid bundle kit ID" }, { status: 400 })
    }

    const bundleKit = await db.collection("bundleKits").findOne({ _id: new ObjectId(id) })

    if (!bundleKit) {
      return NextResponse.json({ error: "Bundle kit not found" }, { status: 404 })
    }

    return NextResponse.json({
      ...bundleKit,
      _id: bundleKit._id.toString()
    })
  } catch (error) {
    console.error("Error fetching bundle kit:", error)
    return NextResponse.json({ error: "Failed to fetch bundle kit" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid bundle kit ID" }, { status: 400 })
    }
    const db = await connectToDatabase()
    const body = await request.json()
    const { _id, createdAt, updatedAt, ...updateData } = body
    const processedProducts = updateData.products?.map((product: BundleProduct) => ({
      ...product,
      productId: new ObjectId(product.productId),
      quantity: Math.max(1, Number(product.quantity) || 1),
      price: Math.max(0, Number(product.price) || 0)
    })) || []
    const result = await db.collection("bundleKits").findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: updateData.name,
          slug: updateData.slug,
          description: updateData.description || "",
          price: Number(updateData.price) || 0,
          discountedPrice: updateData.discountedPrice ? Number(updateData.discountedPrice) : null,
          images: Array.isArray(updateData.images) ? updateData.images : [],
          products: processedProducts,
          featured: Boolean(updateData.featured),
          status: updateData.status || 'active',
          updatedAt: new Date().toISOString()
        }
      },
      { returnDocument: 'after' }
    )
    if (!result?.value) {
      return NextResponse.json({ error: "Bundle kit not found" }, { status: 404 })
    }
    return NextResponse.json({
      ...result.value,
      _id: result.value._id.toString(),
      products: result.value.products.map((product: BundleProduct) => ({
        ...product,
        productId: product.productId.toString()
      }))
    })
  } catch (error) {
    console.error("Error updating bundle kit:", error)
    return NextResponse.json({ error: "Failed to update bundle kit" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const db = await connectToDatabase()
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid bundle kit ID" }, { status: 400 })
    }
    const result = await db.collection("bundleKits").deleteOne({ _id: new ObjectId(id) })
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Bundle kit not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting bundle kit:", error)
    return NextResponse.json({ error: "Failed to delete bundle kit" }, { status: 500 })
  }
}
