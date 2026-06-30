import api from "./api";
import type {
  CreateRequestPayload,
  CreateRequestResponse,
  GetRequestsResponse,
  DeleteRequestResponse,
  MarkRequestFulfilledResponse,
} from "@/types/auth";

export async function createRequest(
  payload: CreateRequestPayload
): Promise<CreateRequestResponse> {
  const res = await api.post<CreateRequestResponse>("/requests", payload);
  return res.data;
}

export async function getAllRequests(): Promise<GetRequestsResponse> {
  const res = await api.get<GetRequestsResponse>("/requests");
  return res.data;
}

export async function getMyRequests(): Promise<GetRequestsResponse> {
  const res = await api.get<GetRequestsResponse>("/requests/my");
  return res.data;
}

export async function deleteRequest(
  id: string
): Promise<DeleteRequestResponse> {
  const res = await api.delete<DeleteRequestResponse>(`/requests/${id}`);
  return res.data;
}

export async function markRequestFulfilled(
  id: string
): Promise<MarkRequestFulfilledResponse> {
  const res = await api.patch<MarkRequestFulfilledResponse>(
    `/requests/${id}/status`
  );
  return res.data;
}
