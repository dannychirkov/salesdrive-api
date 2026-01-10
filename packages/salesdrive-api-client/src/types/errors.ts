/**
 * SalesDrive API Error Types
 */

/**
 * Base error class for SalesDrive API errors
 */
export class SalesDriveError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'SalesDriveError';
    Object.setPrototypeOf(this, SalesDriveError.prototype);
  }
}

/**
 * Error thrown when API returns an error response
 */
export class ApiError extends SalesDriveError {
  constructor(
    message: string,
    statusCode?: number,
    public readonly response?: unknown
  ) {
    super(message, 'API_ERROR', statusCode);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Error thrown when rate limit is exceeded
 */
export class RateLimitError extends SalesDriveError {
  constructor(message = 'Rate limit exceeded') {
    super(message, 'RATE_LIMIT', 429);
    this.name = 'RateLimitError';
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

/**
 * Error thrown when authentication fails
 */
export class AuthenticationError extends SalesDriveError {
  constructor(message = 'Authentication failed') {
    super(message, 'AUTH_ERROR', 401);
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Error thrown for network/transport issues
 */
export class NetworkError extends SalesDriveError {
  constructor(
    message: string,
    public readonly cause?: Error
  ) {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}
