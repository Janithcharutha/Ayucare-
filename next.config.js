/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'res.cloudinary.com',
      'storage.googleapis.com',
      // Add other image domains you use
    ],
    unoptimized: process.env.NODE_ENV === 'development'
  },
}

module.exports = nextConfig