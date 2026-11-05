"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboard = void 0;
const analytics_service_1 = require("../services/analytics.service");
const getDashboard = async (req, res, next) => {
    try {
        const analytics = await (0, analytics_service_1.getDashboardAnalytics)();
        res.status(200).json({
            success: true,
            message: "Dashboard data fetched successfully",
            data: analytics,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getDashboard = getDashboard;
