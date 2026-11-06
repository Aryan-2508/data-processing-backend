import { Request, Response, NextFunction } from "express";
import { getDashboardAnalytics } from "../services/analytics.service";

export const getDashboard = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {

        const controllerStartTime = performance.now();

        console.log("Request reached analytics controller");

        const { startDate, endDate, category } = req.query;

        let start: Date | undefined;
        let end: Date | undefined;
        let selectedCategory: string | undefined;

        // Validate Category
        if (category !== undefined) {
            if (typeof category !== "string" || !category.trim()) {
                res.status(400).json({
                    success: false,
                    message: "Invalid category.",
                });
                return;
            }

            selectedCategory = category.trim();
        }

        // Apply date filtering only when both dates are provided
        if (startDate !== undefined || endDate !== undefined) {
            if (
                typeof startDate !== "string" ||
                typeof endDate !== "string"
            ) {
                res.status(400).json({
                    success: false,
                    message: "Both start date and end date are required.",
                });
                return;
            }

            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

            if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
                res.status(400).json({
                    success: false,
                    message: "Invalid date format. Use YYYY-MM-DD.",
                });
                return;
            }

            start = new Date(`${startDate}T00:00:00.000Z`);
            end = new Date(`${endDate}T23:59:59.999Z`);

            if (
                Number.isNaN(start.getTime()) ||
                Number.isNaN(end.getTime()) ||
                start.toISOString().slice(0, 10) !== startDate ||
                new Date(`${endDate}T00:00:00.000Z`).toISOString().slice(0, 10) !== endDate ||
                start > end
            ) {
                res.status(400).json({
                    success: false,
                    message: "Invalid date range.",
                });
                return;
            }
        }

        const analytics = await getDashboardAnalytics(
            start,
            end,
            selectedCategory
        );

        console.log("Dashboard analytics completed");


        const controllerEndTime = performance.now();

        console.log(
            `Controller Processing Time: ${(controllerEndTime - controllerStartTime).toFixed(2)} ms`
        );

        res.status(200).json({
            success: true,
            message: "Dashboard data fetched successfully",
            data: analytics,
        });

    } catch (error) {
        next(error);
    }
};
