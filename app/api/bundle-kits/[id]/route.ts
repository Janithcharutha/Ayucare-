import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import type { BundleProduct } from '@/types/bundle-kit'

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
    const db = await connectToDatabase()
    const body = await request.json()
    // ...rest of your PUT logic...
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
    // ...rest of your DELETE logic...
  } catch (error) {
    console.error("Error deleting bundle kit:", error)
    return NextResponse.json({ error: "Failed to delete bundle kit" }, { status: 500 })
  }
}