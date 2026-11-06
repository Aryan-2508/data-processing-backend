import Customer from "../models/customer.model";
import Product from "../models/product.model";
import Order from "../models/order.model";
import Payment from "../models/payment.model";


// Generate every month between the selected dates.
// If no dates are selected, determine the range from actual database results.
const getMonthsInRange = (
    start: Date | undefined,
    end: Date | undefined,
    monthlyOrders: any[],
    monthlyRevenue: any[]
) => {
    const months: { year: number; month: number }[] = [];

    let firstMonth: number;
    let lastMonth: number;

    if (start && end) {

        firstMonth =
            start.getUTCFullYear() * 12 + start.getUTCMonth();

        lastMonth =
            end.getUTCFullYear() * 12 + end.getUTCMonth();

    } else {

        // Combine available months from orders and revenue
        const availableMonths = [
            ...monthlyOrders,
            ...monthlyRevenue,
        ].map((item: any) => {
            return (
                item._id.year * 12 +
                item._id.month - 1
            );
        });

        // No records available
        if (availableMonths.length === 0) {
            return months;
        }

        firstMonth = Math.min(...availableMonths);
        lastMonth = Math.max(...availableMonths);
    }

    for (
        let currentMonth = firstMonth;
        currentMonth <= lastMonth;
        currentMonth++
    ) {
        const year = Math.floor(currentMonth / 12);
        const month = (currentMonth % 12) + 1;

        months.push({
            year,
            month,
        });
    }

    return months;
};


export const getDashboardAnalytics = async (
    start?: Date,
    end?: Date
) => {

    const startTime = performance.now();

    // Current date: exclude future-dated records
    const today = new Date();

    today.setUTCHours(23, 59, 59, 999);


    // Dynamic date conditions
    // Custom range when dates are provided
    // All historical data up to today when dates are not provided

    const orderMatch = start && end
        ? {
            orderDate: {
                $gte: start,
                $lte: end,
            },
        }
        : {
            orderDate: {
                $lte: today,
            },
        };


    const paymentMatch = start && end
        ? {
            paymentDate: {
                $gte: start,
                $lte: end,
            },
        }
        : {
            paymentDate: {
                $lte: today,
            },
        };


    // Run independent database operations concurrently
    const [
        totalCustomers,
        totalProducts,
        categories,
        orderAnalytics,
        paymentAnalytics
    ] = await Promise.all([

        // Total customers
        Customer.countDocuments(),

        // Total products
        Product.countDocuments(),

        // Get all available product categories
        Product.distinct("category"),

        // Order analytics
        Order.aggregate([

            {
                $match: orderMatch,
            },

            {
                $facet: {

                    // Total orders
                    totalOrders: [
                        {
                            $count: "count",
                        },
                    ],


                    // Pending orders
                    pendingOrders: [
                        {
                            $match: {
                                orderStatus: "pending",
                            },
                        },
                        {
                            $count: "count",
                        },
                    ],


                    // Monthly orders
                    monthlyOrders: [
                        {
                            $group: {
                                _id: {
                                    year: {
                                        $year: "$orderDate",
                                    },
                                    month: {
                                        $month: "$orderDate",
                                    },
                                },
                                totalOrders: {
                                    $sum: 1,
                                },
                            },
                        },
                        {
                            $sort: {
                                "_id.year": 1,
                                "_id.month": 1,
                            },
                        },
                    ],

                },
            },

        ]),


        // Payment analytics
        Payment.aggregate([

            {
                $match: paymentMatch,
            },

            {
                $facet: {

                    // Successful payments
                    successfulPayments: [
                        {
                            $match: {
                                status: "success",
                            },
                        },
                        {
                            $count: "count",
                        },
                    ],


                    // Total revenue
                    revenue: [
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
                    ],


                    // Total paying users
                    payingUsers: [
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
                            $group: {
                                _id: "$orderDetails.customer",
                            },
                        },
                        {
                            $count: "totalPayingUsers",
                        },
                    ],


                    // Revenue by category
                    revenueByCategory: [
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
                    ],


                    // Monthly revenue
                    monthlyRevenue: [
                        {
                            $match: {
                                status: "success",
                            },
                        },
                        {
                            $group: {
                                _id: {
                                    year: {
                                        $year: "$paymentDate",
                                    },
                                    month: {
                                        $month: "$paymentDate",
                                    },
                                },
                                totalRevenue: {
                                    $sum: "$amount",
                                },
                            },
                        },
                        {
                            $sort: {
                                "_id.year": 1,
                                "_id.month": 1,
                            },
                        },
                    ],


                    // Payment status distribution
                    paymentStatusDistribution: [
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
                    ],

                },
            },

        ]),

    ]);


    // Extract order analytics
    const orderStats = orderAnalytics[0] ?? {};

    const totalOrders =
        orderStats.totalOrders?.[0]?.count ?? 0;

    const pendingOrders =
        orderStats.pendingOrders?.[0]?.count ?? 0;

    const monthlyOrders =
        orderStats.monthlyOrders ?? [];


    // Extract payment analytics
    const paymentStats = paymentAnalytics[0] ?? {};

    const successfulPayments =
        paymentStats.successfulPayments?.[0]?.count ?? 0;

    const totalRevenue =
        paymentStats.revenue?.[0]?.totalRevenue ?? 0;

    const totalPayingUsers =
        paymentStats.payingUsers?.[0]?.totalPayingUsers ?? 0;

    const revenueByCategoryResult =
        paymentStats.revenueByCategory ?? [];

    const monthlyRevenue =
        paymentStats.monthlyRevenue ?? [];

    const paymentStatusDistribution =
        paymentStats.paymentStatusDistribution ?? [];


    // Normalize monthly revenue
    const monthlyRevenueMap = new Map(
        monthlyRevenue.map((item: any) => [
            `${item._id.year}-${item._id.month}`,
            item.totalRevenue,
        ])
    );


    // Generate complete month range
    const months = getMonthsInRange(
        start,
        end,
        monthlyOrders,
        monthlyRevenue
    );


    // Fill missing months in revenue
    const completeMonthlyRevenue = months.map(({ year, month }) => ({
        _id: {
            year,
            month,
        },
        totalRevenue:
            monthlyRevenueMap.get(`${year}-${month}`) ?? 0,
    }));


    // Normalize monthly orders
    const monthlyOrdersMap = new Map(
        monthlyOrders.map((item: any) => [
            `${item._id.year}-${item._id.month}`,
            item.totalOrders,
        ])
    );


    // Fill missing months in orders
    const completeMonthlyOrders = months.map(({ year, month }) => ({
        _id: {
            year,
            month,
        },
        totalOrders:
            monthlyOrdersMap.get(`${year}-${month}`) ?? 0,
    }));


    // Average revenue per paying user
    const averageRevenuePerUser =
        totalPayingUsers > 0
            ? totalRevenue / totalPayingUsers
            : 0;


    // Execution time
    const endTime = performance.now();

    const executionTime = endTime - startTime;


    return {
        totalCustomers,
        totalProducts,
        categories,
        totalOrders,
        totalRevenue,
        pendingOrders,
        successfulPayments,
        totalPayingUsers,

        averageRevenuePerUser: Number(
            averageRevenuePerUser.toFixed(2)
        ),

        RevenueByCategory: revenueByCategoryResult,

        monthlyRevenue: completeMonthlyRevenue,

        monthlyOrders: completeMonthlyOrders,

        paymentStatusDistribution,

        executionTime: `${executionTime.toFixed(2)} ms`,
    };
};