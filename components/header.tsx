"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingBag, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type FC } from "react"
import { usePathname } from "next/navigation"

interface Subcategory {
  _id: string
  name: string
  slug: string
  description?: string
}

interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  subcategories: Subcategory[]
}

const Header: FC = () => {
  const [isProductsOpen, setIsProductsOpen] = useState(false)
  const [isBranchesOpen, setIsBranchesOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const pathname = usePathname()

  // Check if current path is an admin route
  const isAdminRoute = pathname?.startsWith('/admin')

  // Don't render header in admin routes
  if (isAdminRoute) return null

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/categories')
        if (!response.ok) throw new Error('Failed to fetch categories')
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch categories')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-beige-light">
      {/* Top bar */}
      <div className="flex justify-center items-center py-2 border-b border-beige-dark">

      </div>
      <div className="absolute top-10 left-8">
      <div className="flex gap-4">
          <Button variant="outline" className="rounded-full text-xs h-8 px-4 border-black">
            ISLANDWIDE DELIVERY
          </Button>
          <Button variant="outline" className="rounded-full text-xs h-8 px-4 border-black">
            OFFERS
          </Button>
          <Button variant="outline" className="rounded-full text-xs h-8 px-4 border-black">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Logo */}
      <div className="flex justify-center py-4">
  <Link href="/">
    <Image
      src="/logo1.png"
      alt="Ayucare Natural Beauty Products"
      width={180}
      height={80}
      className="h-auto scale-[1.5]"
    />
  </Link>
</div>

      {/* Cart */}
      <div className="absolute top-10 right-8">
        <Link href="/cart" className="flex items-center gap-2 text-sm font-medium">
          <span>CART</span>
          <span className="text-sm">/ RS.0.00</span>
          <ShoppingBag className="h-4 w-4" />
        </Link>
      </div>

      {/* Main navigation */}
      <nav className="border-t border-b border-beige-dark">
        <ul className="flex justify-center items-center gap-6 py-4 text-sm">
        <li>
            <Link href="/" className="hover:text-gray-600 transition-colors">
              HOME
            </Link>
          </li>
          <li>
            <Link href="/shop" className="hover:text-gray-600 transition-colors">
              SHOP
            </Link>
          </li>
          
           <li
              className="relative dropdown"
              onMouseEnter={() => setIsProductsOpen(true)}
              onMouseLeave={() => setIsProductsOpen(false)}
               >
              <Link href="/products" className="flex items-center hover:text-gray-600 transition-colors">
                PRODUCTS <ChevronDown className="h-4 w-4 ml-1" />
              </Link>

              {isProductsOpen && (
                <div className="dropdown-menu bg-white shadow-md p-6 min-w-[600px] z-50 grid grid-cols-3 gap-6">
                  {categories.map((category: Category) => (
                    <div key={category._id}>
                      <h3 className="font-medium mb-4">
                        <Link href={`/products/${category.slug}`} className="hover:text-gray-600">
                          {category.name}
                        </Link>
                      </h3>
                      <ul className="space-y-3">
                        {category.subcategories.map((subcategory: Subcategory) => (
                          <li key={subcategory._id}>
                            <Link
                              href={`/products/${category.slug}/${subcategory.slug}`}
                              className="block text-gray-600 hover:text-black"
                            >
                              {subcategory.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
          </li>
          
          <li>
            <Link href="/offers" className="hover:text-gray-600 transition-colors">
              OFFERS
            </Link>
          </li>
          <li>
            <Link href="/bundle-kits" className="hover:text-gray-600 transition-colors">
              BUNDLE KITS
            </Link>
          </li>
          {/* <li>
            <Link href="/gifting" className="hover:text-gray-600 transition-colors">
              GIFTING
            </Link>
          </li> */}
          <li
            className="relative dropdown"
            onMouseEnter={() => setIsBranchesOpen(true)}
            onMouseLeave={() => setIsBranchesOpen(false)}
          >
            <button className="flex items-center hover:text-gray-600 transition-colors">
              BRANCHES <ChevronDown className="h-4 w-4 ml-1" />
            </button>
            {isBranchesOpen && (
              <div className="dropdown-menu bg-white shadow-md p-4 min-w-[200px] z-50">
                <ul className="space-y-2">
                  <li>
                    <Link href="/branches/colombo" className="block hover:text-gray-600">
                      Colombo
                    </Link>
                  </li>
                  <li>
                    <Link href="/branches/kandy" className="block hover:text-gray-600">
                      Kandy
                    </Link>
                  </li>
                  <li>
                    <Link href="/branches/galle" className="block hover:text-gray-600">
                      Galle
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </li>
          <li>
            <Link 
              href="/about"
              className={`transition-colors ${
                pathname === '/about' 
                  ? 'text-black font-medium' 
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              ABOUT
            </Link>
          </li>
          <li>
            <Link href="/login" className="bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors">
              LOGIN / REGISTER
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
