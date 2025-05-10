"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Printer, Mail, Truck, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
////////////////

interface PageProps {
  params: {
    id: string;
  };
}

/////////////

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params

  // Sample order data
  const [order, setOrder] = useState({
    id: id,
    customer: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+94 77 123 4567",
    date: "2023-05-01",
    status: "Delivered",
    paymentStatus: "Paid",
    paymentMethod: "Credit Card",
    shippingAddress: {
      line1: "123 Temple Road",
      line2: "Apartment 4B",
      city: "Colombo",
      postalCode: "00400",
      country: "Sri Lanka",
    },
    items: [
      {
        id: 1,
        name: "Kasthuri Kaha Night Cream",
        image: "/placeholder.svg?height=80&width=80&text=Kasthuri+Kaha",
        price: 4750,
        quantity: 1,
        total: 4750,
      },
      {
        id: 2,
        name: "Vitamin C Serum",
        image: "/placeholder.svg?height=80&width=80&text=Vitamin+C",
        price: 2700,
        originalPrice: 3000,
        quantity: 2,
        total: 5400,
      },
    ],
    subtotal: 10150,
    shipping: 350,
    discount: 0,
    total: 10500,
    notes: "Please leave the package at the door if no one answers.",
    timeline: [
      { status: "Order Placed", date: "2023-05-01 09:15 AM" },
      { status: "Payment Confirmed", date: "2023-05-01 09:20 AM" },
      { status: "Processing", date: "2023-05-01 11:30 AM" },
      { status: "Shipped", date: "2023-05-02 02:45 PM" },
      { status: "Delivered", date: "2023-05-03 10:20 AM" },
    ],
  })

  // Update order status
  const updateOrderStatus = (newStatus: string) => {
    setOrder({
      ...order,
      status: newStatus,
      timeline: [...order.timeline, { status: newStatus, date: new Date().toLocaleString() }],
    })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Link href="/admin/orders">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Orders
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Order {order.id}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Email Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>View and manage order information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium">{order.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium">{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Status</p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`${
                      order.status === "Delivered"
                        ? "border-green-500 text-green-700"
                        : order.status === "Processing"
                          ? "border-blue-500 text-blue-700"
                          : order.status === "Shipped"
                            ? "border-purple-500 text-purple-700"
                            : order.status === "Cancelled"
                              ? "border-red-500 text-red-700"
                              : "border-yellow-500 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </Badge>
                  <Select value={order.status} onValueChange={updateOrderStatus}>
                    <SelectTrigger className="w-[140px] h-8">
                      <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Shipped">Shipped</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <h3 className="font-medium">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded overflow-hidden">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm">
                            Rs.{item.price.toLocaleString()} x {item.quantity}
                          </p>
                          {item.originalPrice && (
                            <p className="text-xs text-gray-500 line-through">
                              Rs.{item.originalPrice.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="font-medium">Rs.{item.total.toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-4 rounded-md mt-6">
                <div className="flex justify-between py-2">
                  <p>Subtotal</p>
                  <p>Rs.{order.subtotal.toLocaleString()}</p>
                </div>
                <div className="flex justify-between py-2">
                  <p>Shipping</p>
                  <p>Rs.{order.shipping.toLocaleString()}</p>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between py-2">
                    <p>Discount</p>
                    <p>-Rs.{order.discount.toLocaleString()}</p>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between py-2 font-medium">
                  <p>Total</p>
                  <p>Rs.{order.total.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{order.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{order.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{order.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative border-l border-gray-200 pl-4 ml-2 space-y-6">
                {order.timeline.map((event, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-[21px] w-4 h-4 rounded-full bg-white border-2 border-black"></div>
                    <div>
                      <p className="font-medium">{event.status}</p>
                      <p className="text-sm text-gray-500">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        {order.status === "Processing" && (
          <Button className="flex items-center gap-2" onClick={() => updateOrderStatus("Shipped")}>
            <Truck className="h-4 w-4" />
            Mark as Shipped
          </Button>
        )}
        {order.status === "Shipped" && (
          <Button className="flex items-center gap-2" onClick={() => updateOrderStatus("Delivered")}>
            <CheckCircle className="h-4 w-4" />
            Mark as Delivered
          </Button>
        )}
        {(order.status === "Pending" || order.status === "Processing") && (
          <Button
            variant="destructive"
            className="flex items-center gap-2"
            onClick={() => updateOrderStatus("Cancelled")}
          >
            <XCircle className="h-4 w-4" />
            Cancel Order
          </Button>
        )}
      </div>
    </div>
  )
}
