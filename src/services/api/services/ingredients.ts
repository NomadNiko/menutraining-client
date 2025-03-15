import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import {
  Ingredient,
  CreateIngredientDto,
  UpdateIngredientDto,
} from "@/types/ingredient";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { RequestConfigType } from "./types/request-config";

// GET all ingredients
export type GetIngredientsRequest = {
  page?: number;
  limit?: number;
  name?: string;
  allergyId?: string;
};

export function useGetIngredientsService() {
  const fetch = useFetch();
  return useCallback(
    (data: GetIngredientsRequest = {}, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/ingredients`);
      if (data.page)
        requestUrl.searchParams.append("page", data.page.toString());
      if (data.limit)
        requestUrl.searchParams.append("limit", data.limit.toString());
      if (data.name) requestUrl.searchParams.append("name", data.name);
      if (data.allergyId)
        requestUrl.searchParams.append("allergyId", data.allergyId);

      return fetch(requestUrl, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<Ingredient[]>);
    },
    [fetch]
  );
}

// GET ingredient by ID
export type GetIngredientRequest = {
  id: string;
};

export function useGetIngredientService() {
  const fetch = useFetch();
  return useCallback(
    (data: GetIngredientRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/ingredients/${data.id}`, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<Ingredient>);
    },
    [fetch]
  );
}

// POST new ingredient
export function useCreateIngredientService() {
  const fetch = useFetch();
  return useCallback(
    (data: CreateIngredientDto, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/ingredients`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<Ingredient>);
    },
    [fetch]
  );
}

// PATCH update ingredient
export type UpdateIngredientRequest = {
  id: string;
  data: UpdateIngredientDto;
};

export function useUpdateIngredientService() {
  const fetch = useFetch();
  return useCallback(
    (data: UpdateIngredientRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/ingredients/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data.data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<Ingredient>);
    },
    [fetch]
  );
}

// DELETE ingredient
export type DeleteIngredientRequest = {
  id: string;
};

export function useDeleteIngredientService() {
  const fetch = useFetch();
  return useCallback(
    (data: DeleteIngredientRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/ingredients/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<void>);
    },
    [fetch]
  );
}
