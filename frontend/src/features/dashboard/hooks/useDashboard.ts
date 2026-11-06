import { useEffect, useState } from "react";

import { getDashboardData } from "../services/dashboard.service";
import type { DashboardAnalytics, DashboardFilters } from "../types/dashboard.types";

function useDashboard(filters: DashboardFilters) {
    const [dashboardData, setDashboardData] =
        useState<DashboardAnalytics | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                setError(null);

                const requestStartTime = performance.now();

                const response = await getDashboardData(filters);

                const requestEndTime = performance.now();

                const executionTime = (requestEndTime - requestStartTime);

                console.log("Dashboard API request execution time:", executionTime, "ms");

                if (!response.success) {
                    throw new Error(response.message);
                }

                setDashboardData(response.data);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch dashboard data"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, [filters.startDate, filters.endDate, filters.category]);

    return {
        dashboardData,
        loading,
        error,
    };
}

export default useDashboard;