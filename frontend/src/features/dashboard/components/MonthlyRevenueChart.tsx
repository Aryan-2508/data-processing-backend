import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

import type { MonthlyRevenue } from "../types/dashboard.types";

interface MonthlyRevenueChartProps {
    data: MonthlyRevenue[];
}

const monthNames = [
    "Jan", "Feb", "Mar", "Apr",
    "May", "Jun", "Jul", "Aug",
    "Sep", "Oct", "Nov", "Dec"
];

function MonthlyRevenueChart({ data }: MonthlyRevenueChartProps) {

    const chartData = data.map((item) => ({
        month: monthNames[item._id.month - 1],
        revenue: item.totalRevenue
    }));

    const formatCurrency = (value: number) => {
        if (value >= 10000000) {
            return `₹${(value / 10000000).toFixed(1)}Cr`;
        }

        if (value >= 100000) {
            return `₹${(value / 100000).toFixed(1)}L`;
        }

        if (value >= 1000) {
            return `₹${(value / 1000).toFixed(1)}K`;
        }

        return `₹${value}`;
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-800">
                    Monthly Revenue
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Revenue generated throughout the year
                </p>
            </div>

            {chartData.length === 0 ? (
                <div className="flex h-80 items-center justify-center text-sm text-slate-500">
                    No revenue data available
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={320}>
                    <LineChart
                        data={chartData}
                        margin={{
                            top: 10,
                            right: 20,
                            left: 10,
                            bottom: 10
                        }}
                    >

                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                        />

                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={12}
                        />

                        <YAxis
                            tickFormatter={formatCurrency}
                            tickLine={false}
                            axisLine={false}
                            width={85}
                            tickMargin={10}
                        />

                        <Tooltip
                            formatter={(value) => [
                                formatCurrency(Number(value)),
                                "Revenue"
                            ]}
                        />

                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#6366f1"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />

                    </LineChart>
                </ResponsiveContainer>
            )}

        </div>
    );
}

export default MonthlyRevenueChart;