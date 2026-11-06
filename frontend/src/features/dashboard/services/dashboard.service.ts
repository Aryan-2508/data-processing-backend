import api from "../../../api/axios";
import type {
    DashboardApiResponse,
    DashboardFilters
} from "../types/dashboard.types";

export const getDashboardData = async (
    filters: DashboardFilters
): Promise<DashboardApiResponse> => {

    const params = {
        ...(filters.startDate && {
            startDate: filters.startDate
        }),

        ...(filters.endDate && {
            endDate: filters.endDate
        }),

        ...(filters.category && {
            category: filters.category
        }),
    };

    const response = await api.get<DashboardApiResponse>(
        "/analytics/dashboard",
        {
            params
        }
    );

    return response.data;
};