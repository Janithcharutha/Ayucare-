export interface Product {
  _id: string
  name: string
  slug: string
  description: string
  price: number
  images: string[]  // Array of image URLs
  category: string
  categoryName: string
  subcategory: string
  subcategoryName: string
  stock: number
  featured: boolean
  status: string
}

export interface CategoryData {
  slug: string
  title: string
  description: string
  subcategories: SubcategoryData[]
}

export interface SubcategoryData {
  slug: string
  title: string
  description: string
}

// Category data
const categories: CategoryData[] = [
  {
    slug: "face-care",
    title: "FACE CARE",
    description: "Nourish and protect your face with our natural skincare products.",
    subcategories: [
      {
        slug: "face-cream",
        title: "FACE CREAM",
        description: "Hydrating and nourishing face creams for all skin types.",
      },
      {
        slug: "face-serum",
        title: "FACE SERUM",
        description: "Concentrated treatments targeting specific skin concerns.",
      },
      {
        slug: "face-wash",
        title: "FACE WASH",
        description: "Gentle cleansers to remove impurities without stripping natural oils.",
      },
      {
        slug: "glycerin-bar",
        title: "GLYCERIN BAR",
        description: "Moisturizing glycerin soap bars for face cleansing.",
      },
    ],
  },
  {
    slug: "body-care",
    title: "BODY CARE",
    description: "Pamper your body with our luxurious and natural body care products.",
    subcategories: [
      {
        slug: "body-cleanser",
        title: "BODY CLEANSER",
        description: "Gentle body washes and cleansers for daily use.",
      },
      {
        slug: "body-lotions",
        title: "BODY LOTIONS",
        description: "Hydrating lotions to keep your skin soft and supple.",
      },
      {
        slug: "body-scrub",
        title: "BODY SCRUB",
        description: "Exfoliating scrubs to reveal smoother, brighter skin.",
      },
      {
        slug: "glycerin-bar",
        title: "GLYCERIN BAR",
        description: "Moisturizing glycerin soap bars for body cleansing.",
      },
      {
        slug: "foot-care",
        title: "FOOT CARE",
        description: "Specialized products to care for your feet.",
      },
    ],
  },
  {
    slug: "hair-care",
    title: "HAIR CARE",
    description: "Natural hair care products for healthy, beautiful hair.",
    subcategories: [
      {
        slug: "hair-oil",
        title: "HAIR OIL",
        description: "Nourishing oils to strengthen and condition your hair.",
      },
      {
        slug: "shampoo-conditioners",
        title: "SHAMPOO & CONDITIONERS",
        description: "Gentle cleansing and conditioning products for all hair types.",
      },
    ],
  },
]

