import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
    });
  }, []);
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1>Orders</h1>
        <table className="basic">
          <thead>
            <tr>
              <th>Date</th>
              <th>Paid</th>
              <th>Recipient</th>
              <th>Products</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 &&
              orders.map((order) => (
                <tr key={order._id}>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td
                    className={order.paid ? "text-green-600" : "text-red-600"}
                  >
                    <span>{order.paid ? "YES" : "NO"}</span>
                  </td>
                  <td>
                    {order.name} {order.email}
                    <br />
                    {order.city} {order.postalCode} {order.country}
                    <br />
                    {order.streetAddress}
                  </td>
                  <td>
                    {order.line_items.map((l) => (
                      <>
                        {l.product_data.name} x{l.quantity}
                        <br />
                      </>
                    ))}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
