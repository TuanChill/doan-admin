import { fdAxios } from "@/config/axios.config";
import { API_ROUTES } from "@/const/routes";

export interface User {
  id?: number;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  password?: string;
}

// Fetch all users
export const getUsers = async () => {
  const response = await fdAxios.get(API_ROUTES.USERS);
  return response.data;
};

// Fetch a single user by ID
export const getUserById = async (id: number) => {
  const response = await fdAxios.get(`${API_ROUTES.USERS}/${id}`);
  return response.data;
};

// Create a new user
export const createUser = async (userData: User) => {
  const response = await fdAxios.post(API_ROUTES.USERS, {
    data: userData
  });
  return response.data;
};

// Update a user
export const updateUser = async (id: number, userData: Partial<User>) => {
  const response = await fdAxios.put(`${API_ROUTES.USERS}/${id}`, {
    data: userData
  });
  return response.data;
};

// Delete a user
export const deleteUser = async (id: number) => {
  const response = await fdAxios.delete(`${API_ROUTES.USERS}/${id}`);
  return response.data;
}; 