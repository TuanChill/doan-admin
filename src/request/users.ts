import { fdAxios } from '@/config/axios.config';
import { API_ROUTES } from '@/const/routes';
import qs from 'qs';

export interface User {
  id?: number;
  email: string;
  username?: string;
  fullName?: string;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  permission?: 'user' | 'admin';
  password?: string;
}

export interface UserUpdateData {
  address?: string;
  fullName?: string;
  username?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  phoneNumber?: string;
  email?: string;
}

export interface Action {
  id: number;
  name: string;
  point: number;
  createdAt: string;
  updatedAt: string;
  ticket?: {
    id: number;
    name: string;
  };
}

// Fetch all users
export const getUsers = async (
  page: number = 1,
  limit: number = 10,
  search?: string
) => {
  // Tạo đối tượng filter ban đầu
  let filtersObj: any = {
    permission: {
      $eq: 'user',
    },
  };

  // Chỉ thêm điều kiện tìm kiếm nếu có search term
  if (search && search.trim() !== '') {
    // Tạo mảng $or cho nhiều điều kiện tìm kiếm
    const searchConditions = [];

    // Thêm điều kiện tìm kiếm email
    searchConditions.push({
      email: {
        $containsi: search,
      },
    });

    // Thêm điều kiện tìm kiếm fullName
    searchConditions.push({
      fullName: {
        $containsi: search,
      },
    });

    // Thêm điều kiện tìm kiếm phoneNumber
    searchConditions.push({
      phoneNumber: {
        $containsi: search,
      },
    });

    // Ghép với filter permission
    filtersObj = {
      $and: [{ permission: { $eq: 'user' } }, { $or: searchConditions }],
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
    const response = await fdAxios.get(`${API_ROUTES.USERS}?${params}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi gọi API users:', error);
    throw error;
  }
};

// Fetch a single user by ID
export const getUserById = async (id: number) => {
  const response = await fdAxios.get(`${API_ROUTES.USERS}/${id}`);
  return response.data;
};

// Fetch user's point history (actions)
export const getUserActions = async (
  userId: number,
  page: number = 1,
  limit: number = 10
) => {
  const query = {
    filters: {
      user: {
        id: {
          $eq: userId,
        },
      },
    },
    populate: ['ticket'],
    pagination: {
      page,
      pageSize: limit,
    },
    sort: ['createdAt:desc'],
  };

  const params = qs.stringify(query, {
    encodeValuesOnly: true,
  });

  try {
    const response = await fdAxios.get(
      `${API_ROUTES.ACTIVITY_POINTS}?${params}`
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy lịch sử điểm của người dùng:', error);
    throw error;
  }
};

// Create a new user
export const createUser = async (userData: User) => {
  const response = await fdAxios.post(API_ROUTES.USERS, {
    ...userData,
    role: '1',
  });
  return response.data;
};

// Update a user
export const updateUser = async (id: number, userData: UserUpdateData) => {
  // Only include the allowed fields
  const allowedData: UserUpdateData = {
    address: userData.address,
    fullName: userData.fullName,
    username: userData.username,
    gender: userData.gender,
    dateOfBirth: userData.dateOfBirth,
    phoneNumber: userData.phoneNumber,
    email: userData.email,
  };

  // Remove undefined fields
  Object.keys(allowedData).forEach(key => {
    if (allowedData[key as keyof UserUpdateData] === undefined) {
      delete allowedData[key as keyof UserUpdateData];
    }
  });

  const response = await fdAxios.put(`${API_ROUTES.USERS}/${id}`, {
    ...allowedData,
  });
  return response.data;
};

// Delete a user
export const deleteUser = async (id: number) => {
  const response = await fdAxios.delete(`${API_ROUTES.USERS}/${id}`);
  return response.data;
};
