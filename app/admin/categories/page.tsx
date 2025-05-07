"use client"

import { type FC, type ChangeEvent } from "react"
import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/image-upload"
import Image from "next/image"

interface Subcategory {
  _id?: string
  name: string
  slug: string
  description?: string
}

interface Category {
  _id?: string
  name: string
  slug: string
  description?: string
  image?: string
  subcategories: Subcategory[]
}

const CategoriesPage: FC = () => {
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // State for new category/subcategory
  const [newCategory, setNewCategory] = useState({ name: "", slug: "", description: "", image: "" })
  const [newSubcategory, setNewSubcategory] = useState({ name: "", slug: "", description: "", categoryId: "" })
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false)

  // State for editing
  const [editCategory, setEditCategory] = useState<Category | null>(null)
  const [editSubcategory, setEditSubcategory] = useState<{ subcategory: Subcategory; categoryId: string } | null>(null)
  const [isEditingCategory, setIsEditingCategory] = useState(false)
  const [isEditingSubcategory, setIsEditingSubcategory] = useState(false)

  // Add separate states for each dialog
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false)
  const [isAddSubcategoryDialogOpen, setIsAddSubcategoryDialogOpen] = useState(false)
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false)
  const [isEditSubcategoryDialogOpen, setIsEditSubcategoryDialogOpen] = useState(false)

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/categories")
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch categories")
        }

        setCategories(data)
      } catch (err) {
        console.error("Error fetching categories:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch categories")
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  // Add type annotations for event handlers
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewCategory({
      ...newCategory,
      name: e.target.value,
      slug: generateSlug(e.target.value),
    })
  }

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewCategory({
      ...newCategory,
      description: e.target.value,
    })
  }

  const handleCategorySelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setNewSubcategory({
      ...newSubcategory,
      categoryId: e.target.value,
    })
  }

  // Add type annotations for map callbacks
  const renderCategories = (category: Category) => {
    return (
      <div key={category._id}>
        {/* ... */}
        {category.subcategories.map((subcategory: Subcategory) => (
          <li key={subcategory._id}>
            {/* ... */}
          </li>
        ))}
      </div>
    )
  }

  const renderSubcategories = (subcategory: Subcategory) => {
    // ...
  }

  // Add new category
  const handleAddCategory = async () => {
    if (newCategory.name && newCategory.slug) {
      try {
        setIsAddingCategory(true)
        const response = await fetch("/api/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newCategory.name,
            slug: newCategory.slug,
            description: newCategory.description,
            image: newCategory.image,
            subcategories: [],
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to add category")
        }

        setCategories([...categories, data])
        setNewCategory({ name: "", slug: "", description: "", image: "" })
        toast({
          title: "Success",
          description: "Category added successfully",
        })
      } catch (err) {
        console.error("Error adding category:", err)
        setError(err instanceof Error ? err.message : "Failed to add category")
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to add category",
          variant: "destructive",
        })
      } finally {
        setIsAddingCategory(false)
      }
    }
  }

  // Add new subcategory
  const handleAddSubcategory = async () => {
    if (newSubcategory.name && newSubcategory.slug && newSubcategory.categoryId) {
      try {
        setIsAddingSubcategory(true)
        const category = categories.find((c) => c._id === newSubcategory.categoryId)

        if (!category) {
          throw new Error("Category not found")
        }

        const updatedCategory = {
          ...category,
          subcategories: [
            ...category.subcategories,
            {
              name: newSubcategory.name,
              slug: newSubcategory.slug,
              description: newSubcategory.description,
            },
          ],
        }

        const response = await fetch(`/api/categories/${newSubcategory.categoryId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCategory),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to add subcategory")
        }

        setCategories(categories.map((category) => (category._id === newSubcategory.categoryId ? data : category)))
        setNewSubcategory({ name: "", slug: "", description: "", categoryId: "" })
        toast({
          title: "Success",
          description: "Subcategory added successfully",
        })
      } catch (err) {
        console.error("Error adding subcategory:", err)
        setError(err instanceof Error ? err.message : "Failed to add subcategory")
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to add subcategory",
          variant: "destructive",
        })
      } finally {
        setIsAddingSubcategory(false)
      }
    }
  }

  // Update category
  const handleUpdateCategory = async () => {
    if (editCategory && editCategory.name && editCategory.slug) {
      try {
        setIsEditingCategory(true)
        const response = await fetch(`/api/categories/${editCategory._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editCategory),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to update category")
        }

        setCategories(categories.map((category) => (category._id === editCategory._id ? data : category)))
        setEditCategory(null)
        setIsEditCategoryDialogOpen(false) // Close dialog after success
      } catch (err) {
        console.error("Error updating category:", err)
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to update category",
          variant: "destructive",
        })
      } finally {
        setIsEditingCategory(false)
      }
    }
  }

  // Update subcategory
  const handleUpdateSubcategory = async () => {
    if (editSubcategory && editSubcategory.subcategory.name && editSubcategory.subcategory.slug) {
      try {
        setIsEditingSubcategory(true)
        const category = categories.find((c) => c._id === editSubcategory.categoryId)

        if (!category) {
          throw new Error("Category not found")
        }

        const updatedCategory = {
          ...category,
          subcategories: category.subcategories.map((sub) =>
            sub._id === editSubcategory.subcategory._id ? editSubcategory.subcategory : sub,
          ),
        }

        const response = await fetch(`/api/categories/${editSubcategory.categoryId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCategory),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to update subcategory")
        }

        setCategories(categories.map((category) => (category._id === editSubcategory.categoryId ? data : category)))
        setEditSubcategory(null)
        setIsEditSubcategoryDialogOpen(false) // Close dialog after success
      } catch (err) {
        console.error("Error updating subcategory:", err)
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to update subcategory",
          variant: "destructive",
        })
      } finally {
        setIsEditingSubcategory(false)
      }
    }
  }

  // Delete category
  const handleDeleteCategory = async (id: string) => {
    if (confirm("Are you sure you want to delete this category? This will also delete all subcategories.")) {
      try {
        const response = await fetch(`/api/categories/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Failed to delete category")
        }

        setCategories(categories.filter((category) => category._id !== id))
        toast({
          title: "Success",
          description: "Category deleted successfully",
        })
      } catch (err) {
        console.error("Error deleting category:", err)
        setError(err instanceof Error ? err.message : "Failed to delete category")
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to delete category",
          variant: "destructive",
        })
      }
    }
  }

  // Delete subcategory
  const handleDeleteSubcategory = async (categoryId: string, subcategoryId: string) => {
    if (confirm("Are you sure you want to delete this subcategory?")) {
      try {
        const category = categories.find((c) => c._id === categoryId)

        if (!category) {
          throw new Error("Category not found")
        }

        const updatedCategory = {
          ...category,
          subcategories: category.subcategories.filter((sub) => sub._id !== subcategoryId),
        }

        const response = await fetch(`/api/categories/${categoryId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCategory),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to delete subcategory")
        }

        setCategories(categories.map((category) => (category._id === categoryId ? data : category)))
        toast({
          title: "Success",
          description: "Subcategory deleted successfully",
        })
      } catch (err) {
        console.error("Error deleting subcategory:", err)
        setError(err instanceof Error ? err.message : "Failed to delete subcategory")
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to delete subcategory",
          variant: "destructive",
        })
      }
    }
  }

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
        <h1 className="text-3xl font-bold">Categories</h1>
        <div className="flex gap-2">
          {/* Add Category Button and Dialog */}
          <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>Create a new product category for your store.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    value={newCategory.name}
                    onChange={handleNameChange}
                    placeholder="e.g. FACE CARE"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="slug">Category Slug</Label>
                  <Input
                    id="slug"
                    value={newCategory.slug}
                    onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                    placeholder="e.g. face-care"
                  />
                  <p className="text-sm text-gray-500">Used in URLs: /products/[slug]</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newCategory.description}
                    onChange={handleDescriptionChange}
                    placeholder="e.g. Products for facial care"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">Category Image</Label>
                  <ImageUpload
                    value={newCategory.image ? [newCategory.image] : []}
                    onChange={(urls) => setNewCategory({ ...newCategory, image: urls[0] || "" })}
                    onRemove={() => setNewCategory({ ...newCategory, image: "" })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddCategory} disabled={isAddingCategory}>
                  {isAddingCategory ? "Adding..." : "Add Category"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add Subcategory Button and Dialog */}
          <Dialog open={isAddSubcategoryDialogOpen} onOpenChange={setIsAddSubcategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Subcategory
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Subcategory</DialogTitle>
                <DialogDescription>Create a new subcategory for your products.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Parent Category</Label>
                  <select
                    id="category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newSubcategory.categoryId}
                    onChange={handleCategorySelect}
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
                  <Label htmlFor="subname">Subcategory Name</Label>
                  <Input
                    id="subname"
                    value={newSubcategory.name}
                    onChange={(e) => {
                      setNewSubcategory({
                        ...newSubcategory,
                        name: e.target.value,
                        slug: generateSlug(e.target.value),
                      })
                    }}
                    placeholder="e.g. FACE CREAM"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subslug">Subcategory Slug</Label>
                  <Input
                    id="subslug"
                    value={newSubcategory.slug}
                    onChange={(e) => setNewSubcategory({ ...newSubcategory, slug: e.target.value })}
                    placeholder="e.g. face-cream"
                  />
                  <p className="text-sm text-gray-500">Used in URLs: /products/[category]/[slug]</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subdescription">Description</Label>
                  <Textarea
                    id="subdescription"
                    value={newSubcategory.description}
                    onChange={(e) => setNewSubcategory({ ...newSubcategory, description: e.target.value })}
                    placeholder="e.g. Facial creams and moisturizers"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddSubcategory} disabled={isAddingSubcategory}>
                  {isAddingSubcategory ? "Adding..." : "Add Subcategory"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Category Dialog */}
      <Dialog open={isEditCategoryDialogOpen} onOpenChange={setIsEditCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category details</DialogDescription>
          </DialogHeader>
          {editCategory && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Category Name</Label>
                <Input
                  id="edit-name"
                  value={editCategory.name}
                  onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-slug">Category Slug</Label>
                <Input
                  id="edit-slug"
                  value={editCategory.slug}
                  onChange={(e) => setEditCategory({ ...editCategory, slug: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editCategory.description || ""}
                  onChange={(e) => setEditCategory({ ...editCategory, description: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-image">Category Image</Label>
                <ImageUpload
                  value={editCategory.image ? [editCategory.image] : []}
                  onChange={(urls) => setEditCategory({ ...editCategory, image: urls[0] || "" })}
                  onRemove={() => setEditCategory({ ...editCategory, image: "" })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCategory(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCategory} disabled={isEditingCategory}>
              {isEditingCategory ? "Updating..." : "Update Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Subcategory Dialog */}
      <Dialog open={isEditSubcategoryDialogOpen} onOpenChange={setIsEditSubcategoryDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Subcategory</DialogTitle>
            <DialogDescription>Update subcategory details</DialogDescription>
          </DialogHeader>
          {editSubcategory && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-subname">Subcategory Name</Label>
                <Input
                  id="edit-subname"
                  value={editSubcategory.subcategory.name}
                  onChange={(e) =>
                    setEditSubcategory({
                      ...editSubcategory,
                      subcategory: { ...editSubcategory.subcategory, name: e.target.value },
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-subslug">Subcategory Slug</Label>
                <Input
                  id="edit-subslug"
                  value={editSubcategory.subcategory.slug}
                  onChange={(e) =>
                    setEditSubcategory({
                      ...editSubcategory,
                      subcategory: { ...editSubcategory.subcategory, slug: e.target.value },
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-subdescription">Description</Label>
                <Textarea
                  id="edit-subdescription"
                  value={editSubcategory.subcategory.description || ""}
                  onChange={(e) =>
                    setEditSubcategory({
                      ...editSubcategory,
                      subcategory: { ...editSubcategory.subcategory, description: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditSubcategory(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSubcategory} disabled={isEditingSubcategory}>
              {isEditingSubcategory ? "Updating..." : "Update Subcategory"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="categories">
        <TabsList className="mb-6">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="subcategories">Subcategories</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card key={category._id} className="overflow-hidden">
                <CardHeader className="bg-gray-50 pb-3">
                  {category.image && (
                    <div className="relative w-full h-32 mb-3 rounded overflow-hidden">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>/{category.slug}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-500">{category.subcategories.length} subcategories</p>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setEditCategory(category)
                          setIsEditCategoryDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteCategory(category._id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setSelectedCategory(selectedCategory === category._id ? null : category._id!)}
                  >
                    View Subcategories
                    <ChevronRight
                      className={`ml-2 h-4 w-4 transition-transform ${
                        selectedCategory === category._id ? "rotate-90" : ""
                      }`}
                    />
                  </Button>
                  {selectedCategory === category._id && (
                    <div className="mt-4 border rounded-md divide-y">
                      {category.subcategories.map((subcategory) => (
                        <div key={subcategory._id} className="p-3 flex justify-between items-center">
                          <div>
                            <p className="font-medium">{subcategory.name}</p>
                            <p className="text-xs text-gray-500">
                              /{category.slug}/{subcategory.slug}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditSubcategory({
                                  subcategory,
                                  categoryId: category._id!,
                                })
                                setIsEditSubcategoryDialogOpen(true)
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteSubcategory(category._id!, subcategory._id!)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="subcategories">
          <div className="bg-white rounded-md shadow">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">ID</th>
                    <th className="text-left p-4 font-medium">Name</th>
                    <th className="text-left p-4 font-medium">Slug</th>
                    <th className="text-left p-4 font-medium">Parent Category</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.flatMap((category) =>
                    category.subcategories.map((subcategory) => (
                      <tr key={subcategory._id} className="border-b hover:bg-gray-50">
                        <td className="p-4">{subcategory._id}</td>
                        <td className="p-4 font-medium">{subcategory.name}</td>
                        <td className="p-4">{subcategory.slug}</td>
                        <td className="p-4">{category.name}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setEditSubcategory({
                                  subcategory,
                                  categoryId: category._id!,
                                })
                              }
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteSubcategory(category._id!, subcategory._id!)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CategoriesPage
