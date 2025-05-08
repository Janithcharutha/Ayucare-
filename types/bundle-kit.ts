import { ObjectId } from 'mongodb'

export interface BundleProduct {
  productId: string | ObjectId
  productName: string
  quantity: number
  price: number
}

export interface BundleKit {
  _id?: string | ObjectId
  name: string
  slug: string
  description?: string
  price: number
  discountedPrice?: number | null
  images: string[]
  products: BundleProduct[]
  featured: boolean
  status: 'active' | 'inactive'
  createdAt?: string
  updatedAt?: string
}