export interface RevenueByCategory {
    category: string;
    totalRevenue: number;
}

export interface MonthlyRevenue {
    _id: {
        year: number;
        month: number;
    };
    totalRevenue: number;
}

export interface PaymentStatusDistribution {
    status: "pending" | "success" | "failed" | "refunded";
    count: number;
}

export interface DashboardAnalytics {
    totalCustomers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    successfulPayments: number;
    totalPayingUsers: number;
    averageRevenuePerUser: number;
    RevenueByCategory: RevenueByCategory[];
    monthlyRevenue: MonthlyRevenue[];
    paymentStatusDistribution: PaymentStatusDistribution[];
    executionTime: string;
}

export interface DashboardApiResponse {
    success: boolean;
    message: string;
    data: DashboardAnalytics;
}