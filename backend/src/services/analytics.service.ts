import Customer from "../models/customer.model";
import Product from "../models/product.model";
import Order from "../models/order.model";
import Payment from "../models/payment.model";
import { Orders } from "../enum/models";


// Generate every month between the selected dates.
// If no dates are selected, use the current year.
const getMonthsInRange = (
    start: Date | undefined,
    end: Date | undefined,
    monthlyOrders: any[],
    monthlyRevenue: any[]
) => {
    const months: { year: number; month: number }[] = [];

    let currentMonth: Date;
    let lastMonth: Date;

    if (start && end) {
        // Start from the first day of the selected starting month
        currentMonth = new Date(
            Date.UTC(
                start.getUTCFullYear(),
                start.getUTCMonth(),
                1
            )
        );

        // End at the first day of the selected ending month
        lastMonth = new Date(
            Date.UTC(
                end.getUTCFullYear(),
                end.getUTCMonth(),
                1
            )
        );

    } else {
        // Default range: January to December of the current year
        const currentYear = new Date().getFullYear();

        currentMonth = new Date(
            Date.UTC(currentYear, 0, 1)
        );

        lastMonth = new Date(
            Date.UTC(currentYear, 11, 1)
        );
    }

    // Generate every month between the dates
    while (currentMonth <= lastMonth) {
        months.push({
            year: currentMonth.getUTCFullYear(),
            month: currentMonth.getUTCMonth() + 1,
        });

        // Move to the next month
        currentMonth.setUTCMonth(
            currentMonth.getUTCMonth() + 1
        );
    }

    return months;
};


export const getDashboardAnalytics = async (
    start?: Date,
    end?: Date,
    category?: string
) => {

    const startTime = performance.now();

    // Current date
    const today = new Date();

    // End of today
    today.setUTCHours(23, 59, 59, 999);

    // Start of the current year
    const currentYear = new Date().getUTCFullYear();

    const currentYearStart = new Date(
        Date.UTC(currentYear, 0, 1)
    );


    // Default date range: current year to today
    const startDate = start ?? currentYearStart;
    const endDate = end ?? today;


    // Dynamic date conditions
    const orderMatch = {
        orderDate: {
            $gte: startDate,
            $lte: endDate,
        },
    };


    const paymentMatch = {
        paymentDate: {
            $gte: startDate,
            $lte: endDate,
        },
    };


    // Get product IDs belonging to the selected category
    // This must run before Promise.all because both aggregations use these IDs.
    const categoryProductIds: any[] = category
        ? await Product.distinct("_id", { category })
        : [];


    // Run independent database operations concurrently
    const [
        totalCustomers,
        totalProducts,
        categories,
        orderAnalytics,
        paymentAnalytics,
    ] = await Promise.all([

        // Total customers (all-time)
        Customer.countDocuments(),

        // Total products (all-time)
        Product.countDocuments(),

        // All available product categories
        Product.distinct("category"),

        // Order analytics
        Order.aggregate([

            {
                $match: orderMatch,
            },

            // Filter orders using product IDs instead of looking up products
            ...(category
                ? [
                    {
                        $match: {
                            "items.product": {
                                $in: categoryProductIds,
                            },
                        },
                    },
                ]
                : []),

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
                                        $month: "$" + Orders.OrderDate,
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

            // Find the related order
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

            // Separate order items
            {
                $unwind: "$orderDetails.items",
            },

            // Filter individual items using product IDs
            ...(category
                ? [
                    {
                        $match: {
                            "orderDetails.items.product": {
                                $in: categoryProductIds,
                            },
                        },
                    },
                ]
                : []),

            // Calculate revenue for each item
            {
                $addFields: {
                    itemRevenue: {
                        $multiply: [
                            "$orderDetails.items.quantity",
                            "$orderDetails.items.unitPrice",
                        ],
                    },
                },
            },

            {
                $facet: {

                    // Count unique successful payments
                    successfulPayments: [
                        {
                            $match: {
                                status: "success",
                            },
                        },
                        {
                            $group: {
                                _id: "$_id",
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
                                    $sum: "$itemRevenue",
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
                            $group: {
                                _id: "$orderDetails.customer",
                            },
                        },
                        {
                            $count: "totalPayingUsers",
                        },
                    ],


                    // Revenue by category
                    revenueByCategory: category
                        ? [
                            {
                                $match: {
                                    status: "success",
                                },
                            },
                            {
                                $group: {
                                    _id: category,
                                    totalRevenue: {
                                        $sum: "$itemRevenue",
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
                        ]
                        : [
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
                                $match: {
                                    status: "success",
                                },
                            },
                            {
                                $group: {
                                    _id: "$productDetails.category",
                                    totalRevenue: {
                                        $sum: "$itemRevenue",
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
                                    $sum: "$itemRevenue",
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
                        // One payment can have multiple order items.
                        // Group by payment ID to count it only once.
                        {
                            $group: {
                                _id: {
                                    paymentId: "$_id",
                                    status: "$status",
                                },
                            },
                        },
                        {
                            $group: {
                                _id: "$_id.status",
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