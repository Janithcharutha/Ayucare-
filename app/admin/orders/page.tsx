// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import { Search, Filter, Eye, Truck, CheckCircle, XCircle } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// export default function OrdersPage() {
//   // Sample orders data
//   const [orders, setOrders] = useState([
//     {
//       id: "ORD-001",
//       customer: "Sarah Johnson",
//       email: "sarah@example.com",
//       date: "2023-05-01",
//       status: "Delivered",
//       total: 4750,
//       items: 2,
//       paymentStatus: "Paid",
//     },
//     {
//       id: "ORD-002",
//       customer: "Michael Brown",
//       email: "michael@example.com",
//       date: "2023-05-02",
//       status: "Processing",
//       total: 6320,
//       items: 3,
//       paymentStatus: "Paid",
//     },
//     {
//       id: "ORD-003",
//       customer: "Emily Davis",
//       email: "emily@example.com",
//       date: "2023-05-03",
//       status: "Shipped",
//       total: 3280,
//       items: 1,
//       paymentStatus: "Paid",
//     },
//     {
//       id: "ORD-004",
//       customer: "David Wilson",
//       email: "david@example.com",
//       date: "2023-05-04",
//       status: "Pending",
//       total: 8150,
//       items: 4,
//       paymentStatus: "Pending",
//     },
//     {
//       id: "ORD-005",
//       customer: "Jennifer Lee",
//       email: "jennifer@example.com",
//       date: "2023-05-05",
//       status: "Delivered",
//       total: 5480,
//       items: 2,
//       paymentStatus: "Paid",
//     },
//     {
//       id: "ORD-006",
//       customer: "Robert Chen",
//       email: "robert@example.com",
//       date: "2023-05-06",
//       status: "Cancelled",
//       total: 2200,
//       items: 1,
//       paymentStatus: "Refunded",
//     },
//   ])

//   // State for search and filters
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("")

//   // Filter orders based on search term and status
//   const filteredOrders = orders.filter((order) => {
//     const matchesSearch =
//       order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.email.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesStatus = statusFilter ? order.status === statusFilter : true
//     return matchesSearch && matchesStatus
//   })

//   // Update order status
//   const updateOrderStatus = (orderId: string, newStatus: string) => {
//     setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
//   }

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Orders</h1>
//       </div>

//       <div className="flex flex-col md:flex-row gap-4 mb-6">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//           <Input
//             placeholder="Search by order ID, customer name, or email..."
//             className="pl-10"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <div className="flex gap-2">
//           <Select value={statusFilter} onValueChange={setStatusFilter}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="All Statuses" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Statuses</SelectItem>
//               <SelectItem value="Pending">Pending</SelectItem>
//               <SelectItem value="Processing">Processing</SelectItem>
//               <SelectItem value="Shipped">Shipped</SelectItem>
//               <SelectItem value="Delivered">Delivered</SelectItem>
//               <SelectItem value="Cancelled">Cancelled</SelectItem>
//             </SelectContent>
//           </Select>
//           <Button variant="outline" className="flex gap-2">
//             <Filter size={18} />
//             More Filters
//           </Button>
//         </div>
//       </div>

//       <Card>
//         <CardContent className="p-0">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b bg-gray-50">
//                   <th className="text-left p-4 font-medium">Order ID</th>
//                   <th className="text-left p-4 font-medium">Customer</th>
//                   <th className="text-left p-4 font-medium">Date</th>
//                   <th className="text-left p-4 font-medium">Status</th>
//                   <th className="text-left p-4 font-medium">Payment</th>
//                   <th className="text-left p-4 font-medium">Total</th>
//                   <th className="text-right p-4 font-medium">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredOrders.map((order) => (
//                   <tr key={order.id} className="border-b hover:bg-gray-50">
//                     <td className="p-4 font-medium">{order.id}</td>
//                     <td className="p-4">
//                       <div>
//                         <p>{order.customer}</p>
//                         <p className="text-xs text-gray-500">{order.email}</p>
//                       </div>
//                     </td>
//                     <td className="p-4">{order.date}</td>
//                     <td className="p-4">
//                       <Badge
//                         variant="outline"
//                         className={`${
//                           order.status === "Delivered"
//                             ? "border-green-500 text-green-700"
//                             : order.status === "Processing"
//                               ? "border-blue-500 text-blue-700"
//                               : order.status === "Shipped"
//                                 ? "border-purple-500 text-purple-700"
//                                 : order.status === "Cancelled"
//                                   ? "border-red-500 text-red-700"
//                                   : "border-yellow-500 text-yellow-700"
//                         }`}
//                       >
//                         {order.status}
//                       </Badge>
//                     </td>
//                     <td className="p-4">
//                       <Badge
//                         variant={
//                           order.paymentStatus === "Paid"
//                             ? "default"
//                             : order.paymentStatus === "Refunded"
//                               ? "destructive"
//                               : "secondary"
//                         }
//                       >
//                         {order.paymentStatus}
//                       </Badge>
//                     </td>
//                     <td className="p-4">
//                       <div>
//                         <p>Rs.{order.total.toLocaleString()}</p>
//                         <p className="text-xs text-gray-500">{order.items} items</p>
//                       </div>
//                     </td>
//                     <td className="p-4 text-right">
//                       <div className="flex justify-end gap-2">
//                         <Button variant="ghost" size="sm" asChild>
//                           <Link href={`/admin/orders/${order.id}`}>
//                             <Eye className="h-4 w-4" />
//                           </Link>
//                         </Button>
//                         {order.status === "Processing" && (
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="text-purple-500 hover:text-purple-700"
//                             onClick={() => updateOrderStatus(order.id, "Shipped")}
//                           >
//                             <Truck className="h-4 w-4" />
//                           </Button>
//                         )}
//                         {order.status === "Shipped" && (
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="text-green-500 hover:text-green-700"
//                             onClick={() => updateOrderStatus(order.id, "Delivered")}
//                           >
//                             <CheckCircle className="h-4 w-4" />
//                           </Button>
//                         )}
//                         {(order.status === "Pending" || order.status === "Processing") && (
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="text-red-500 hover:text-red-700"
//                             onClick={() => updateOrderStatus(order.id, "Cancelled")}
//                           >
//                             <XCircle className="h-4 w-4" />
//                           </Button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
