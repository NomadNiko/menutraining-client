import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import {
  MenuItem,
  CreateMenuItemDto,
  UpdateMenuItemDto,
} from "@/types/menu-item";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { RequestConfigType } from "./types/request-config";

// GET all menu items
export type GetMenuItemsRequest = {
  page?: number;
  limit?: number;
  ingredientId?: string;
};

export function useGetMenuItemsService() {
  const fetch = useFetch();
  return useCallback(
    (data: GetMenuItemsRequest = {}, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/menu-items`);
      if (data.page)
        requestUrl.searchParams.append("page", data.page.toString());
      if (data.limit)
        requestUrl.searchParams.append("limit", data.limit.toString());
      if (data.ingredientId)
        requestUrl.searchParams.append("ingredientId", data.ingredientId);

      return fetch(requestUrl, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<MenuItem[]>);
    },
    [fetch]
  );
}

// GET menu item by ID
export type GetMenuItemRequest = {
  id: string;
};

export function useGetMenuItemService() {
  const fetch = useFetch();
  return useCallback(
    (data: GetMenuItemRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/menu-items/${data.id}`, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<MenuItem>);
    },
    [fetch]
  );
}

// POST new menu item
export function useCreateMenuItemService() {
  const fetch = useFetch();
  return useCallback(
    (data: CreateMenuItemDto, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/menu-items`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<MenuItem>);
    },
    [fetch]
  );
}

// PATCH update menu item
export type UpdateMenuItemRequest = {
  id: string;
  data: UpdateMenuItemDto;
};

export function useUpdateMenuItemService() {
  const fetch = useFetch();
  return useCallback(
    (data: UpdateMenuItemRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/menu-items/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data.data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<MenuItem>);
    },
    [fetch]
  );
}

// DELETE menu item
export type DeleteMenuItemRequest = {
  id: string;
};

export function useDeleteMenuItemService() {
  const fetch = useFetch();
  return useCallback(
    (data: DeleteMenuItemRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/menu-items/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<void>);
    },
    [fetch]
  );
}
