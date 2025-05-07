"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Plus, Search, Edit, Trash2, Loader2, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { ImageUpload } from "@/components/image-upload"

interface Product {
  _id: string
  name: string
  price: number
  images?: string[]
}

interface BundleProduct {
  productId: string
  productName: string
  quantity: number
  price: number
}

interface BundleKit {
  _id?: string
  name: string
  slug: string
  description: string
  price: number
  discountedPrice?: number | null
  images: string[]
  products: BundleProduct[]
  featured: boolean
  status: string
}

export default function BundleKitsPage() {
  const { toast } = useToast()
  const [bundleKits, setBundleKits] = useState<BundleKit[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // State for new bundle kit
  const [newBundle, setNewBundle] = useState<BundleKit>({
    name: "",
    slug: "",
    description: "",
    price: 0,
    discountedPrice: null,
    images: [],
    products: [],
    featured: false,
    status: "active",
  })

  // State for editing bundle kit
  const [editBundle, setEditBundle] = useState<BundleKit | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  // State for search
  const [searchTerm, setSearchTerm] = useState("")

  // State for product selection
  const [selectedProduct, setSelectedProduct] = useState("")
  const [selectedQuantity, setSelectedQuantity] = useState(1)

  // Fetch bundle kits and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch products
        const productsResponse = await fetch("/api/products")
        const productsData = await productsResponse.json()

        if (!productsResponse.ok) {
          throw new Error(productsData.error || "Failed to fetch products")
        }

        setProducts(productsData)

        // Fetch bundle kits
        const bundlesResponse = await fetch("/api/bundle-kits")
        const bundlesData = await bundlesResponse.json()

        if (!bundlesResponse.ok) {
          throw new Error(bundlesData.error || "Failed to fetch bundle kits")
        }

        setBundleKits(bundlesData)
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

  // Add product to bundle
  const handleAddProductToBundle = () => {
    if (selectedProduct) {
      const product = products.find((p) => p._id === selectedProduct)
      if (product) {
        const bundleProduct: BundleProduct = {
          productId: product._id,
          productName: product.name,
          quantity: selectedQuantity,
          price: product.price,
        }

        if (editBundle) {
          // Check if product already exists in bundle
          const existingProductIndex = editBundle.products.findIndex((p) => p.productId === product._id)
          if (existingProductIndex >= 0) {
            // Update quantity if product already exists
            const updatedProducts = [...editBundle.products]
            updatedProducts[existingProductIndex].quantity += selectedQuantity
            setEditBundle({
              ...editBundle,
              products: updatedProducts,
            })
          } else {
            // Add new product to bundle
            setEditBundle({
              ...editBundle,
              products: [...editBundle.products, bundleProduct],
            })
          }
        } else {
          // Check if product already exists in bundle
          const existingProductIndex = newBundle.products.findIndex((p) => p.productId === product._id)
          if (existingProductIndex >= 0) {
            // Update quantity if product already exists
            const updatedProducts = [...newBundle.products]
            updatedProducts[existingProductIndex].quantity += selectedQuantity
            setNewBundle({
              ...newBundle,
              products: updatedProducts,
            })
          } else {
            // Add new product to bundle
            setNewBundle({
              ...newBundle,
              products: [...newBundle.products, bundleProduct],
            })
          }
        }

        // Reset selection
        setSelectedProduct("")
        setSelectedQuantity(1)
      }
    }
  }

  // Remove product from bundle
  const handleRemoveProductFromBundle = (productId: string) => {
    if (editBundle) {
      setEditBundle({
        ...editBundle,
        products: editBundle.products.filter((p) => p.productId !== productId),
      })
    } else {
      setNewBundle({
        ...newBundle,
        products: newBundle.products.filter((p) => p.productId !== productId),
      })
    }
  }

  // Calculate total price
  const calculateTotalPrice = (products: BundleProduct[]) => {
    return products.reduce((total, product) => total + product.price * product.quantity, 0)
  }

  // Add new bundle kit
  const handleAddBundle = async () => {
    if (newBundle.name && newBundle.products.length > 0) {
      try {
        setIsAdding(true)

        // Calculate total price
        const totalPrice = calculateTotalPrice(newBundle.products)

        const bundleToAdd = {
          ...newBundle,
          slug: newBundle.slug || generateSlug(newBundle.name),
          price: totalPrice,
        }

        const response = await fetch("/api/bundle-kits", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bundleToAdd),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to add bundle kit")
        }

        setBundleKits([...bundleKits, data])
        setNewBundle({
          name: "",
          slug: "",
          description: "",
          price: 0,
          discountedPrice: null,
          images: [],
          products: [],
          featured: false,
          status: "active",
        })

        toast({
          title: "Success",
          description: "Bundle kit added successfully",
        })
      } catch (err) {
        console.error("Error adding bundle kit:", err)
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to add bundle kit",
          variant: "destructive",
        })
      } finally {
        setIsAdding(false)
      }
    }
  }

  // Update bundle kit
  const handleUpdateBundle = async () => {
    if (editBundle && editBundle._id) {
      try {
        setIsEditing(true)

        // Calculate total price
        const totalPrice = calculateTotalPrice(editBundle.products)

        const bundleToUpdate = {
          ...editBundle,
          price: totalPrice,
        }

        const response = await fetch(`/api/bundle-kits/${editBundle._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bundleToUpdate),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to update bundle kit")
        }

        setBundleKits(bundleKits.map((bundle) => (bundle._id === editBundle._id ? data : bundle)))
        setEditBundle(null)

        toast({
          title: "Success",
          description: "Bundle kit updated successfully",
        })
      } catch (err) {
        console.error("Error updating bundle kit:", err)
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to update bundle kit",
          variant: "destructive",
        })
      } finally {
        setIsEditing(false)
      }
    }
  }

  // Delete bundle kit
  const handleDeleteBundle = async (id: string) => {
    if (confirm("Are you sure you want to delete this bundle kit?")) {
      try {
        const response = await fetch(`/api/bundle-kits/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Failed to delete bundle kit")
        }

        setBundleKits(bundleKits.filter((bundle) => bundle._id !== id))

        toast({
          title: "Success",
          description: "Bundle kit deleted successfully",
        })
      } catch (err) {
        console.error("Error deleting bundle kit:", err)
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to delete bundle kit",
          variant: "destructive",
        })
      }
    }
  }

  // Filter bundle kits based on search term
  const filteredBundles = bundleKits.filter((bundle) => bundle.name.toLowerCase().includes(searchTerm.toLowerCase()))

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
        <h1 className="text-3xl font-bold">Bundle Kits</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Bundle Kit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Bundle Kit</DialogTitle>
              <DialogDescription>Create a new bundle kit with multiple products.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Bundle Name</Label>
                  <Input
                    id="name"
                    value={newBundle.name}
                    onChange={(e) => {
                      setNewBundle({
                        ...newBundle,
                        name: e.target.value,
                        slug: generateSlug(e.target.value),
                      })
                    }}
                    placeholder="e.g. Skincare Essentials Kit"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="slug">Bundle Slug</Label>
                  <Input
                    id="slug"
                    value={newBundle.slug}
                    onChange={(e) => setNewBundle({ ...newBundle, slug: e.target.value })}
                    placeholder="e.g. skincare-essentials-kit"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newBundle.description}
                  onChange={(e) => setNewBundle({ ...newBundle, description: e.target.value })}
                  placeholder="Enter bundle description..."
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label>Bundle Images</Label>
                <ImageUpload
                  value={newBundle.images}
                  onChange={(urls) => setNewBundle({ ...newBundle, images: urls })}
                  onRemove={(url) =>
                    setNewBundle({
                      ...newBundle,
                      images: newBundle.images.filter((image) => image !== url),
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Add Products to Bundle</Label>
                <div className="flex gap-2">
                  <select
                    className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                  >
                    <option value="">Select a product</option>
                    {products.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name} - Rs.{product.price.toLocaleString()}
                      </option>
                    ))}
                  </select>
                  <Input
                    type="number"
                    min="1"
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                    className="w-20"
                  />
                  <Button onClick={handleAddProductToBundle} disabled={!selectedProduct}>
                    Add
                  </Button>
                </div>
              </div>
              {newBundle.products.length > 0 && (
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Bundle Products</h3>
                  <div className="space-y-2">
                    {newBundle.products.map((product) => (
                      <div key={product.productId} className="flex justify-between items-center">
                        <div>
                          <p>
                            {product.productName} x {product.quantity}
                          </p>
                          <p className="text-sm text-gray-500">Rs.{product.price.toLocaleString()} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">Rs.{(product.price * product.quantity).toLocaleString()}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveProductFromBundle(product.productId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                      <p>Total Price:</p>
                      <p>Rs.{calculateTotalPrice(newBundle.products).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="discountedPrice">Discounted Price (Optional)</Label>
                <Input
                  id="discountedPrice"
                  type="number"
                  value={newBundle.discountedPrice || ""}
                  onChange={(e) =>
                    setNewBundle({
                      ...newBundle,
                      discountedPrice: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  placeholder="e.g. 4500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={newBundle.featured}
                  onChange={(e) => setNewBundle({ ...newBundle, featured: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="featured">Featured Bundle</Label>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddBundle} disabled={isAdding || newBundle.products.length === 0}>
                {isAdding ? "Adding..." : "Add Bundle Kit"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Bundle Dialog */}
      <Dialog open={!!editBundle} onOpenChange={(open) => !open && setEditBundle(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Bundle Kit</DialogTitle>
            <DialogDescription>Update bundle kit details</DialogDescription>
          </DialogHeader>
          {editBundle && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Bundle Name</Label>
                  <Input
                    id="edit-name"
                    value={editBundle.name}
                    onChange={(e) => setEditBundle({ ...editBundle, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-slug">Bundle Slug</Label>
                  <Input
                    id="edit-slug"
                    value={editBundle.slug}
                    onChange={(e) => setEditBundle({ ...editBundle, slug: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editBundle.description}
                  onChange={(e) => setEditBundle({ ...editBundle, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label>Bundle Images</Label>
                <ImageUpload
                  value={editBundle.images}
                  onChange={(urls) => setEditBundle({ ...editBundle, images: urls })}
                  onRemove={(url) =>
                    setEditBundle({
                      ...editBundle,
                      images: editBundle.images.filter((image) => image !== url),
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Add Products to Bundle</Label>
                <div className="flex gap-2">
                  <select
                    className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                  >
                    <option value="">Select a product</option>
                    {products.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name} - Rs.{product.price.toLocaleString()}
                      </option>
                    ))}
                  </select>
                  <Input
                    type="number"
                    min="1"
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                    className="w-20"
                  />
                  <Button onClick={handleAddProductToBundle} disabled={!selectedProduct}>
                    Add
                  </Button>
                </div>
              </div>
              {editBundle.products.length > 0 && (
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Bundle Products</h3>
                  <div className="space-y-2">
                    {editBundle.products.map((product) => (
                      <div key={product.productId} className="flex justify-between items-center">
                        <div>
                          <p>
                            {product.productName} x {product.quantity}
                          </p>
                          <p className="text-sm text-gray-500">Rs.{product.price.toLocaleString()} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">Rs.{(product.price * product.quantity).toLocaleString()}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveProductFromBundle(product.productId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                      <p>Total Price:</p>
                      <p>Rs.{calculateTotalPrice(editBundle.products).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="edit-discountedPrice">Discounted Price (Optional)</Label>
                <Input
                  id="edit-discountedPrice"
                  type="number"
                  value={editBundle.discountedPrice || ""}
                  onChange={(e) =>
                    setEditBundle({
                      ...editBundle,
                      discountedPrice: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-featured"
                  checked={editBundle.featured}
                  onChange={(e) => setEditBundle({ ...editBundle, featured: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="edit-featured">Featured Bundle</Label>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <select
                  id="edit-status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={editBundle.status}
                  onChange={(e) => setEditBundle({ ...editBundle, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditBundle(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateBundle} disabled={isEditing || (editBundle?.products.length || 0) === 0}>
              {isEditing ? "Updating..." : "Update Bundle Kit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search bundle kits..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4 font-medium">Bundle Kit</th>
                  <th className="text-left p-4 font-medium">Products</th>
                  <th className="text-left p-4 font-medium">Price</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBundles.map((bundle) => (
                  <tr key={bundle._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded overflow-hidden">
                          <Image
                            src={bundle.images?.[0] || "/placeholder.svg?height=100&width=100&text=No+Image"}
                            alt={bundle.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{bundle.name}</p>
                          <p className="text-xs text-gray-500">/{bundle.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <Package className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{bundle.products.length} products</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {bundle.discountedPrice ? (
                        <div>
                          <p className="font-medium">Rs.{bundle.discountedPrice.toLocaleString()}</p>
                          <p className="text-xs text-gray-500 line-through">Rs.{bundle.price.toLocaleString()}</p>
                        </div>
                      ) : (
                        <p>Rs.{bundle.price.toLocaleString()}</p>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        <Badge variant={bundle.status === "active" ? "default" : "secondary"}>{bundle.status}</Badge>
                        {bundle.featured && (
                          <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditBundle(bundle)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteBundle(bundle._id!)}
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
