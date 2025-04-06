import { API_ROUTES } from '@/const/routes';
import { fdAxios } from '@/config/axios.config';
import qs from 'qs';

/**
 * Fetch invoices with related data
 */
export const fetchInvoices = async () => {
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
export const updateInvoiceStatus = async (invoiceId: number, isUsed: boolean) => {
  return fdAxios.put(`${API_ROUTES.INVOICE}/${invoiceId}`, {
    data: {
      isUsed: isUsed,
    },
  });
};

/**
 * Send invoice email
 */
export const sendInvoiceEmail = async (invoiceId: number, email: string) => {
  const emailEndpoint = API_ROUTES.EMAIL_SERVICE
    ? `${API_ROUTES.EMAIL_SERVICE}/send-ticket`
    : '/api/email/send-invoice';

  return fdAxios.post(emailEndpoint, {
    invoiceId: invoiceId,
    email: email,
  });
}; 