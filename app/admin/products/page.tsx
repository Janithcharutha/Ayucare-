"use client"

import React, { useState, useEffect, type ChangeEvent } from "react"
import Image from "next/image"
import { Plus, Search, Filter, Edit, Trash2, Loader2, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { ImageUpload } from "@/components/image-upload"

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

// Add type for event handlers
type InputChangeEvent = ChangeEvent<HTMLInputElement>
type TextareaChangeEvent = ChangeEvent<HTMLTextAreaElement>
type SelectChangeEvent = ChangeEvent<HTMLSelectElement>

interface Category {
  _id: string
  name: string
  slug: string
  subcategories: {
    _id: string
    name: string
    slug: string
  }[]
}

interface Product {
  _id?: string
  name: string
  slug: string
  description: string
  price: number
  discountedPrice?: number | null
  images: string[]
  category: string
  categoryName?: string
  subcategory: string
  subcategoryName?: string
  stock: number
  featured: boolean
  status: string
  // Add new fields
  keyIngredients: {
    name: string
    benefits: string[]
  }[]
  keyBenefits: string[]
}

export default function ProductsPage() {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // State for new product
  const [newProduct, setNewProduct] = useState<Product>({
    name: "",
    slug: "",
    description: "",
    price: 0,
    discountedPrice: null,
    images: [],
    category: "",
    subcategory: "",
    stock: 0,
    featured: false,
    status: "active",
    keyIngredients: [],
    keyBenefits: [],
  })

  // State for editing product
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch categories
        const categoriesResponse = await fetch("/api/categories")
        const categoriesData = await categoriesResponse.json()

        if (!categoriesResponse.ok) {
          throw new Error(categoriesData.error || "Failed to fetch categories")
        }

        setCategories(categoriesData)

        // Fetch products
        const productsResponse = await fetch("/api/products")
        const productsData = await productsResponse.json()

        if (!productsResponse.ok) {
          throw new Error(productsData.error || "Failed to fetch products")
        }

        setProducts(productsData)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  // Get subcategories for selected category
  const getSubcategories = (categoryId: string) => {
    const category = categories.find((c) => c._id === categoryId)
    return category ? category.subcategories : []
  }

  // Add new product
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.subcategory) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setIsAdding(true)

      // Find category and subcategory names
      const category = categories.find((c) => c._id === newProduct.category)
      const subcategory = category?.subcategories.find((s) => s._id === newProduct.subcategory)

      const productToAdd = {
        ...newProduct,
        slug: newProduct.slug || generateSlug(newProduct.name),
        categoryName: category?.name,
        subcategoryName: subcategory?.name,
      }

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productToAdd),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to add product")
      }

      const data = await response.json()
      setProducts([...products, data])
      
      // Reset form
      setNewProduct({
        name: "",
        slug: "",
        description: "",
        price: 0,
        discountedPrice: null,
        images: [],
        category: "",
        subcategory: "",
        stock: 0,
        featured: false,
        status: "active",
        keyIngredients: [],
        keyBenefits: [],
      })

      // Close dialog
      setIsDialogOpen(false)

      toast({
        title: "Success",
        description: "Product added successfully",
      })
    } catch (err) {
      console.error("Error adding product:", err)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to add product",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  // Update product
  const handleUpdateProduct = async () => {
    if (editProduct && editProduct._id) {
      try {
        setIsEditing(true)

        // Find category and subcategory names
        const category = categories.find((c) => c._id === editProduct.category)
        const subcategory = category?.subcategories.find((s) => s._id === editProduct.subcategory)

        const productToUpdate = {
          ...editProduct,
          categoryName: category?.name,
          subcategoryName: subcategory?.name,
        }

        const response = await fetch(`/api/products/${editProduct._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productToUpdate),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to update product")
        }

        setProducts(products.map((product) => (product._id === editProduct._id ? data : product)))
        setEditProduct(null)

        toast({
          title: "Success",
          description: "Product updated successfully",
        })
      } catch (err) {
        console.error("Error updating product:", err)
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to update product",
          variant: "destructive",
        })
      } finally {
        setIsEditing(false)
      }
    }
  }

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Failed to delete product")
        }

        setProducts(products.filter((product) => product._id !== id))

        toast({
          title: "Success",
          description: "Product deleted successfully",
        })
      } catch (err) {
        console.error("Error deleting product:", err)
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to delete product",
          variant: "destructive",
        })
      }
    }
  }

  // Filter products based on search term and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-md">
        <h2 className="text-lg font-medium mb-2">Error</h2>
        <p>{error}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>Create a new product for your store.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => {
                      setNewProduct({
                        ...newProduct,
                        name: e.target.value,
                        slug: generateSlug(e.target.value),
                      })
                    }}
                    placeholder="e.g. Kasthuri Kaha Night Cream"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="slug">Product Slug</Label>
                  <Input
                    id="slug"
                    value={newProduct.slug}
                    onChange={(e) => setNewProduct({ ...newProduct, slug: e.target.value })}
                    placeholder="e.g. kasthuri-kaha-night-cream"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value, subcategory: "" })}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <select
                    id="subcategory"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newProduct.subcategory}
                    onChange={(e) => setNewProduct({ ...newProduct, subcategory: e.target.value })}
                    disabled={!newProduct.category}
                  >
                    <option value="">Select a subcategory</option>
                    {newProduct.category &&
                      getSubcategories(newProduct.category).map((subcategory) => (
                        <option key={subcategory._id} value={subcategory._id}>
                          {subcategory.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (Rs.)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newProduct.price || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    placeholder="e.g. 4750"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={newProduct.stock || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                    placeholder="e.g. 20"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Enter product description..."
                  rows={4}
                />
              </div>
              <div className="grid gap-2">
                <Label>Product Images</Label>
                <ImageUpload
                  value={newProduct.images}
                  onChange={(urls) => setNewProduct({ ...newProduct, images: urls })}
                  onRemove={(url) =>
                    setNewProduct({
                      ...newProduct,
                      images: newProduct.images.filter((image) => image !== url),
                    })
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={newProduct.featured}
                  onCheckedChange={(checked) => setNewProduct({ ...newProduct, featured: checked })}
                />
                <Label htmlFor="featured">Featured Product</Label>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="keyIngredients">Key Ingredients</Label>
                  <Textarea
                    id="keyIngredients"
                    value={newProduct.keyIngredients.map(ingredient => 
                      `${ingredient.name}\n${ingredient.benefits.map(b => `- ${b}`).join('\n')}`
                    ).join('\n\n')}
                    onChange={(e) => {
                      const text = e.target.value;
                      const ingredients = text.split('\n\n').filter(Boolean).map(group => {
                        const lines = group.split('\n');
                        return {
                          name: lines[0] || '',
                          benefits: lines.slice(1).map(line => line.replace(/^-\s*/, '').trim()).filter(Boolean)
                        };
                      });
                      setNewProduct({ ...newProduct, keyIngredients: ingredients });
                    }}
                    placeholder={`Enter key ingredients and benefits...\nExample:\nKasthuri Kaha\n- contains antioxidants\n- Effectively removed suntans\n\nAlpha Arbutin\n- reduce dark spots\n- helps remove pigmentation`}
                    rows={8}
                    className="font-mono"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="keyBenefits">Key Benefits</Label>
                  <Textarea
                    id="keyBenefits"
                    value={newProduct.keyBenefits.map(benefit => `- ${benefit}`).join('\n')}
                    onChange={(e) => {
                      const text = e.target.value;
                      const benefits = text
                        .split('\n')
                        .map(line => line.replace(/^-\s*/, '').trim())
                        .filter(Boolean);
                      setNewProduct({ ...newProduct, keyBenefits: benefits });
                    }}
                    placeholder={`Enter key benefits...\nExample:\n- Lightens the skin\n- moisturize and leaves your skin feeling extremely soft\n- very smooth and light texture`}
                    rows={6}
                    className="font-mono"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddProduct} disabled={isAdding}>
                {isAdding ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Product"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={!!editProduct} onOpenChange={(open) => !open && setEditProduct(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product details</DialogDescription>
          </DialogHeader>
          {editProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Product Name</Label>
                  <Input
                    id="edit-name"
                    value={editProduct.name}
                    onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-slug">Product Slug</Label>
                  <Input
                    id="edit-slug"
                    value={editProduct.slug}
                    onChange={(e) => setEditProduct({ ...editProduct, slug: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <select
                    id="edit-category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={editProduct.category}
                    onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value, subcategory: "" })}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-subcategory">Subcategory</Label>
                  <select
                    id="edit-subcategory"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={editProduct.subcategory}
                    onChange={(e) => setEditProduct({ ...editProduct, subcategory: e.target.value })}
                    disabled={!editProduct.category}
                  >
                    <option value="">Select a subcategory</option>
                    {editProduct.category &&
                      getSubcategories(editProduct.category).map((subcategory) => (
                        <option key={subcategory._id} value={subcategory._id}>
                          {subcategory.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-price">Price (Rs.)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={editProduct.price || ""}
                    onChange={(e) => setEditProduct({ ...editProduct, price: Number(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-discounted-price">Discounted Price (Rs.)</Label>
                  <Input
                    id="edit-discounted-price"
                    type="number"
                    value={editProduct.discountedPrice || ""}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        discountedPrice: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-stock">Stock Quantity</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  value={editProduct.stock || ""}
                  onChange={(e) => setEditProduct({ ...editProduct, stock: Number(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editProduct.description || ""}
                  onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="grid gap-2">
                <Label>Product Images</Label>
                <ImageUpload
                  value={editProduct.images}
                  onChange={(urls) => setEditProduct({ ...editProduct, images: urls })}
                  onRemove={(url) =>
                    setEditProduct({
                      ...editProduct,
                      images: editProduct.images.filter((image) => image !== url),
                    })
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-featured"
                  checked={editProduct.featured}
                  onCheckedChange={(checked) => setEditProduct({ ...editProduct, featured: checked })}
                />
                <Label htmlFor="edit-featured">Featured Product</Label>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <select
                  id="edit-status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={editProduct.status}
                  onChange={(e) => setEditProduct({ ...editProduct, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-keyIngredients">Key Ingredients</Label>
                  <Textarea
                    id="edit-keyIngredients"
                    value={editProduct?.keyIngredients.map(ingredient => 
                      `${ingredient.name}\n${ingredient.benefits.map(b => `- ${b}`).join('\n')}`
                    ).join('\n\n')}
                    onChange={(e) => {
                      const text = e.target.value;
                      const ingredients = text.split('\n\n').filter(Boolean).map(group => {
                        const lines = group.split('\n');
                        return {
                          name: lines[0] || '',
                          benefits: lines.slice(1).map(line => line.replace(/^-\s*/, '').trim()).filter(Boolean)
                        };
                      });
                      setEditProduct(prev => prev ? { ...prev, keyIngredients: ingredients } : null);
                    }}
                    placeholder={`Enter key ingredients and benefits...\nExample:\nKasthuri Kaha\n- contains antioxidants\n- Effectively removed suntans`}
                    rows={8}
                    className="font-mono"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-keyBenefits">Key Benefits</Label>
                  <Textarea
                    id="edit-keyBenefits"
                    value={editProduct?.keyBenefits.map(benefit => `- ${benefit}`).join('\n')}
                    onChange={(e) => {
                      const text = e.target.value;
                      const benefits = text
                        .split('\n')
                        .map(line => line.replace(/^-\s*/, '').trim())
                        .filter(Boolean);
                      setEditProduct(prev => prev ? { ...prev, keyBenefits: benefits } : null);
                    }}
                    placeholder={`Enter key benefits...\nExample:\n- Lightens the skin\n- moisturize and leaves your skin feeling extremely soft`}
                    rows={6}
                    className="font-mono"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProduct(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProduct} disabled={isEditing}>
              {isEditing ? "Updating..." : "Update Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="flex h-10 w-full md:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          <Button variant="outline" className="flex gap-2">
            <Filter size={18} />
            More Filters
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4 font-medium">Product</th>
                  <th className="text-left p-4 font-medium">Category</th>
                  <th className="text-left p-4 font-medium">Price</th>
                  <th className="text-left p-4 font-medium">Stock</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100">
                          {product.images?.[0] ? (
                            <Image
                              src={product.images[0] || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <ImageIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-gray-500">/{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p>{product.categoryName}</p>
                        <p className="text-xs text-gray-500">{product.subcategoryName}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      {product.discountedPrice ? (
                        <div>
                          <p className="font-medium">Rs.{product.discountedPrice.toLocaleString()}</p>
                          <p className="text-xs text-gray-500 line-through">Rs.{product.price.toLocaleString()}</p>
                        </div>
                      ) : (
                        <p>Rs.{product.price.toLocaleString()}</p>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          product.stock > 10
                            ? "bg-green-100 text-green-800"
                            : product.stock > 5
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        <Badge variant={product.status === "active" ? "default" : "secondary"}>{product.status}</Badge>
                        {product.featured && (
                          <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                            Featured
                          </Badge>
                        )}
                        {product.discountedPrice && (
                          <Badge variant="outline" className="border-green-500 text-green-700">
                            On Sale
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditProduct(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteProduct(product._id!)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
