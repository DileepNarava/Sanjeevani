import api from "./api";
import type { SearchDonorsParams, SearchDonorsResponse } from "@/types/auth";

export async function searchDonors(
  params: SearchDonorsParams
): Promise<SearchDonorsResponse> {
  const res = await api.get<SearchDonorsResponse>("/donors/search", {
    params,
  });
  return res.data;
}
