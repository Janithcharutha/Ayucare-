"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Plus, Search, Edit, Trash2, Calendar, Loader2 } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

interface Product {
  _id: string
  name: string
  price: number
  category: string
  images?: string[]
}

interface Offer {
  _id?: string
  productId: string
  productName: string
  productSlug: string
  productImage?: string
  originalPrice: number
  discountedPrice: number
  discountPercentage: number
  startDate: string
  endDate: string
  status: string
}

export default function OffersPage() {
  const { toast } = useToast()
  const [offers, setOffers] = useState<Offer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // State for new offer
  const [newOffer, setNewOffer] = useState({
    productId: "",
    discountPercentage: "",
    startDate: "",
    endDate: "",
  })

  // State for editing offer
  const [editOffer, setEditOffer] = useState<Offer | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  // State for search
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch offers and products
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

        // Fetch offers
        const offersResponse = await fetch("/api/offers")
        const offersData = await offersResponse.json()

        if (!offersResponse.ok) {
          throw new Error(offersData.error || "Failed to fetch offers")
        }

        setOffers(offersData)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Add new offer
  const handleAddOffer = async () => {
    if (newOffer.productId && newOffer.discountPercentage && newOffer.startDate && newOffer.endDate) {
      try {
        setIsAdding(true)

        const response = await fetch("/api/offers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newOffer),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to add offer")
        }

        setOffers([...offers, data])
        setNewOffer({
          productId: "",
          discountPercentage: "",
          startDate: "",
          endDate: "",
        })

        toast({
          title: "Success",
          description: "Offer added successfully",
        })
      } catch (err) {
        console.error("Error adding offer:", err)
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to add offer",
          variant: "destructive",
        })
      } finally {
        setIsAdding(false)
      }
    }
  }

  // Update offer
  const handleUpdateOffer = async () => {
    if (editOffer && editOffer._id) {
      try {
        setIsEditing(true)

        const response = await fetch(`/api/offers/${editOffer._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            discountPercentage: editOffer.discountPercentage,
            startDate: editOffer.startDate,
            endDate: editOffer.endDate,
            status: editOffer.status,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to update offer")
        }

        setOffers(offers.map((offer) => (offer._id === editOffer._id ? data : offer)))
        setEditOffer(null)

        toast({
          title: "Success",
          description: "Offer updated successfully",
        })
      } catch (err) {
        console.error("Error updating offer:", err)
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to update offer",
          variant: "destructive",
        })
      } finally {
        setIsEditing(false)
      }
    }
  }

  // Delete offer
  const handleDeleteOffer = async (id: string) => {
    if (confirm("Are you sure you want to delete this offer?")) {
      try {
        const response = await fetch(`/api/offers/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Failed to delete offer")
        }

        setOffers(offers.filter((offer) => offer._id !== id))

        toast({
          title: "Success",
          description: "Offer deleted successfully",
        })
      } catch (err) {
        console.error("Error deleting offer:", err)
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to delete offer",
          variant: "destructive",
        })
      }
    }
  }

  // Add a safe search filter function
  const filterOffers = (offers: Offer[], searchQuery: string) => {
    if (!searchQuery) return offers;
    
    const query = searchQuery.toLowerCase().trim();
    return offers.filter(offer => {
      const productName = offer.productName || '';
      const productSlug = offer.productSlug || '';
      return (
        productName.toLowerCase().includes(query) ||
        productSlug.toLowerCase().includes(query)
      );
    });
  };

  // Use the safe filter function
  const filteredOffers = filterOffers(offers, searchTerm);

  // Get available products (those without existing offers)
  const availableProducts = products.filter((product) => !offers.some((offer) => offer.productId === product._id))

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
        <h1 className="text-3xl font-bold">Offers & Discounts</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Offer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Offer</DialogTitle>
              <DialogDescription>Create a new discount offer for a product.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="product">Select Product</Label>
                <select
                  id="product"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newOffer.productId}
                  onChange={(e) => setNewOffer({ ...newOffer, productId: e.target.value })}
                >
                  <option value="">Select a product</option>
                  {availableProducts.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name} - Rs.{product.price.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="discount">Discount Percentage (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="1"
                  max="99"
                  value={newOffer.discountPercentage}
                  onChange={(e) => setNewOffer({ ...newOffer, discountPercentage: e.target.value })}
                  placeholder="e.g. 20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newOffer.startDate}
                    onChange={(e) => setNewOffer({ ...newOffer, startDate: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newOffer.endDate}
                    onChange={(e) => setNewOffer({ ...newOffer, endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddOffer} disabled={isAdding}>
                {isAdding ? "Adding..." : "Add Offer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Offer Dialog */}
      <Dialog open={!!editOffer} onOpenChange={(open) => !open && setEditOffer(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Offer</DialogTitle>
            <DialogDescription>Update offer details</DialogDescription>
          </DialogHeader>
          {editOffer && (
            <div className="grid gap-4 py-4">
              <div>
                <p className="font-medium">{editOffer.productName}</p>
                <p className="text-sm text-gray-500">Original Price: Rs.{editOffer.originalPrice.toLocaleString()}</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-discount">Discount Percentage (%)</Label>
                <Input
                  id="edit-discount"
                  type="number"
                  min="1"
                  max="99"
                  value={editOffer.discountPercentage}
                  onChange={(e) => setEditOffer({ ...editOffer, discountPercentage: Number(e.target.value) })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-startDate">Start Date</Label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    value={editOffer.startDate}
                    onChange={(e) => setEditOffer({ ...editOffer, startDate: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-endDate">End Date</Label>
                  <Input
                    id="edit-endDate"
                    type="date"
                    value={editOffer.endDate}
                    onChange={(e) => setEditOffer({ ...editOffer, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <select
                  id="edit-status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={editOffer.status}
                  onChange={(e) => setEditOffer({ ...editOffer, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOffer(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateOffer} disabled={isEditing}>
              {isEditing ? "Updating..." : "Update Offer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search offers..."
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
                  <th className="text-left p-4 font-medium">Product</th>
                  <th className="text-left p-4 font-medium">Original Price</th>
                  <th className="text-left p-4 font-medium">Discounted Price</th>
                  <th className="text-left p-4 font-medium">Discount</th>
                  <th className="text-left p-4 font-medium">Duration</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOffers.map((offer) => (
                  <tr key={offer._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded overflow-hidden">
                          <Image
                            src={offer.productImage || "/placeholder.svg"}
                            alt={`Product image for ${offer.productName}`}
                            fill
                            className="object-cover"
                            unoptimized={process.env.NODE_ENV === 'development'}
                          />
                        </div>
                        <div>
                          <p className="font-medium">{offer.productName}</p>
                          <p className="text-xs text-gray-500">/{offer.productSlug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">Rs.{offer.originalPrice.toLocaleString()}</td>
                    <td className="p-4">Rs.{offer.discountedPrice.toLocaleString()}</td>
                    <td className="p-4">
                      <Badge variant="outline" className="border-green-500 text-green-700">
                        {offer.discountPercentage}% OFF
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          {offer.startDate} to {offer.endDate}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={offer.status === "active" ? "default" : "secondary"}>{offer.status}</Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditOffer(offer)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteOffer(offer._id!)}
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
