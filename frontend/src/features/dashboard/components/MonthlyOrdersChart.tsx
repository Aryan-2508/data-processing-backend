import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

import type { MonthlyOrders } from "../types/dashboard.types";

interface MonthlyOrdersChartProps {
    data: MonthlyOrders[];
}

const monthNames = [
    "Jan", "Feb", "Mar", "Apr",
    "May", "Jun", "Jul", "Aug",
    "Sep", "Oct", "Nov", "Dec"
];

function MonthlyOrdersChart({ data }: MonthlyOrdersChartProps) {
    const chartData = data.map((item) => ({
        month: monthNames[item._id.month - 1],
        totalOrders: item.totalOrders
    }));

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-800">
                    Monthly Orders
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Number of orders placed each month
                </p>
            </div>

            {data.length === 0 ? (
                <div className="flex h-80 items-center justify-center text-sm text-slate-500">
                    No order data available
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={320}>
                    <AreaChart data={chartData}>
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
                            dataKey="totalOrders"
                            tickLine={false}
                            axisLine={false}
                            width={50}
                        />

                        <Tooltip />

                        <Area
                            type="monotone"
                            dataKey="totalOrders"
                            stroke="#6366f1"
                            fill="#818cf8"
                            fillOpacity={0.25}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}

export default MonthlyOrdersChart;