"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // In a real application, you would call your logout API here
    // For now, we'll just simulate a logout by redirecting after a delay
    const timer = setTimeout(() => {
      // Redirect to login page
      router.push("/login")
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
      <Loader2 className="h-12 w-12 animate-spin text-gray-500 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Logging Out</h1>
      <p className="text-gray-500">Please wait while we log you out...</p>
    </div>
  )
}
