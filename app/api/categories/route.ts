import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import type { Category, Subcategory } from '@/lib/types'

function formatSubcategory(sub: any): Subcategory {
  return {
    _id: sub._id ? sub._id.toString() : new ObjectId().toString(),
    name: sub.name,
    slug: sub.slug,
    description: sub.description || ''
  }
}

function formatCategory(doc: any): Category {
  return {
    _id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    description: doc.description || '',
    image: doc.image || '',
    subcategories: (doc.subcategories || []).map(formatSubcategory),
    createdAt: doc.createdAt || new Date(),
    updatedAt: doc.updatedAt || new Date()
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    
    const db = await connectToDatabase()
    
    if (slug) {
      const category = await db.collection("categories").findOne({ slug })
      if (!category) return NextResponse.json([], { status: 404 })
      return NextResponse.json([formatCategory(category)])
    }
    
    const categories = await db.collection("categories").find({}).toArray()
    return NextResponse.json(categories.map(formatCategory))
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const db = await connectToDatabase()
    
    const now = new Date()
    const doc = {
      ...body,
      createdAt: now,
      updatedAt: now,
      subcategories: body.subcategories.map((sub: any) => ({
        ...sub,
        _id: new ObjectId()
      }))
    }
    
    const result = await db.collection("categories").insertOne(doc)
    const newCategory = await db.collection("categories").findOne({ _id: result.insertedId })
    
    return NextResponse.json(formatCategory(newCategory))
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
