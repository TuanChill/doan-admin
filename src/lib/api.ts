import { API_ROUTES } from '@/const/routes';
import { fdAxios } from '@/config/axios.config';
import qs from 'qs';

/**
 * Fetch invoices with related data
 */
export const fetchInvoices = async (pageSize = 10) => {
  const query = qs.stringify(
    {
      populate: {
        users_permissions_user: {
          fields: ['username', 'email'],
        },
        invoice_details: {
          populate: {
            ticket: {
              fields: ['name', 'price'],
            },
            service: {
              fields: ['name', 'price'],
            },
          },
        },
      },
      sort: ['updatedAt:desc'],
      pagination: {
        pageSize: pageSize,
      },
    },
    {
      encodeValuesOnly: true,
    }
  );

  return fdAxios.get(`${API_ROUTES.INVOICE}?${query}`);
};

/**
 * Update invoice status
 */
export const updateInvoiceStatus = async (invoiceId: string, isUsed: boolean) => {
  return fdAxios.put(`${API_ROUTES.INVOICE}/${invoiceId}`, {
    data: {
      isUsed: isUsed,
    },
  });
};


/**
 * Fetch all users count
 */
export const fetchUsersCount = async () => {
  return fdAxios.get(`${API_ROUTES.USERS}/count`);
};

/**
 * Fetch all exhibits count
 */
export const fetchExhibitsCount = async () => {
  return fdAxios.get(`${API_ROUTES.EXHIBIT}/count`);
};

/**
 * Fetch all posts count
 */
export const fetchPostsCount = async () => {
  return fdAxios.get(`${API_ROUTES.POST}/count`);
};

/**
 * Fetch sales statistics
 */
export const fetchSalesStats = async () => {
  // Get current date
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1); // Jan 1 of current year
  
  const query = qs.stringify(
    {
      filters: {
        createdAt: {
          $gte: startOfYear.toISOString(),
        },
      },
    },
    {
      encodeValuesOnly: true,
    }
  );

  return fdAxios.get(`${API_ROUTES.INVOICE}?${query}`);
};

/**
 * Fetch sales by month
 */
export const fetchSalesByMonth = async (year = new Date().getFullYear()) => {
  const startDate = new Date(year, 0, 1); // Jan 1
  const endDate = new Date(year, 11, 31); // Dec 31
  
  const query = qs.stringify(
    {
      filters: {
        createdAt: {
          $gte: startDate.toISOString(),
          $lte: endDate.toISOString(),
        },
      },
      pagination: {
        pageSize: 500, // Get more records to ensure comprehensive stats
      },
    },
    {
      encodeValuesOnly: true,
    }
  );

  return fdAxios.get(`${API_ROUTES.INVOICE}?${query}`);
};

/**
 * Fetch recent invoices
 */
export const fetchRecentInvoices = async (limit = 5) => {
  const query = qs.stringify(
    {
      sort: ['createdAt:desc'],
      pagination: {
        pageSize: limit,
      },
      populate: {
        users_permissions_user: {
          fields: ['username', 'email'],
        },
      },
    },
    {
      encodeValuesOnly: true,
    }
  );

  return fdAxios.get(`${API_ROUTES.INVOICE}?${query}`);
};

/**
 * Fetch top selling tickets/services
 */
export const fetchTopSelling = async (limit = 5) => {
  const query = qs.stringify(
    {
      pagination: {
        pageSize: 100, // Get more records to calculate top items
      },
      populate: {
        invoice_details: {
          populate: {
            ticket: {
              fields: ['name', 'price'],
            },
            service: {
              fields: ['name', 'price'],
            },
          },
        },
      },
    },
    {
      encodeValuesOnly: true,
    }
  );

  return fdAxios.get(`${API_ROUTES.INVOICE}?${query}`);
}; 