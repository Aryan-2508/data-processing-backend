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
        monthlyRevenue
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

        Payment.aggregate([
            {
                $match: {
                    "status": "success",
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
                $match: {
                    "orderDetails.orderDate": {
                        $gte: startDate,
                        $lt: endDate,
                    },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$orderDetails.orderDate" },
                        month: { $month: "$orderDetails.orderDate" },
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
        ])
    ]);

    const totalPayingUsers =
        payingUsersResult[0]?.totalPayingUsers ?? 0;

    const totalRevenue =
        revenueResult[0]?.totalRevenue ?? 0;

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
        monthlyRevenue,
        executionTime: `${executionTime.toFixed(2)} ms`,
    };
};