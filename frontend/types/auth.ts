export type BloodGroup =
  | "O_POS"
  | "O_NEG"
  | "A_POS"
  | "A_NEG"
  | "B_POS"
  | "B_NEG"
  | "AB_POS"
  | "AB_NEG";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodGroup: BloodGroup;
  city: string;
  createdAt: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  bloodGroup: BloodGroup;
  city: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface CurrentUserResponse {
  success: boolean;
  user: User;
}

// --- Blood Request types (Phase 2) ---

export type RequestStatus = "PENDING" | "FULFILLED";

export interface BloodRequest {
  id: string;
  patientName: string;
  bloodGroup: BloodGroup;
  hospital: string;
  city: string;
  unitsRequired: number;
  userId: string;
  status: RequestStatus;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    phone: string;
    bloodGroup: BloodGroup;
    city: string;
  };
}

export interface CreateRequestPayload {
  patientName: string;
  bloodGroup: BloodGroup;
  hospital: string;
  city: string;
  unitsRequired: number;
}

export interface CreateRequestResponse {
  success: boolean;
  request: BloodRequest;
}

export interface GetRequestsResponse {
  success: boolean;
  requests: BloodRequest[];
}

export interface DeleteRequestResponse {
  success: boolean;
  message: string;
}

export interface MarkRequestFulfilledResponse {
  success: boolean;
  request: BloodRequest;
}

export interface SearchRequestsParams {
  bloodGroup?: BloodGroup;
  city?: string;
  status?: RequestStatus;
}

// --- Donor Search types (Phase 3) ---

export interface Donor {
  id: string;
  name: string;
  bloodGroup: BloodGroup;
  city: string;
}

export interface SearchDonorsParams {
  bloodGroup?: BloodGroup;
  city?: string;
}

export interface SearchDonorsResponse {
  success: boolean;
  donors: Donor[];
}
