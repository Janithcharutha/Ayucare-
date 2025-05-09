import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const db = await connectToDatabase()
    const bundleKits = await db.collection("bundleKits").find({}).toArray()

    // Convert MongoDB ObjectId to string for each bundle kit
    const formattedBundleKits = bundleKits.map((bundle) => ({
      ...bundle,
      _id: bundle._id.toString(),
      products: bundle.products.map((product: any) => ({
        ...product,
        productId: product.productId.toString(),
      })),
    }))

    return NextResponse.json(formattedBundleKits)
  } catch (error) {
    console.error("Error fetching bundle kits:", error)
    return NextResponse.json({ error: "Failed to fetch bundle kits" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, slug, description, price, discountedPrice, images, products, featured, status } = body

    // Validate required fields
    if (!name || !slug || !products || products.length === 0) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 })
    }

    // Check if bundle kit with the same slug already exists
    const db = await connectToDatabase()
    const existingBundle = await db.collection("bundleKits").findOne({ slug })

    if (existingBundle) {
      return NextResponse.json({ error: "Bundle kit with this slug already exists" }, { status: 400 })
    }

    // Convert product IDs to ObjectId
    const processedProducts = products.map((product: any) => ({
      ...product,
      productId: typeof product.productId === "string" ? new ObjectId(product.productId) : product.productId,
    }))

    // Create new bundle kit
    const newBundleKit = {
      name,
      slug,
      description: description || "",
      price: Number(price),
      discountedPrice: discountedPrice ? Number(discountedPrice) : null,
      images: images || [],
      products: processedProducts,
      featured: featured || false,
      status: status || "active",
      createdAt: new Date(),
    }

    const result = await db.collection("bundleKits").insertOne(newBundleKit)

    // Return the created bundle kit with string IDs
    return NextResponse.json({
      ...newBundleKit,
      _id: result.insertedId.toString(),
      products: processedProducts.map((product: any) => ({
        ...product,
        productId: product.productId.toString(),
      })),
    })
  } catch (error) {
    console.error("Error creating bundle kit:", error)
    return NextResponse.json({ error: "Failed to create bundle kit" }, { status: 500 })
  }
}
