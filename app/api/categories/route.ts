import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const db = await connectToDatabase()
    const categories = await db.collection("categories").find({}).toArray()

    // Convert MongoDB ObjectId to string for each category and subcategory
    const formattedCategories = categories.map((category) => ({
      ...category,
      _id: category._id.toString(),
      subcategories: category.subcategories.map((subcategory: any) => ({
        ...subcategory,
        _id: subcategory._id.toString(),
      })),
    }))

    return NextResponse.json(formattedCategories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, description, subcategories, image } = body

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 })
    }

    // Check if category with the same slug already exists
    const db = await connectToDatabase()
    const existingCategory = await db.collection("categories").findOne({ slug })

    if (existingCategory) {
      return NextResponse.json({ error: "Category with this slug already exists" }, { status: 400 })
    }

    // Add _id to each subcategory
    const subcategoriesWithIds = (subcategories || []).map((subcategory: any) => ({
      ...subcategory,
      _id: new ObjectId(),
    }))

    // Create new category
    const newCategory = {
      name,
      slug,
      description: description || "",
      image: image || "",
      subcategories: subcategoriesWithIds,
      createdAt: new Date(),
    }

    const result = await db.collection("categories").insertOne(newCategory)

    // Return the created category with string IDs
    return NextResponse.json({
      ...newCategory,
      _id: result.insertedId.toString(),
      subcategories: subcategoriesWithIds.map((subcategory: any) => ({
        ...subcategory,
        _id: subcategory._id.toString(),
      })),
    })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
