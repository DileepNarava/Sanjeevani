import api from "./api";
import type {
  RegisterPayload,
  LoginPayload,
  AuthResponse,
  CurrentUserResponse,
} from "@/types/auth";

export async function registerUser(payload: RegisterPayload) {
  const response = await api.post<AuthResponse>(
    "/auth/register",
    payload
  );

  return response.data;
}

export async function loginUser(payload: LoginPayload) {
  const response = await api.post<AuthResponse>(
    "/auth/login",
    payload
  );

  return response.data;
}

export async function getCurrentUser() {
  const response =
    await api.get<CurrentUserResponse>(
      "/auth/me"
    );

  return response.data;
}