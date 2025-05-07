import { ObjectId } from 'mongodb'

export interface Subcategory {
  _id: string | ObjectId
  name: string
  title?: string // Added title as optional
  slug: string
  description?: string
}

export interface Category {
  _id: string | ObjectId
  name: string
  title?: string // Added title as optional
  slug: string
  description?: string
  image?: string
  subcategories: Subcategory[]
  createdAt?: Date
  updatedAt?: Date
}

export interface Product {
  _id: string
  name: string
  slug: string
  description: string
  price: number
  images: string[]
  category: string
  categoryName: string
  subcategory: string
  subcategoryName: string
  stock: number
  featured: boolean
  status: string
}