import api from "../../../api/axios";
import type { DashboardApiResponse } from "../types/dashboard.types";

export const getDashboardData = async (): Promise<DashboardApiResponse> => {
    const response = await api.get<DashboardApiResponse>(
        "/analytics/dashboard"
    );

    return response.data;
};