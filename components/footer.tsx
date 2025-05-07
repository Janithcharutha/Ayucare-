import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-beige-dark text-gray-800 pt-16 pb-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-playfair text-xl mb-4">About Us</h3>
            <p className="text-sm mb-4">
              Ayucareoffers premium natural beauty and wellness products inspired by the rich heritage of
              Ceylon.
            </p>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" className="hover:text-gray-600">
                <Facebook size={20} />
              </Link>
              <Link href="https://instagram.com" className="hover:text-gray-600">
                <Instagram size={20} />
              </Link>
              <Link href="https://twitter.com" className="hover:text-gray-600">
                <Twitter size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-playfair text-xl mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="hover:underline">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:underline">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:underline">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-playfair text-xl mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shipping" className="hover:underline">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:underline">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:underline">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-playfair text-xl mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li>123 Temple Road, Colombo</li>
              <li>+94 11 234 5678</li>
              <li>info@aromablissceylon.lk</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-300 mt-12 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Aroma Bliss Ceylon. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
