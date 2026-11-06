import {
    IndianRupee,
    ShoppingCart,
    Users,
    Package,
    Clock,
    CreditCard,
} from "lucide-react";

import { useState } from "react";
import type { DashboardFilters } from "../types/dashboard.types";

import KPICard from "./KPICard";
import useDashboard from "../hooks/useDashboard";
import MonthlyRevenueChart from "./MonthlyRevenueChart";
import RevenueByCategoryChart from "./RevenueByCategoryChart";
import PaymentStatusChart from "./PaymentStatusChart";
import MonthlyOrdersChart from "./MonthlyOrdersChart";

function DashboardPage() {

    // Selected date filters
    const [filters, setFilters] = useState<DashboardFilters>({
        startDate: "",
        endDate: "",
    });

    // Applied date filters
    const [appliedFilters, setAppliedFilters] = useState<DashboardFilters>({
        startDate: "",
        endDate: "",
    });

    const { dashboardData, loading, error } = useDashboard(appliedFilters);


    // Apply date filters
    const handleApplyFilters = () => {

        if (
            (filters.startDate && !filters.endDate) ||
            (!filters.startDate && filters.endDate)
        ) {
            alert("Please select both start date and end date.");
            return;
        }

        if (
            filters.startDate &&
            filters.endDate &&
            filters.startDate > filters.endDate
        ) {
            alert("Start date cannot be later than end date.");
            return;
        }

        setAppliedFilters(filters);
    };


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

                <p className="mt-1 text-sm text-red-500">
                    {error}
                </p>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <p className="text-slate-500">
                No dashboard data available.
            </p>
        );
    }


    return (
        <div>

            {/* Dashboard Heading */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">
                    Dashboard Overview
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Here's an overview of your store's performance.
                </p>
            </div>


            {/* Date Filters */}
            <div className="mb-8 flex flex-wrap items-end gap-4">

                {/* Start Date */}
                <div>
                    <label
                        htmlFor="startDate"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Start Date
                    </label>

                    <input
                        id="startDate"
                        type="date"
                        value={filters.startDate}
                        onChange={(event) =>
                            setFilters((previousFilters) => ({
                                ...previousFilters,
                                startDate: event.target.value,
                            }))
                        }
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                </div>


                {/* End Date */}
                <div>
                    <label
                        htmlFor="endDate"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        End Date
                    </label>

                    <input
                        id="endDate"
                        type="date"
                        value={filters.endDate}
                        onChange={(event) =>
                            setFilters((previousFilters) => ({
                                ...previousFilters,
                                endDate: event.target.value,
                            }))
                        }
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                </div>


                {/* Apply Filters Button */}
                <button
                    onClick={handleApplyFilters}
                    disabled={loading}
                    className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Apply Filters
                </button>

            </div>


            {/* KPI Cards */}
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


            {/* Dashboard Charts */}
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