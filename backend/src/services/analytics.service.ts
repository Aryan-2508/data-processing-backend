import Customer from "../models/customer.model";
import Product from "../models/product.model";
import Order from "../models/order.model";
import Payment from "../models/payment.model";

export const getDashboardAnalytics = async () => {

    const currentYear = new Date().getFullYear();

    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear + 1, 0, 1);

    const startTime = performance.now();

    const [
        totalCustomers,
        totalProducts,
        totalOrders,
        pendingOrders,
        successfulPayments,
        revenueResult,
        payingUsersResult,
        revenueByCategoryResult,
        monthlyRevenue,
        monthlyOrders,
        paymentStatusDistribution
    ] = await Promise.all([

        Customer.countDocuments(),

        Product.countDocuments(),

        Order.countDocuments(),

        Order.countDocuments({
            orderStatus: "pending",
        }),

        Payment.countDocuments({
            status: "success",
        }),

        // Total revenue
        Payment.aggregate([
            {
                $match: {
                    status: "success",
                },
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$amount",
                    },
                },
            },
        ]),

        // Total paying users
        Payment.aggregate([
            {
                $match: {
                    status: "success",
                },
            },
            {
                $lookup: {
                    from: "orders",
                    localField: "order",
                    foreignField: "_id",
                    as: "order",
                },
            },
            {
                $unwind: "$order",
            },
            {
                $group: {
                    _id: "$order.customer",
                },
            },
            {
                $count: "totalPayingUsers",
            },
        ]),

        // Revenue by category
        Payment.aggregate([
            {
                $match: {
                    status: "success",
                },
            },
            {
                $lookup: {
                    from: "orders",
                    localField: "order",
                    foreignField: "_id",
                    as: "orderDetails",
                },
            },
            {
                $unwind: "$orderDetails",
            },
            {
                $unwind: "$orderDetails.items",
            },
            {
                $lookup: {
                    from: "products",
                    localField: "orderDetails.items.product",
                    foreignField: "_id",
                    as: "productDetails",
                },
            },
            {
                $unwind: "$productDetails",
            },
            {
                $group: {
                    _id: "$productDetails.category",
                    totalRevenue: {
                        $sum: {
                            $multiply: [
                                "$orderDetails.items.quantity",
                                "$orderDetails.items.unitPrice",
                            ],
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    totalRevenue: 1,
                },
            },
            {
                $sort: {
                    totalRevenue: -1,
                },
            },
        ]),

        // Monthly revenue
        Payment.aggregate([
            {
                $match: {
                    status: "success",
                    paymentDate: {
                        $gte: startDate,
                        $lt: endDate,
                    },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$paymentDate" },
                        month: { $month: "$paymentDate" },
                    },
                    totalRevenue: {
                        $sum: "$amount",
                    },
                },
            },
            {
                $sort: {
                    "_id.month": 1,
                },
            },
        ]),

        // Monthly orders
        Order.aggregate([
            {
                $match: {
                    orderDate: {
                        $gte: startDate,
                        $lt: endDate,
                    },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$orderDate" },
                        month: { $month: "$orderDate" },
                    },
                    totalOrders: { $sum: 1 },
                },
            },
            {
                $sort: {
                    "_id.month": 1,
                },
            },
        ]),

        // Payment status distribution
        Payment.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: {
                        $sum: 1,
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    status: "$_id",
                    count: 1,
                },
            },
        ])

    ]);

    // Total paying users
    const totalPayingUsers =
        payingUsersResult[0]?.totalPayingUsers ?? 0;

    // Normalize monthly revenue
    const monthlyRevenueMap = new Map(
        monthlyRevenue.map((item) => [
            item._id.month,
            item.totalRevenue
        ])
    );

    const completeMonthlyRevenue = Array.from(
        { length: 12 },
        (_, index) => {
            const month = index + 1;

            return {
                _id: {
                    year: currentYear,
                    month
                },
                totalRevenue: monthlyRevenueMap.get(month) ?? 0
            };
        }
    );

    // Normalize monthly orders
    const monthlyOrdersMap = new Map(
        monthlyOrders.map((item) => [
            item._id.month,
            item.totalOrders
        ])
    );

    const completeMonthlyOrders = Array.from(
        { length: 12 },
        (_, index) => {
            const month = index + 1;

            return {
                _id: {
                    year: currentYear,
                    month
                },
                totalOrders: monthlyOrdersMap.get(month) ?? 0
            };
        }
    );

    // Total revenue
    const totalRevenue =
        revenueResult[0]?.totalRevenue ?? 0;

    // Average revenue per user
    const averageRevenuePerUser =
        totalPayingUsers > 0
            ? totalRevenue / totalPayingUsers
            : 0;

    const endTime = performance.now();

    const executionTime = endTime - startTime;

    console.log("Current year:", currentYear);
    console.log("Start date:", startDate);
    console.log("End date:", endDate);

    return {
        totalCustomers,
        totalProducts,
        totalOrders,
        totalRevenue,
        pendingOrders,
        successfulPayments,
        totalPayingUsers,
        averageRevenuePerUser: Number(averageRevenuePerUser.toFixed(2)),
        RevenueByCategory: revenueByCategoryResult,
        monthlyRevenue: completeMonthlyRevenue,
        monthlyOrders: completeMonthlyOrders,
        paymentStatusDistribution,
        executionTime: `${executionTime.toFixed(2)} ms`,
    };
};