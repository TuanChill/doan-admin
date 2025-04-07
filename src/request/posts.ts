import { fdAxios } from "@/config/axios.config";
import { API_ROUTES } from "@/config/routes";

export interface PostContent {
  text: string;
  image?: string;
  heading?: string;
  imageCaption?: string;
}

export interface Post {
  id: number;
  documentId: string;
  title: string;
  description: string;
  content: PostContent[];
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
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface PostCreateData {
  title: string;
  description: string;
  content: PostContent[];
  image?: number;
}

export const createPost = async (data: PostCreateData) => {
  const response = await fdAxios.post<{ data: Post }>(
    API_ROUTES.POSTS,
    { data }
  );
  return response.data.data;
};

export const updatePost = async (id: number, data: Partial<PostCreateData>) => {
  const response = await fdAxios.put<{ data: Post }>(
    `${API_ROUTES.POSTS}/${id}`,
    { data }
  );
  return response.data.data;
}; 