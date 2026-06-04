import api from "./api";

const OWNER_API = "owner";

export const DashboardService = {
  getOwnerDashboard: async () => {
    const response = await api.get(`/${OWNER_API}/dashboard`);
    return response.data;
  },
  
  getSalesAnalytics: async () => {
    const response = await api.get(`/${OWNER_API}/sales-analytics/dashboard`);
    return response.data;
  },
};
