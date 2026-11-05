import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    Legend
} from "recharts";

import type { PaymentStatusDistribution } from "../types/dashboard.types";

interface PaymentStatusChartProps {
    data: PaymentStatusDistribution[];
}

const COLORS: Record<string, string> = {
    success: "#22c55e",
    pending: "#f59e0b",
    failed: "#ef4444",
    refunded: "#6366f1"
};

function PaymentStatusChart({ data }: PaymentStatusChartProps) {

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-800">
                    Payment Status Distribution
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Distribution of payments across different statuses
                </p>
            </div>

            {data.length === 0 ? (
                <div className="flex h-80 items-center justify-center text-sm text-slate-500">
                    No payment data available
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={320}>
                    <PieChart>

                        <Pie
                            data={data}
                            dataKey="count"
                            nameKey="status"
                            cx="50%"
                            cy="50%"
                            innerRadius={65}
                            outerRadius={100}
                            paddingAngle={3}
                        >
                            {data.map((entry) => (
                                <Cell
                                    key={entry.status}
                                    fill={COLORS[entry.status]}
                                />
                            ))}
                        </Pie>

                        <Tooltip />

                        <Legend />

                    </PieChart>
                </ResponsiveContainer>
            )}

        </div>
    );
}

export default PaymentStatusChart;