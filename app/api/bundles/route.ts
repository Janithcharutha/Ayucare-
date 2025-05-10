import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await connectToDatabase()
    const bundles = await db
      .collection("bundles")
      .find({ status: "active" })
      .toArray()

    return NextResponse.json(bundles)
  } catch (error) {
    console.error("Error fetching bundles:", error)
    return NextResponse.json(
      { error: "Failed to fetch bundles" },
      { status: 500 }
    )
  }
}