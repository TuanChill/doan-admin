import { fdAxios } from '@/config/axios.config';
import { API_ROUTES } from '@/const/routes';
import qs from 'qs';

export interface Ticket {
  id?: number;
  name: string;
  price: number;
  type: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

// Fetch all tickets with optional filtering
export const getTickets = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  typeFilter?: string
) => {
  // Create initial filters object
  let filtersObj: any = {};

  // Add search filter if provided
  if (search && search.trim() !== '') {
    filtersObj.name = {
      $containsi: search.trim(),
    };
  }

  // Add type filter if provided
  if (typeFilter) {
    filtersObj.type = {
      $eq: typeFilter,
    };
  }

  const query = {
    pagination: {
      page,
      pageSize: limit,
    },
    filters: filtersObj,
    sort: ['updatedAt:desc'],
  };

  const params = qs.stringify(query, {
    encodeValuesOnly: true,
  });

  try {
    const response = await fdAxios.get(`${API_ROUTES.TICKETS}?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
};

// Fetch a single ticket by ID
export const getTicketById = async (id: number) => {
  try {
    const response = await fdAxios.get(`${API_ROUTES.TICKETS}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ticket with ID ${id}:`, error);
    throw error;
  }
};

// Create a new ticket
export const createTicket = async (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const response = await fdAxios.post(API_ROUTES.TICKETS, {
      data: ticketData,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
};

// Update a ticket
export const updateTicket = async (id: number, ticketData: Partial<Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>>) => {
  try {
    const response = await fdAxios.put(`${API_ROUTES.TICKETS}/${id}`, {
      data: ticketData,
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating ticket with ID ${id}:`, error);
    throw error;
  }
};

// Delete a ticket
export const deleteTicket = async (id: number) => {
  try {
    const response = await fdAxios.delete(`${API_ROUTES.TICKETS}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting ticket with ID ${id}:`, error);
    throw error;
  }
}; 