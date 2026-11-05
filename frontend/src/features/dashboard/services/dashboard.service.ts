// import api from "../../../api/axios";
// import type { DashboardApiResponse } from "../types/dashboard.types";

// export const getDashboardData = async (): Promise<DashboardApiResponse> => {
//     const response = await api.get<DashboardApiResponse>(
//         "/analytics/dashboard"
//     );

//     return response.data;
// };

import api from "../../../api/axios";
import type {
    DashboardApiResponse,
    DashboardFilters
} from "../types/dashboard.types";

export const getDashboardData = async (
    filters: DashboardFilters
): Promise<DashboardApiResponse> => {
    const response = await api.get<DashboardApiResponse>(
        "/analytics/dashboard",
        {
            params: filters
        }
    );

    return response.data;
};