// Sample product data
const products: Product[] = [
  // Face Care - Face Cream
  {
    _id: "1",
    name: "Vitamin C Brightening Cream",
    slug: "vitamin-c-brightening-cream",
    description: "Brighten and even skin tone with this vitamin C-infused face cream.",
    price: 2500,
    images: [],
    category: "face-care",
    categoryName: "FACE CARE",
    subcategory: "face-cream",
    subcategoryName: "FACE CREAM",
    stock: 100,
    featured: false,
    status: "active",
  },
  {
    _id: "2",
    name: "Aloe Vera Hydrating Cream",
    slug: "aloe-vera-hydrating-cream",
    description: "Deeply hydrating face cream with aloe vera for all skin types.",
    price: 2200,
    images: [],
    category: "face-care",
    categoryName: "FACE CARE",
    subcategory: "face-cream",
    subcategoryName: "FACE CREAM",
    stock: 100,
    featured: false,
    status: "active",
  },
  {
    _id: "100",
    name: "Kasthuri Kaha Night Cream",
    slug: "kasthuri-kaha-night-cream",
    description:
      "A nourishing, rich blend infused with Kasthuri Kaha and many other ingredients to promote smoother skin and continuous hydration, which results in even-toned, soft and supple skin.",
    price: 4750,
    images: [],
    category: "face-care",
    categoryName: "FACE CARE",
    subcategory: "face-cream",
    subcategoryName: "FACE CREAM",
    stock: 100,
    featured: false,
    status: "active",
  },

  // Face Care - Face Serum
  {
    _id: "3",
    name: "Hyaluronic Acid Serum",
    slug: "hyaluronic-acid-serum",
    description: "Intense hydration serum with hyaluronic acid for plump skin.",
    price: 2800,
    images: [],
    category: "face-care",
    categoryName: "FACE CARE",
    subcategory: "face-serum",
    subcategoryName: "FACE SERUM",
    stock: 100,
    featured: true,
    status: "active",
  },
  {
    _id: "4",
    name: "Vitamin C Brightening Serum",
    slug: "vitamin-c-brightening-serum",
    description: "Powerful vitamin C serum for brighter, more even skin tone.",
    price: 3000,
    images: [],
    category: "face-care",
    categoryName: "FACE CARE",
    subcategory: "face-serum",
    subcategoryName: "FACE SERUM",
    stock: 100,
    featured: false,
    status: "active",
  },

  // Face Care - Face Wash
  {
    _id: "5",
    name: "Tea Tree Purifying Wash",
    slug: "tea-tree-purifying-wash",
    description: "Purifying face wash with tea tree oil for oily and acne-prone skin.",
    price: 1800,
    images: [],
    category: "face-care",
    categoryName: "FACE CARE",
    subcategory: "face-wash",
    subcategoryName: "FACE WASH",
    stock: 100,
    featured: false,
    status: "active",
  },
  {
    _id: "6",
    name: "Gentle Coconut Cleanser",
    slug: "gentle-coconut-cleanser",
    description: "Gentle coconut-based cleanser for sensitive skin.",
    price: 1600,
    images: [],
    category: "face-care",
    categoryName: "FACE CARE",
    subcategory: "face-wash",
    subcategoryName: "FACE WASH",
    stock: 100,
    featured: false,
    status: "active",
  },

  // Face Care - Glycerin Bar
  {
    _id: "7",
    name: "Rose Glycerin Facial Bar",
    slug: "rose-glycerin-facial-bar",
    description: "Moisturizing glycerin soap bar with rose for face cleansing.",
    price: 950,
    images: [],
    category: "face-care",
    categoryName: "FACE CARE",
    subcategory: "glycerin-bar",
    subcategoryName: "GLYCERIN BAR",
    stock: 100,
    featured: false,
    status: "active",
  },

  // Body Care - Body Cleanser
  {
    _id: "8",
    name: "Coconut Milk Body Wash",
    slug: "coconut-milk-body-wash",
    description: "Creamy coconut milk body wash for soft, nourished skin.",
    price: 1800,
    images: [],
    category: "body-care",
    categoryName: "BODY CARE",
    subcategory: "body-cleanser",
    subcategoryName: "BODY CLEANSER",
    stock: 100,
    featured: false,
    status: "active",
  },
  {
    _id: "9",
    name: "Lavender Shower Gel",
    slug: "lavender-shower-gel",
    description: "Calming lavender shower gel for a relaxing bathing experience.",
    price: 1700,
    images: [],
    category: "body-care",
    categoryName: "BODY CARE",
    subcategory: "body-cleanser",
    subcategoryName: "BODY CLEANSER",
    stock: 100,
    featured: false,
    status: "active",
  },

  // Body Care - Body Lotions
  {
    _id: "10",
    name: "Shea Butter Body Lotion",
    slug: "shea-butter-body-lotion",
    description: "Rich shea butter lotion for deep hydration.",
    price: 2200,
    images: [],
    category: "body-care",
    categoryName: "BODY CARE",
    subcategory: "body-lotions",
    subcategoryName: "BODY LOTIONS",
    stock: 100,
    featured: false,
    status: "active",
  },

  // Body Care - Body Scrub
  {
    _id: "11",
    name: "Cinnamon Coffee Scrub",
    slug: "cinnamon-coffee-scrub",
    description: "Exfoliating coffee scrub with cinnamon for smooth, glowing skin.",
    price: 2500,
    images: [],
    category: "body-care",
    categoryName: "BODY CARE",
    subcategory: "body-scrub",
    subcategoryName: "BODY SCRUB",
    stock: 100,
    featured: false,
    status: "active",
  },

  // Body Care - Glycerin Bar
  {
    _id: "12",
    name: "Sandalwood Glycerin Soap",
    slug: "sandalwood-glycerin-soap",
    description: "Luxurious sandalwood glycerin soap for body cleansing.",
    price: 850,
    images: [],
    category: "body-care",
    categoryName: "BODY CARE",
    subcategory: "glycerin-bar",
    subcategoryName: "GLYCERIN BAR",
    stock: 100,
    featured: false,
    status: "active",
  },

  // Body Care - Foot Care
  {
    _id: "13",
    name: "Peppermint Foot Cream",
    slug: "peppermint-foot-cream",
    description: "Cooling peppermint foot cream for tired feet.",
    price: 1800,
    images: [],
    category: "body-care",
    categoryName: "BODY CARE",
    subcategory: "foot-care",
    subcategoryName: "FOOT CARE",
    stock: 100,
    featured: false,
    status: "active",
  },

  // Hair Care - Hair Oil
  {
    _id: "14",
    name: "Coconut Hair Oil",
    slug: "coconut-hair-oil",
    description: "Traditional coconut oil for strong, shiny hair.",
    price: 1500,
    images: [],
    category: "hair-care",
    categoryName: "HAIR CARE",
    subcategory: "hair-oil",
    subcategoryName: "HAIR OIL",
    stock: 100,
    featured: true,
    status: "active",
  },
  {
    _id: "15",
    name: "Herbal Growth Oil",
    slug: "herbal-growth-oil",
    description: "Blend of herbs to promote hair growth and thickness.",
    price: 2200,
    images: [],
    category: "hair-care",
    categoryName: "HAIR CARE",
    subcategory: "hair-oil",
    subcategoryName: "HAIR OIL",
    stock: 100,
    featured: false,
    status: "active",
  },

  // Hair Care - Shampoo & Conditioners
  {
    _id: "16",
    name: "Aloe Vera Shampoo",
    slug: "aloe-vera-shampoo",
    description: "Gentle aloe vera shampoo for all hair types.",
    price: 1800,
    images: [],
    category: "hair-care",
    categoryName: "HAIR CARE",
    subcategory: "shampoo-conditioners",
    subcategoryName: "SHAMPOO & CONDITIONERS",
    stock: 100,
    featured: false,
    status: "active",
  },
  {
    _id: "17",
    name: "Coconut Milk Conditioner",
    slug: "coconut-milk-conditioner",
    description: "Nourishing coconut milk conditioner for soft, manageable hair.",
    price: 1900,
    images: [],
    category: "hair-care",
    categoryName: "HAIR CARE",
    subcategory: "shampoo-conditioners",
    subcategoryName: "SHAMPOO & CONDITIONERS",
    stock: 100,
    featured: false,
    status: "active",
  },
]

// Helper functions
export function getCategoryData(categorySlug: string): CategoryData | undefined {
  return categories.find((category) => category.slug === categorySlug)
}

export function getSubcategoryData(categorySlug: string, subcategorySlug: string): SubcategoryData | undefined {
  const category = getCategoryData(categorySlug)
  if (!category) return undefined

  return category.subcategories.find((subcategory) => subcategory.slug === subcategorySlug)
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((product) => product.category === categorySlug)
}

export function getProductsBySubcategory(categorySlug: string, subcategorySlug: string): Product[] {
  return products.filter((product) => product.category === categorySlug && product.subcategory === subcategorySlug)
}

export function getAllCategories(): CategoryData[] {
  return categories
}

export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.featured)
}

export function getBestSellerProducts(): Product[] {
  return products.filter((product) => product.featured) // Adjusted to use 'featured' instead of 'bestSeller'
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug)
}
