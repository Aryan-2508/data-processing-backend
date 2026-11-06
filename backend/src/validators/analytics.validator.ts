import { z } from "zod";

export const dashboardQuerySchema = z
    .object({
        start: z.string().optional(),
        end: z.string().optional(),
        category: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        const start = data.start ? new Date(data.start) : undefined;
        const end = data.end ? new Date(data.end) : undefined;

        const today = new Date();
        today.setHours(23, 59, 59, 999);

        if (data.start && isNaN(start!.getTime())) {
            ctx.addIssue({
                code: "custom",
                path: ["start"],
                message: "Invalid start date",
            });
        }

        if (data.end && isNaN(end!.getTime())) {
            ctx.addIssue({
                code: "custom",
                path: ["end"],
                message: "Invalid end date",
            });
        }

        if (
            start &&
            end &&
            !isNaN(start.getTime()) &&
            !isNaN(end.getTime()) &&
            start > end
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["end"],
                message: "End date cannot be before start date",
            });
        }

        if (start && !isNaN(start.getTime()) && start > today) {
            ctx.addIssue({
                code: "custom",
                path: ["start"],
                message: "Start date cannot be in the future",
            });
        }

        if (end && !isNaN(end.getTime()) && end > today) {
            ctx.addIssue({
                code: "custom",
                path: ["end"],
                message: "End date cannot be in the future",
            });
        }
    });

export type DashboardQuery = z.infer<typeof dashboardQuerySchema>;