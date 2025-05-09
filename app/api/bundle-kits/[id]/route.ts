import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid category ID" }, { status: 400 })
    }

    const db = await connectToDatabase()
    const category = await db.collection("categories").findOne({ _id: new ObjectId(id) })

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // Convert MongoDB ObjectId to string
    return NextResponse.json({
      ...category,
      _id: category._id.toString(),
      subcategories: category.subcategories.map((subcategory: any) => ({
        ...subcategory,
        _id: subcategory._id.toString(),
      })),
    })
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params
    const body = await request.json()
    const { name, slug, description, subcategories, image } = body

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid category ID" }, { status: 400 })
    }

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 })
    }

    const db = await connectToDatabase()

    // Check if another category with the same slug exists (excluding this one)
    const existingCategory = await db.collection("categories").findOne({ slug, _id: { $ne: new ObjectId(id) } })

    if (existingCategory) {
      return NextResponse.json({ error: "Another category with this slug already exists" }, { status: 400 })
    }

    // Process subcategories to ensure they all have _id
    const processedSubcategories = (subcategories || []).map((subcategory: any) => {
      if (subcategory._id) {
        // If it's a string, convert to ObjectId
        return {
          ...subcategory,
          _id: typeof subcategory._id === "string" ? new ObjectId(subcategory._id) : subcategory._id,
        }
      }
      // If no _id, create a new one
      return {
        ...subcategory,
        _id: new ObjectId(),
      }
    })

    // Update category
    const updatedCategory = {
      name,
      slug,
      description: description || "",
      image: image || "",
      subcategories: processedSubcategories,
      updatedAt: new Date(),
    }

    const result = await db
      .collection("categories")
      .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: updatedCategory }, { returnDocument: "after" })

    if (!result) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // Convert MongoDB ObjectId to string for response
    return NextResponse.json({
      ...result,
      _id: result._id.toString(),
      subcategories: result.subcategories.map((subcategory: any) => ({
        ...subcategory,
        _id: subcategory._id.toString(),
      })),
    })
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid category ID" }, { status: 400 })
    }

    const db = await connectToDatabase()

    // Check if category exists
    const category = await db.collection("categories").findOne({ _id: new ObjectId(id) })

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // Delete category
    await db.collection("categories").deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ message: "Category deleted successfully" })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}
