import { useCallback } from 'react';
import useFetch from '../use-fetch';
import { API_URL } from '../config';
import wrapperFetchJsonResponse from '../wrapper-fetch-json-response';
import { RequestConfigType } from './types/request-config';
import { VendorResponse } from '@/app/[language]/types/vendor';

export function useGetVendorsService() {
  const fetch = useFetch();
  
  return useCallback(async (requestConfig?: RequestConfigType) => {
    const requestUrl = new URL(`${API_URL}/vendors`);
    const response = await fetch(requestUrl, {
      method: 'GET',
      ...requestConfig,
    });
    
    return wrapperFetchJsonResponse<VendorResponse>(response);
  }, [fetch]);
}

export function useGetAllVendorsService() {
  const fetch = useFetch();
  
  return useCallback(async (requestConfig?: RequestConfigType) => {
    const requestUrl = new URL(`${API_URL}/vendors/admin/all`);
    const response = await fetch(requestUrl, {
      method: 'GET',
      ...requestConfig,
    });
    
    return wrapperFetchJsonResponse<VendorResponse>(response);
  }, [fetch]);
}