"use client"

import { Phone } from "lucide-react"

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/94123456789"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white rounded-full p-3 shadow-lg hover:bg-green-600 transition-colors z-50"
      aria-label="Chat on WhatsApp"
    >
      <div className="relative">
        <Phone className="h-6 w-6" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          1
        </span>
      </div>
    </a>
  )
}
