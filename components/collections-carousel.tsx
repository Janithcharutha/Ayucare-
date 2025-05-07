'use client'

import { useEffect, useRef } from 'react'
import CategoryCard from "@/components/CategoryCard"
import type { Category } from "@/lib/types"

interface CollectionsCarouselProps {
  categories: Category[]
}

export default function CollectionsCarousel({ categories }: CollectionsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' })
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-6 container mx-auto">
   
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4 pb-2 justify-center"
      >
        {categories.map((category) => (
          <div
            key={category._id.toString()}
            className="min-w-[250px] max-w-[250px] flex-shrink-0"
          >
            <CategoryCard category={category} />
          </div>
        ))}
      </div>
    </section>
  )
}
