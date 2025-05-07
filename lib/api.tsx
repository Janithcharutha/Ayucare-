
import type { Category } from "@/lib/types"

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
        cache: 'no-store',
      next: { revalidate: 3600 },
    })

    if (!res.ok) throw new Error("Failed to fetch categories")
    return await res.json()
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}
