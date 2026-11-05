import { Request, Response, NextFunction } from "express";
import { getDashboardAnalytics } from "../services/analytics.service";

export const getDashboard = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { startDate, endDate } = req.query;

        if (typeof startDate !== "string" || typeof endDate !== "string") {
            res.status(400).json({
                success: false,
                message: "Start date and end date are required",
            });
            return;
        }

        const start = new Date(`${startDate}T00:00:00.000Z`);
        const end = new Date(`${endDate}T23:59:59.999Z`);

        if (
            Number.isNaN(start.getTime()) ||
            Number.isNaN(end.getTime()) ||
            start > end
        ) {
            res.status(400).json({
                success: false,
                message: "Invalid date range."
            });
            return;
        }

        const analytics = await getDashboardAnalytics(start, end);

        res.status(200).json({
            success: true,
            message: "Dashboard data fetched successfully",
            data: analytics,
        });

    } catch (error) {
        next(error);
    }
};