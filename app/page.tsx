import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import CategoryCard from "@/components/CategoryCard"
import { getCategories } from "@/lib/api"
import CollectionsCarousel from "@/components/collections-carousel"
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { getFeaturedProducts } from "@/lib/db"
import type { EmblaOptionsType } from 'embla-carousel'

// Add carousel options
const carouselOptions: EmblaOptionsType = {
  align: "start",
  loop: true,
  slidesToScroll: 4,
  breakpoints: {
    '(max-width: 1024px)': { slidesToScroll: 3 },
    '(max-width: 768px)': { slidesToScroll: 2 },
    '(max-width: 640px)': { slidesToScroll: 1 }
  }
}

export default async function Home() {
  const categories = await getCategories()
  const featuredProducts = await getFeaturedProducts()

  return (
    <div>
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden">
        <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[90vh] lg:h-[100vh]">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-contain md:object-cover"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
            {/* Fallback image for unsupported browsers */}
            <img
              src="/placeholder.svg?height=600&width=1920"
              alt="Seasonal Gift Boxes"
              className="w-full h-full object-contain"
            />
          </video>
        </div>
      </section>

      {/* Our Collections Section */}
      <CollectionsCarousel categories={categories} />

      {/* Featured Products */}
      <section className="py-16 bg-beige">
        <div className="container mx-auto">
          <h2 className="font-playfair text-4xl text-center mb-12">Bestsellers</h2>
          <Carousel className="relative" opts={carouselOptions}>
            <CarouselContent className="-ml-4">
              {featuredProducts.map((product) => (
                <div key={product._id} className="pl-4 w-full" style={{ flex: '0 0 300px' }}>
                  <div className="group h-full bg-white rounded-lg overflow-hidden">
                    <Link href={`/products/${product.category}/${product.subcategory}/${product.slug}`}>
                      <div className="relative h-[300px] overflow-hidden">
                        <Image
                          src={product.images[0] || `/placeholder.svg?height=300&width=300&text=${product.name}`}
                          alt={product.name}
                          width={300}
                          height={300}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    </Link>
                    <div className="p-4">
                      <h3 className="font-playfair text-xl mb-2 truncate">{product.name}</h3>
                      <p className="text-gray-700 mb-4">RS. {product.price.toLocaleString()}</p>
                      <Button className="w-full">Add to Cart</Button>
                    </div>
                  </div>
                </div>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-12 top-1/2 transform -translate-y-1/2" />
            <CarouselNext className="absolute -right-12 top-1/2 transform -translate-y-1/2" />
          </Carousel>
        </div>
      </section>

      {/* Gift Boxes Banner */}
      <section className="py-16 container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <Image
              src="/placeholder.svg?height=600&width=600&text=Gift+Boxes"
              alt="Gift Boxes"
              width={600}
              height={600}
              className="rounded-lg"
            />
          </div>
          <div className="max-w-lg">
            <h2 className="font-playfair text-4xl mb-6">Curated Gift Boxes</h2>
            <p className="text-gray-700 mb-6">
              Our specially curated gift boxes combine the finest natural products from Ceylon. Perfect for gifting or
              treating yourself to a complete wellness experience.
            </p>
            <p className="text-gray-700 mb-8">
              Each box is thoughtfully designed to provide a holistic experience, featuring our bestselling products in
              elegant packaging.
            </p>
            <Link href="/gifting">
              <Button size="lg">Explore Gift Boxes</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-beige">
        <div className="container mx-auto">
          <h2 className="font-playfair text-4xl text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah J.",
                text: "The Vitamin C Serum has completely transformed my skin. I've been using it for a month and my complexion is brighter and more even-toned.",
              },
              {
                name: "Michael T.",
                text: "I purchased a gift box for my wife's birthday and she absolutely loved it. The packaging was beautiful and the products are high quality.",
              },
              {
                name: "Priya D.",
                text: "The Ceylon Tea Face Mask is now a staple in my skincare routine. It leaves my skin feeling refreshed and rejuvenated.",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-beige-dark flex items-center justify-center mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <h3 className="font-playfair text-xl">{testimonial.name}</h3>
                </div>
                <p className="text-gray-700">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 container mx-auto">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-playfair text-4xl mb-6">Join Our Newsletter</h2>
          <p className="text-gray-700 mb-8">
            Subscribe to receive updates on new products, special offers, and wellness tips.
          </p>
          <form className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <Button type="submit" className="whitespace-nowrap">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  )
}
