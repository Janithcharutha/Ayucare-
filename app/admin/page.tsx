import Link from "next/link"
import { Package, ShoppingBag, Users, DollarSign, TrendingUp, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboard() {
  // Sample data for dashboard
  const stats = [
    { name: "Total Products", value: "124", icon: Package, change: "+12% from last month" },
    { name: "Total Orders", value: "85", icon: ShoppingBag, change: "+5% from last month" },
    { name: "Total Customers", value: "1,240", icon: Users, change: "+18% from last month" },
    { name: "Revenue", value: "Rs.245,000", icon: DollarSign, change: "+8% from last month" },
  ]

  // Sample recent orders
  const recentOrders = [
    { id: "ORD-001", customer: "Sarah Johnson", date: "2023-05-01", status: "Delivered", total: "Rs.4,750" },
    { id: "ORD-002", customer: "Michael Brown", date: "2023-05-02", status: "Processing", total: "Rs.6,320" },
    { id: "ORD-003", customer: "Emily Davis", date: "2023-05-03", status: "Shipped", total: "Rs.3,280" },
    { id: "ORD-004", customer: "David Wilson", date: "2023-05-04", status: "Pending", total: "Rs.8,150" },
    { id: "ORD-005", customer: "Jennifer Lee", date: "2023-05-05", status: "Delivered", total: "Rs.5,480" },
  ]

  // Sample low stock alerts
  const lowStockAlerts = [
    { id: 1, name: "Kasthuri Kaha Night Cream", stock: 3, category: "Face Care" },
    { id: 2, name: "Vitamin C Serum", stock: 5, category: "Face Care" },
    { id: 3, name: "Coconut Hair Oil", stock: 2, category: "Hair Care" },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest 5 orders across the store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-3 font-medium">Order ID</th>
                    <th className="text-left pb-3 font-medium">Customer</th>
                    <th className="text-left pb-3 font-medium">Date</th>
                    <th className="text-left pb-3 font-medium">Status</th>
                    <th className="text-right pb-3 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b">
                      <td className="py-3">
                        <Link href={`/admin/orders/${order.id}`} className="text-blue-600 hover:underline">
                          {order.id}
                        </Link>
                      </td>
                      <td className="py-3">{order.customer}</td>
                      <td className="py-3">{order.date}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Processing"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "Shipped"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">{order.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right">
              <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline">
                View all orders
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Low stock alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
              Low Stock Alerts
            </CardTitle>
            <CardDescription>Products that need restocking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockAlerts.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-3">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-500 font-medium">{item.stock} left</p>
                    <Link href={`/admin/products/${item.id}`} className="text-xs text-blue-600 hover:underline">
                      Update stock
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-right">
              <Link href="/admin/products" className="text-sm text-blue-600 hover:underline">
                Manage inventory
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
