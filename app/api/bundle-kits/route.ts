import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { BundleKit, BundleProduct } from "@/types/bundle-kit"

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
    const db = await connectToDatabase()
    const bundle = await request.json()

    // Validate required fields
    if (!bundle.name || !bundle.products?.length) {
      return NextResponse.json(
        { error: "Name and products are required" },
        { status: 400 }
      )
    }

    // Process products and ensure proper ObjectId conversion
    const processedProducts = bundle.products.map((product: BundleProduct) => {
      try {
        return {
          ...product,
          productId: new ObjectId(product.productId as string),
          quantity: Number(product.quantity),
          price: Number(product.price)
        }
      } catch (error) {
        throw new Error(`Invalid product ID format: ${product.productId}`)
      }
    })

    const newBundle = {
      name: bundle.name,
      slug: bundle.slug,
      description: bundle.description || "",
      price: Number(bundle.price),
      discountedPrice: bundle.discountedPrice ? Number(bundle.discountedPrice) : null,
      images: bundle.images || [],
      products: processedProducts,
      featured: Boolean(bundle.featured),
      status: bundle.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const result = await db.collection("bundleKits").insertOne(newBundle)

    if (!result.insertedId) {
      throw new Error("Failed to create bundle kit")
    }

    const createdBundle = await db.collection("bundleKits").findOne(
      { _id: result.insertedId }
    )

    if (!createdBundle) {
      throw new Error("Failed to fetch created bundle kit")
    }

    const formattedBundle = {
      ...createdBundle,
      _id: createdBundle._id.toString(),
      products: createdBundle.products.map((product: any) => ({
        ...product,
        productId: product.productId.toString()
      }))
    }

    return NextResponse.json(formattedBundle, { status: 201 })
  } catch (error) {
    console.error("Error creating bundle kit:", error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to create bundle kit"
      }, 
      { status: 500 }
    )
  }
}

// export async function PUT(request: Request) {
//   try {
//     const body = await request.json()
//     const { _id, name, slug, description, price, discountedPrice, images, products, featured, status } = body

//     // Validate required fields
//     if (!_id || !name || !slug || !products || products.length === 0) {
//       return NextResponse.json({ error: "Required fields are missing" }, { status: 400 })
//     }

//     const db = await connectToDatabase()

//     // Convert product IDs to ObjectId
//     const processedProducts = products.map((product: any) => ({
//       ...product,
//       productId: typeof product.productId === "string" ? new ObjectId(product.productId) : product.productId,
//     }))

//     const updateResult = await db.collection("bundleKits").findOneAndUpdate(
//       { _id: new ObjectId(_id) },
//       {
//         $set: {
//           name,
//           slug,
//           description: description || "",
//           price: Number(price),
//           discountedPrice: discountedPrice ? Number(discountedPrice) : null,
//           images: images || [],
//           products: processedProducts,
//           featured: featured || false,
//           status: status || "active",
//           updatedAt: new Date(),
//         }
//       },
//       { returnDocument: 'after' }
//     )

//     if (!updateResult || !updateResult.value) {
//       return NextResponse.json({ error: "Bundle kit not found" }, { status: 404 })
//     }

//     // Format the response
//     const formattedBundle = {
//       ...updateResult.value,
//       _id: updateResult.value._id.toString(),
//       products: updateResult.value.products.map((product: any) => ({
//         ...product,
//         productId: product.productId.toString(),
//       }))
//     }

//     return NextResponse.json(formattedBundle)
//   } catch (error) {
//     console.error("Error updating bundle kit:", error)
//     return NextResponse.json({ error: "Failed to update bundle kit" }, { status: 500 })
//   }
// }
