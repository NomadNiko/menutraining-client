import { FetchJsonResponse } from "./types/fetch-json-response";
import HTTP_CODES_ENUM from "./types/http-codes";

async function wrapperFetchJsonResponse<T>(
  response: Response
): Promise<FetchJsonResponse<T>> {
  const status = response.status as FetchJsonResponse<T>["status"];
  return {
    status,
    data: status === HTTP_CODES_ENUM.NO_CONTENT
      ? undefined
      : await response.json()
  };
}

export default wrapperFetchJsonResponse;