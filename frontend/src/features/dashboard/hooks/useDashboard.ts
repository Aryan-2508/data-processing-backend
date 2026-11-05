import { useEffect, useState } from "react";

import { getDashboardData } from "../services/dashboard.service";
import type { DashboardAnalytics } from "../types/dashboard.types";

function useDashboard() {
    const [dashboardData, setDashboardData] =
        useState<DashboardAnalytics | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await getDashboardData();

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
    }, []);

    return {
        dashboardData,
        loading,
        error,
    };
}

export default useDashboard;