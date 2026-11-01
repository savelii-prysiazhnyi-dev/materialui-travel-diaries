import axios from "axios";
import type { DiaryFormValues, DiaryPost, UserProfile, UserSummary } from "../types/diary.ts";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

export interface AuthInput {
  name?: string;
  email: string;
  password: string;
}

export const getAllPosts = async (): Promise<{ posts: DiaryPost[] }> => {
  const response = await apiClient.get<{ posts: DiaryPost[] }>("/posts");
  return response.data;
};

export const getPostById = async (id: string): Promise<{ post: DiaryPost }> => {
  const response = await apiClient.get<{ post: DiaryPost }>(`/posts/${id}`);
  return response.data;
};

export const createPost = async (
  postData: DiaryFormValues & { user: string }
): Promise<{ post: DiaryPost }> => {
  const response = await apiClient.post<{ post: DiaryPost }>("/posts", postData);
  return response.data;
};

export const updatePost = async (
  id: string,
  postData: Partial<DiaryFormValues>
): Promise<{ post: DiaryPost }> => {
  const response = await apiClient.put<{ post: DiaryPost }>(`/posts/${id}`, postData);
  return response.data;
};

export const deletePost = async (id: string): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(`/posts/${id}`);
  return response.data;
};

export const sendAuthRequest = async (
  isSignup: boolean,
  data: AuthInput
): Promise<{ user: UserSummary }> => {
  const endpoint = isSignup ? "/user/signup" : "/user/login";
  const payload = isSignup
    ? { name: data.name, email: data.email, password: data.password }
    : { email: data.email, password: data.password };

  const response = await apiClient.post<{ user: UserSummary }>(endpoint, payload);
  return response.data;
};

export const getUserDetails = async (userId: string): Promise<{ user: UserProfile }> => {
  const response = await apiClient.get<{ user: UserProfile }>(`/user/${userId}`);
  return response.data;
};
