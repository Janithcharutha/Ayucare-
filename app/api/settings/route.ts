import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const db = await connectToDatabase()
    const settings = await db.collection("settings").findOne({})

    if (!settings) {
      return NextResponse.json({ error: "Settings not found" }, { status: 404 })
    }

    // Convert MongoDB ObjectId to string
    return NextResponse.json({
      ...settings,
      _id: settings._id.toString(),
    })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Create new settings
    const db = await connectToDatabase()
    const result = await db.collection("settings").insertOne({
      ...body,
      createdAt: new Date(),
    })

    // Return the created settings with string ID
    return NextResponse.json({
      ...body,
      _id: result.insertedId.toString(),
    })
  } catch (error) {
    console.error("Error creating settings:", error)
    return NextResponse.json({ error: "Failed to create settings" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { _id, ...settings } = body

    if (!_id || !ObjectId.isValid(_id)) {
      return NextResponse.json({ error: "Invalid settings ID" }, { status: 400 })
    }

    // Update settings
    const db = await connectToDatabase()
    const result = await db
      .collection("settings")
      .findOneAndUpdate(
        { _id: new ObjectId(_id) },
        { $set: { ...settings, updatedAt: new Date() } },
        { returnDocument: "after" },
      )

    if (!result) {
      return NextResponse.json({ error: "Settings not found" }, { status: 404 })
    }

    // Convert MongoDB ObjectId to string for response
    return NextResponse.json({
      ...result,
      _id: result._id.toString(),
    })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
