import { KyResponse } from "ky";

export type ApiResult<T> = ApiResultSuccess<T> | ApiResultFailure;

export type ApiResultPromise<T> = Promise<ApiResult<T>>;

export type ApiResultFailureCode = string;

export interface ApiResultSuccess<T> {
  ok: true;
  data: T;
}

export interface ApiResultFailure {
  ok: false;
  code: ApiResultFailureCode;
  message: string;
}

export function NewApiResultSuccess<T>(data: T) {
  return Promise.resolve({
    ok: true,
    data,
  }) as ApiResultPromise<T>;
}

export function NewApiResultFailure(
  code: ApiResultFailureCode,
  message: string
) {
  return Promise.resolve({
    ok: false,
    code,
    message,
  }) as Promise<ApiResultFailure>;
}

export const Success = NewApiResultSuccess;

export const Failure = NewApiResultFailure;

export const WrapFailure = async (response: KyResponse) => {
  const data: ApiResultResponseFailure = await response.json();
  return Failure(data.code, data.message);
};

export type ApiResultResponseFailure = ApiResultFailure;

/**
 * Convenience function for wrapping API calls that may possibly
 * throw exceptions.
 *
 * The Promise returned from this function is guaranteed not to reject.
 */
export function ApiCall<T>(cb: () => ApiResultPromise<T>): ApiResultPromise<T> {
  try {
    return cb();
  } catch (error) {
    return Failure("0000", `${error}`);
  }
}

// TODO: Implement this.
export type SearchFilter<T> = T;
