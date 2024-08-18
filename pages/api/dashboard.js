import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";

export default async function handler(req, res) {
  await mongooseConnect();
  if (req.method === "GET") {
    try {
      const totalProducts = await Product.countDocuments();
      const totalOrders = await Order.countDocuments();
      const orders = await Order.find({ paid: true });

      let totalSales = 0;
      let monthlySales = {};

      for (const order of orders) {
        if (order.line_items && Array.isArray(order.line_items)) {
          let orderTotal = 0;
          for (const item of order.line_items) {
            if (item.unit_amount) {
              orderTotal += item.unit_amount * (item.quantity || 1);
            }
          }
          totalSales += orderTotal;

          // Calculate monthly sales
          const orderDate = new Date(order.createdAt);
          const monthYear = `${orderDate.getFullYear()}-${String(
            orderDate.getMonth() + 1
          ).padStart(2, "0")}`;
          monthlySales[monthYear] = (monthlySales[monthYear] || 0) + orderTotal;
        }
      }

      // Convert monthlySales object to array and sort
      const monthlySalesArray = Object.entries(monthlySales)
        .map(([month, sales]) => ({
          month,
          sales,
        }))
        .sort((a, b) => a.month.localeCompare(b.month));

      res.status(200).json({
        totalProducts,
        totalOrders,
        totalSales: totalSales,
        monthlySales: monthlySalesArray,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
