import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectToDatabase()
    
    if (!params.id || !ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid bundle kit ID" },
        { status: 400 }
      )
    }

    const bundleKit = await db.collection("bundleKits")
      .findOne({ _id: new ObjectId(params.id) })

    if (!bundleKit) {
      return NextResponse.json(
        { error: "Bundle kit not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...bundleKit,
      _id: bundleKit._id.toString()
    })
  } catch (error) {
    console.error("Error fetching bundle kit:", error)
    return NextResponse.json(
      { error: "Failed to fetch bundle kit" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectToDatabase()
    const body = await request.json()

    if (!params.id || !ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid bundle kit ID" },
        { status: 400 }
      )
    }

    const updatedBundleKit = await db.collection("bundleKits")
      .findOneAndUpdate(
        { _id: new ObjectId(params.id) },
        { $set: { ...body, updatedAt: new Date() } },
        { returnDocument: 'after' }
      )

    if (!updatedBundleKit) {
      return NextResponse.json(
        { error: "Bundle kit not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...updatedBundleKit,
      _id: updatedBundleKit._id.toString()
    })
  } catch (error) {
    console.error("Error updating bundle kit:", error)
    return NextResponse.json(
      { error: "Failed to update bundle kit" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectToDatabase()

    if (!params.id || !ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid bundle kit ID" },
        { status: 400 }
      )
    }

    const result = await db.collection("bundleKits")
      .deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Bundle kit not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting bundle kit:", error)
    return NextResponse.json(
      { error: "Failed to delete bundle kit" },
      { status: 500 }
    )
  }
}
