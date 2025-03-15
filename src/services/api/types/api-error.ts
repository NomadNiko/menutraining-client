export interface ApiValidationError {
  response?: {
    data?: {
      errors?: Record<string, string>;
    };
  };
}

export interface ApiError extends Error {
  response?: {
    data?: {
      errors?: Record<string, string>;
      message?: string;
    };
  };
}
