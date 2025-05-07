"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Plus, Search, Edit, Trash2, Loader2, Gift } from "lucide-react"
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

interface GiftProduct {
  productId: string
  productName: string
  quantity: number
  price: number
}

interface GiftBox {
  _id?: string
  name: string
  slug: string
  description: string
  price: number
  discountedPrice?: number | null
  images: string[]
  products: GiftProduct[]
  featured: boolean
  status: string
  isCustomizable: boolean
}

export default function GiftingPage() {
  const { toast } = useToast()
  const [giftBoxes, setGiftBoxes] = useState<GiftBox[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // State for new gift box
  const [newGiftBox, setNewGiftBox] = useState<GiftBox>({
    name: "",
    slug: "",
    description: "",
    price: 0,
    discountedPrice: null,
    images: [],
    products: [],
    featured: false,
    status: "active",
    isCustomizable: false,
  })

  // State for editing gift box
  const [editGiftBox, setEditGiftBox] = useState<GiftBox | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  // State for search
  const [searchTerm, setSearchTerm] = useState("")

  // State for product selection
  const [selectedProduct, setSelectedProduct] = useState("")
  const [selectedQuantity, setSelectedQuantity] = useState(1)

  // Fetch gift boxes and products
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

        // Fetch gift boxes
        const giftBoxesResponse = await fetch("/api/gift-boxes")
        const giftBoxesData = await giftBoxesResponse.json()

        if (!giftBoxesResponse.ok) {
          throw new Error(giftBoxesData.error || "Failed to fetch gift boxes")
        }

        setGiftBoxes(giftBoxesData)
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

  // Add product to gift box
  const handleAddProductToGiftBox = () => {
    if (selectedProduct) {
      const product = products.find((p) => p._id === selectedProduct)
      if (product) {
        const giftProduct: GiftProduct = {
          productId: product._id,
          productName: product.name,
          quantity: selectedQuantity,
          price: product.price,
        }

        if (editGiftBox) {
          // Check if product already exists in gift box
          const existingProductIndex = editGiftBox.products.findIndex((p) => p.productId === product._id)
          if (existingProductIndex >= 0) {
            // Update quantity if product already exists
            const updatedProducts = [...editGiftBox.products]
            updatedProducts[existingProductIndex].quantity += selectedQuantity
            setEditGiftBox({
              ...editGiftBox,
              products: updatedProducts,
            })
          } else {
            // Add new product to gift box
            setEditGiftBox({
              ...editGiftBox,
              products: [...editGiftBox.products, giftProduct],
            })
          }
        } else {
          // Check if product already exists in gift box
          const existingProductIndex = newGiftBox.products.findIndex((p) => p.productId === product._id)
          if (existingProductIndex >= 0) {
            // Update quantity if product already exists
            const updatedProducts = [...newGiftBox.products]
            updatedProducts[existingProductIndex].quantity += selectedQuantity
            setNewGiftBox({
              ...newGiftBox,
              products: updatedProducts,
            })
          } else {
            // Add new product to gift box
            setNewGiftBox({
              ...newGiftBox,
              products: [...newGiftBox.products, giftProduct],
            })
          }
        }

        // Reset selection
        setSelectedProduct("")
        setSelectedQuantity(1)
      }
    }
  }

  // Remove product from gift box
  const handleRemoveProductFromGiftBox = (productId: string) => {
    if (editGiftBox) {
      setEditGiftBox({
        ...editGiftBox,
        products: editGiftBox.products.filter((p) => p.productId !== productId),
      })
    } else {
      setNewGiftBox({
        ...newGiftBox,
        products: newGiftBox.products.filter((p) => p.productId !== productId),
      })
    }
  }

  // Calculate total price
  const calculateTotalPrice = (products: GiftProduct[]) => {
    return products.reduce((total, product) => total + product.price * product.quantity, 0)
  }

  // Add new gift box
  const handleAddGiftBox = async () => {
    if (newGiftBox.name && newGiftBox.products.length > 0) {
      try {
        setIsAdding(true)

        // Calculate total price
        const totalPrice = calculateTotalPrice(newGiftBox.products)

        const giftBoxToAdd = {
          ...newGiftBox,
          slug: newGiftBox.slug || generateSlug(newGiftBox.name),
          price: totalPrice,
        }

        const response = await fetch("/api/gift-boxes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(giftBoxToAdd),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to add gift box")
        }

        setGiftBoxes([...giftBoxes, data])
        setNewGiftBox({
          name: "",
          slug: "",
          description: "",
          price: 0,
          discountedPrice: null,
          images: [],
          products: [],
          featured: false,
          status: "active",
          isCustomizable: false,
        })

        toast({
          title: "Success",
          description: "Gift box added successfully",
        })
      } catch (err) {
        console.error("Error adding gift box:", err)
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to add gift box",
          variant: "destructive",
        })
      } finally {
        setIsAdding(false)
      }
    }
  }

  // Update gift box
  const handleUpdateGiftBox = async () => {
    if (editGiftBox && editGiftBox._id) {
      try {
        setIsEditing(true)

        // Calculate total price
        const totalPrice = calculateTotalPrice(editGiftBox.products)

        const giftBoxToUpdate = {
          ...editGiftBox,
          price: totalPrice,
        }

        const response = await fetch(`/api/gift-boxes/${editGiftBox._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(giftBoxToUpdate),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to update gift box")
        }

        setGiftBoxes(giftBoxes.map((giftBox) => (giftBox._id === editGiftBox._id ? data : giftBox)))
        setEditGiftBox(null)

        toast({
          title: "Success",
          description: "Gift box updated successfully",
        })
      } catch (err) {
        console.error("Error updating gift box:", err)
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to update gift box",
          variant: "destructive",
        })
      } finally {
        setIsEditing(false)
      }
    }
  }

  // Delete gift box
  const handleDeleteGiftBox = async (id: string) => {
    if (confirm("Are you sure you want to delete this gift box?")) {
      try {
        const response = await fetch(`/api/gift-boxes/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Failed to delete gift box")
        }

        setGiftBoxes(giftBoxes.filter((giftBox) => giftBox._id !== id))

        toast({
          title: "Success",
          description: "Gift box deleted successfully",
        })
      } catch (err) {
        console.error("Error deleting gift box:", err)
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to delete gift box",
          variant: "destructive",
        })
      }
    }
  }

  // Filter gift boxes based on search term
  const filteredGiftBoxes = giftBoxes.filter((giftBox) => giftBox.name.toLowerCase().includes(searchTerm.toLowerCase()))

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
        <h1 className="text-3xl font-bold">Gift Boxes</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Gift Box
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Gift Box</DialogTitle>
              <DialogDescription>Create a new gift box with multiple products.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Gift Box Name</Label>
                  <Input
                    id="name"
                    value={newGiftBox.name}
                    onChange={(e) => {
                      setNewGiftBox({
                        ...newGiftBox,
                        name: e.target.value,
                        slug: generateSlug(e.target.value),
                      })
                    }}
                    placeholder="e.g. Seasonal Gift Box – Combo 1"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="slug">Gift Box Slug</Label>
                  <Input
                    id="slug"
                    value={newGiftBox.slug}
                    onChange={(e) => setNewGiftBox({ ...newGiftBox, slug: e.target.value })}
                    placeholder="e.g. seasonal-gift-box-combo-1"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newGiftBox.description}
                  onChange={(e) => setNewGiftBox({ ...newGiftBox, description: e.target.value })}
                  placeholder="Enter gift box description..."
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label>Gift Box Images</Label>
                <ImageUpload
                  value={newGiftBox.images}
                  onChange={(urls) => setNewGiftBox({ ...newGiftBox, images: urls })}
                  onRemove={(url) =>
                    setNewGiftBox({
                      ...newGiftBox,
                      images: newGiftBox.images.filter((image) => image !== url),
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Add Products to Gift Box</Label>
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
                  <Button onClick={handleAddProductToGiftBox} disabled={!selectedProduct}>
                    Add
                  </Button>
                </div>
              </div>
              {newGiftBox.products.length > 0 && (
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Gift Box Products</h3>
                  <div className="space-y-2">
                    {newGiftBox.products.map((product) => (
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
                            onClick={() => handleRemoveProductFromGiftBox(product.productId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                      <p>Total Price:</p>
                      <p>Rs.{calculateTotalPrice(newGiftBox.products).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="discountedPrice">Discounted Price (Optional)</Label>
                <Input
                  id="discountedPrice"
                  type="number"
                  value={newGiftBox.discountedPrice || ""}
                  onChange={(e) =>
                    setNewGiftBox({
                      ...newGiftBox,
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
                  checked={newGiftBox.featured}
                  onChange={(e) => setNewGiftBox({ ...newGiftBox, featured: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="featured">Featured Gift Box</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="customizable"
                  checked={newGiftBox.isCustomizable}
                  onChange={(e) => setNewGiftBox({ ...newGiftBox, isCustomizable: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="customizable">Customizable Gift Box</Label>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddGiftBox} disabled={isAdding || newGiftBox.products.length === 0}>
                {isAdding ? "Adding..." : "Add Gift Box"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Gift Box Dialog */}
      <Dialog open={!!editGiftBox} onOpenChange={(open) => !open && setEditGiftBox(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Gift Box</DialogTitle>
            <DialogDescription>Update gift box details</DialogDescription>
          </DialogHeader>
          {editGiftBox && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Gift Box Name</Label>
                  <Input
                    id="edit-name"
                    value={editGiftBox.name}
                    onChange={(e) => setEditGiftBox({ ...editGiftBox, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-slug">Gift Box Slug</Label>
                  <Input
                    id="edit-slug"
                    value={editGiftBox.slug}
                    onChange={(e) => setEditGiftBox({ ...editGiftBox, slug: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editGiftBox.description}
                  onChange={(e) => setEditGiftBox({ ...editGiftBox, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label>Gift Box Images</Label>
                <ImageUpload
                  value={editGiftBox.images}
                  onChange={(urls) => setEditGiftBox({ ...editGiftBox, images: urls })}
                  onRemove={(url) =>
                    setEditGiftBox({
                      ...editGiftBox,
                      images: editGiftBox.images.filter((image) => image !== url),
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Add Products to Gift Box</Label>
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
                  <Button onClick={handleAddProductToGiftBox} disabled={!selectedProduct}>
                    Add
                  </Button>
                </div>
              </div>
              {editGiftBox.products.length > 0 && (
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Gift Box Products</h3>
                  <div className="space-y-2">
                    {editGiftBox.products.map((product) => (
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
                            onClick={() => handleRemoveProductFromGiftBox(product.productId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                      <p>Total Price:</p>
                      <p>Rs.{calculateTotalPrice(editGiftBox.products).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="edit-discountedPrice">Discounted Price (Optional)</Label>
                <Input
                  id="edit-discountedPrice"
                  type="number"
                  value={editGiftBox.discountedPrice || ""}
                  onChange={(e) =>
                    setEditGiftBox({
                      ...editGiftBox,
                      discountedPrice: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-featured"
                  checked={editGiftBox.featured}
                  onChange={(e) => setEditGiftBox({ ...editGiftBox, featured: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="edit-featured">Featured Gift Box</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-customizable"
                  checked={editGiftBox.isCustomizable}
                  onChange={(e) => setEditGiftBox({ ...editGiftBox, isCustomizable: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="edit-customizable">Customizable Gift Box</Label>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <select
                  id="edit-status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={editGiftBox.status}
                  onChange={(e) => setEditGiftBox({ ...editGiftBox, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditGiftBox(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateGiftBox} disabled={isEditing || (editGiftBox?.products.length || 0) === 0}>
              {isEditing ? "Updating..." : "Update Gift Box"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search gift boxes..."
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
                  <th className="text-left p-4 font-medium">Gift Box</th>
                  <th className="text-left p-4 font-medium">Products</th>
                  <th className="text-left p-4 font-medium">Price</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGiftBoxes.map((giftBox) => (
                  <tr key={giftBox._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded overflow-hidden">
                          <Image
                            src={giftBox.images?.[0] || "/placeholder.svg?height=100&width=100&text=No+Image"}
                            alt={giftBox.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{giftBox.name}</p>
                          <p className="text-xs text-gray-500">/{giftBox.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <Gift className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{giftBox.products.length} products</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {giftBox.discountedPrice ? (
                        <div>
                          <p className="font-medium">Rs.{giftBox.discountedPrice.toLocaleString()}</p>
                          <p className="text-xs text-gray-500 line-through">Rs.{giftBox.price.toLocaleString()}</p>
                        </div>
                      ) : (
                        <p>Rs.{giftBox.price.toLocaleString()}</p>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        <Badge variant={giftBox.status === "active" ? "default" : "secondary"}>{giftBox.status}</Badge>
                        {giftBox.featured && (
                          <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                            Featured
                          </Badge>
                        )}
                        {giftBox.isCustomizable && (
                          <Badge variant="outline" className="border-blue-500 text-blue-700">
                            Customizable
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditGiftBox(giftBox)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteGiftBox(giftBox._id!)}
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
