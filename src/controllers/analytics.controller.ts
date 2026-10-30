import { Request, Response, NextFunction } from "express";
import { getDashboardAnalytics } from "../services/analytics.service";

export const getDashboard = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const analytics = await getDashboardAnalytics();

        res.status(200).json({
            success: true,
            message: "Dashboard data fetched successfully",
            data: analytics,
        });

    } catch (error) {
        next(error);
    }
};