import { API_ROUTES } from '@/config/routes';
import { PaginationMeta } from './types';
import { fdAxios } from '@/config/axios.config';

export interface Exhibit {
  id: number;
  documentId: string;
  name: string;
  description: string;
  period: string;
  location: string;
  isFeatured: boolean;
  historicalSignificance: string;
  year: number;
  history: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  users_permissions_user: null | {
    id: number;
    username: string;
  };
  category_artifact: null | {
    id: number;
    name: string;
  };
  image: null | {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number | null;
    height: number | null;
    formats: {
      large?: {
        ext: string;
        url: string;
        hash: string;
        mime: string;
        name: string;
        path: null;
        size: number;
        width: number;
        height: number;
        sizeInBytes: number;
      };
      small?: {
        ext: string;
        url: string;
        hash: string;
        mime: string;
        name: string;
        path: null;
        size: number;
        width: number;
        height: number;
        sizeInBytes: number;
      };
      medium?: {
        ext: string;
        url: string;
        hash: string;
        mime: string;
        name: string;
        path: null;
        size: number;
        width: number;
        height: number;
        sizeInBytes: number;
      };
      thumbnail?: {
        ext: string;
        url: string;
        hash: string;
        mime: string;
        name: string;
        path: null;
        size: number;
        width: number;
        height: number;
        sizeInBytes: number;
      };
    } | null;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  images: null | Array<{
    id: number;
    documentId: string;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number | null;
    height: number | null;
    formats: {
      large?: {
        ext: string;
        url: string;
        hash: string;
        mime: string;
        name: string;
        path: null;
        size: number;
        width: number;
        height: number;
        sizeInBytes: number;
      };
      small?: {
        ext: string;
        url: string;
        hash: string;
        mime: string;
        name: string;
        path: null;
        size: number;
        width: number;
        height: number;
        sizeInBytes: number;
      };
      medium?: {
        ext: string;
        url: string;
        hash: string;
        mime: string;
        name: string;
        path: null;
        size: number;
        width: number;
        height: number;
        sizeInBytes: number;
      };
      thumbnail?: {
        ext: string;
        url: string;
        hash: string;
        mime: string;
        name: string;
        path: null;
        size: number;
        width: number;
        height: number;
        sizeInBytes: number;
      };
    } | null;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }>;
  audio: null | {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: null;
    height: null;
    formats: null;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export interface ExhibitResponse {
  data: Exhibit[];
  meta: {
    pagination: PaginationMeta;
  };
}

export interface ExhibitCreateData {
  name: string;
  description: string;
  period: string;
  location: string;
  isFeatured: boolean;
  historicalSignificance: string;
  year: number;
  history: string;
  category_artifact?: number;
  image?: number;
  images?: number[];
  audio?: number;
}

export interface ExhibitUpdateData extends Partial<ExhibitCreateData> {}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export const getExhibits = async (
  page: number = 1,
  pageSize: number = 10,
  filters?: any
) => {
  const response = await fdAxios.get<PaginatedResponse<Exhibit>>(
    API_ROUTES.EXHIBITS,
    {
      params: {
        'pagination[page]': page,
        'pagination[pageSize]': pageSize,
        ...filters,
      },
    }
  );
  return response.data;
};

export const getExhibit = async (id: number) => {
  const response = await fdAxios.get<{ data: Exhibit }>(
    `${API_ROUTES.EXHIBITS}/${id}`
  );
  return response.data.data;
};

export const createExhibit = async (exhibitCreateData: ExhibitCreateData) => {
  const response = await fdAxios.post(
    API_ROUTES.EXHIBITS, {
      data: {
        ...exhibitCreateData,
      }
    }
  );
  return response.data.data;
};

export const updateExhibit = async (id: number, data: Partial<ExhibitCreateData>) => {
  const response = await fdAxios.put<{ data: Exhibit }>(
    `${API_ROUTES.EXHIBITS}/${id}`,
    data
  );
  return response.data.data;
};

export const deleteExhibit = async (id: number) => {
  await fdAxios.delete(`${API_ROUTES.EXHIBITS}/${id}`);
}; 