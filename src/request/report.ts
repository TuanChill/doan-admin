import { API_ROUTES } from "@/const/routes";
import { fdAxios } from "@/config/axios.config";

export const getOverview = async (year?: number) => {
    const response = await fdAxios.get(`${API_ROUTES.REPORTS}/overview`, {
        params: {
            year,
        },
    });
    return response.data;
};

export const getRevenueChart = async (year?: number) => {
    const response = await fdAxios.get(`${API_ROUTES.REPORTS}/revenue-chart`, {
        params: {
            year,
        },
    });
    return response.data;
};

export const getInvoiceChart = async (year?: number) => {
    const response = await fdAxios.get(`${API_ROUTES.REPORTS}/invoice-chart`, {
        params: {
            year,
        },
    });
    return response.data;
};

export const getRecentInvoice = async () => {
    const response = await fdAxios.get(`${API_ROUTES.REPORTS}/recent-invoices`);
    return response.data;
};

export const getTopTicket = async () => {
    const response = await fdAxios.get(`${API_ROUTES.REPORTS}/top-tickets`);
    return response.data;
};




