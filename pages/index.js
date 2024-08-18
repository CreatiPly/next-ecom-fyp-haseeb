import { useEffect, useState } from "react";
import axios from "axios";
import DashInfoCard from "@/components/DashInfoCard";
import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

export default function Home() {
  const { data: session } = useSession();
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    monthlySales: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await axios.get("/api/dashboard");
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchDashboardData();
  }, []);

  const formatLargeNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    } else {
      return num.toString();
    }
  };

  const formatCurrency = (amount) => {
    const formattedNumber = formatLargeNumber(amount);
    return `PKR ${formattedNumber}`;
  };

  const barChartData = [
    { name: "Products", value: dashboardData.totalProducts },
    { name: "Orders", value: dashboardData.totalOrders },
  ];

  return (
    <Layout>
      <div className="text-blue-900 flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold mb-4 sm:mb-0">
          Hello, <b>{session?.user?.name}</b>
        </h1>
        <div className="flex items-center justify-center bg-gray-300 text-black gap-2 rounded-lg overflow-hidden p-2">
          <img
            src={session?.user?.image}
            alt="User"
            className="w-8 h-8 rounded-full"
          />
          <span>{session?.user?.name}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <DashInfoCard
          title="Total Products"
          value={formatLargeNumber(dashboardData.totalProducts)}
          link="/products"
        />
        <DashInfoCard
          title="Total Orders"
          value={formatLargeNumber(dashboardData.totalOrders)}
          link="/orders"
        />
        <DashInfoCard
          title="Total Sales"
          value={formatCurrency(dashboardData.totalSales)}
          link="/orders"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Products and Orders</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Monthly Sales</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardData.monthlySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
}
