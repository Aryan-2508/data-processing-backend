import {
    IndianRupee,
    ShoppingCart,
    Users,
    Package,
    Clock,
    CreditCard,
} from "lucide-react";

import KPICard from "./KPICard";
import useDashboard from "../hooks/useDashboard";
import MonthlyRevenueChart from "./MonthlyRevenueChart";
import RevenueByCategoryChart from "./RevenueByCategoryChart";
import PaymentStatusChart from "./PaymentStatusChart";
import MonthlyOrdersChart from "./MonthlyOrdersChart";

function DashboardPage() {
    const { dashboardData, loading, error } = useDashboard();

    if (loading) {
        return (
            <div className="flex min-h-64 items-center justify-center">
                <p className="text-slate-500">Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-5">
                <p className="font-medium text-red-600">
                    Failed to load dashboard
                </p>
                <p className="mt-1 text-sm text-red-500">{error}</p>
            </div>
        );
    }

    if (!dashboardData) {
        return <p className="text-slate-500">No dashboard data available.</p>;
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">
                    Dashboard Overview
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Here's an overview of your store's performance.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                <KPICard
                    title="Total Revenue"
                    value={`₹${dashboardData.totalRevenue.toLocaleString("en-IN")}`}
                    icon={IndianRupee}
                    description="Total successful payment revenue"
                />

                <KPICard
                    title="Total Orders"
                    value={dashboardData.totalOrders.toLocaleString("en-IN")}
                    icon={ShoppingCart}
                    description="Total orders recorded"
                />

                <KPICard
                    title="Total Customers"
                    value={dashboardData.totalCustomers.toLocaleString("en-IN")}
                    icon={Users}
                    description="Total registered customers"
                />

                <KPICard
                    title="Total Products"
                    value={dashboardData.totalProducts.toLocaleString("en-IN")}
                    icon={Package}
                    description="Total products available"
                />

                <KPICard
                    title="Pending Orders"
                    value={dashboardData.pendingOrders.toLocaleString("en-IN")}
                    icon={Clock}
                    description="Orders awaiting processing"
                />

                <KPICard
                    title="Successful Payments"
                    value={dashboardData.successfulPayments.toLocaleString("en-IN")}
                    icon={CreditCard}
                    description="Successfully completed payments"
                />


            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-2">

                <MonthlyRevenueChart
                    data={dashboardData.monthlyRevenue}
                />

                <RevenueByCategoryChart
                    data={dashboardData.RevenueByCategory}
                />

                <PaymentStatusChart
                    data={dashboardData.paymentStatusDistribution}
                />

                <MonthlyOrdersChart
                    data={dashboardData.monthlyOrders}
                />

            </div>
        </div>
    );
}

export default DashboardPage;