import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import { Allergy, CreateAllergyDto, UpdateAllergyDto } from "@/types/allergy";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { RequestConfigType } from "./types/request-config";

// GET all allergies
export type GetAllergiesRequest = {
  page?: number;
  limit?: number;
  name?: string;
};

export function useGetAllergiesService() {
  const fetch = useFetch();
  return useCallback(
    (data: GetAllergiesRequest = {}, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/allergies`);
      if (data.page)
        requestUrl.searchParams.append("page", data.page.toString());
      if (data.limit)
        requestUrl.searchParams.append("limit", data.limit.toString());
      if (data.name) requestUrl.searchParams.append("name", data.name);

      return fetch(requestUrl, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<Allergy[]>);
    },
    [fetch]
  );
}

// GET allergy by ID
export type GetAllergyRequest = {
  id: string;
};

export function useGetAllergyService() {
  const fetch = useFetch();
  return useCallback(
    (data: GetAllergyRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/allergies/${data.id}`, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<Allergy>);
    },
    [fetch]
  );
}

// POST new allergy
export function useCreateAllergyService() {
  const fetch = useFetch();
  return useCallback(
    (data: CreateAllergyDto, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/allergies`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<Allergy>);
    },
    [fetch]
  );
}

// PATCH update allergy
export type UpdateAllergyRequest = {
  id: string;
  data: UpdateAllergyDto;
};

export function useUpdateAllergyService() {
  const fetch = useFetch();
  return useCallback(
    (data: UpdateAllergyRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/allergies/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data.data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<Allergy>);
    },
    [fetch]
  );
}

// DELETE allergy
export type DeleteAllergyRequest = {
  id: string;
};

export function useDeleteAllergyService() {
  const fetch = useFetch();
  return useCallback(
    (data: DeleteAllergyRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/allergies/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<void>);
    },
    [fetch]
  );
}
