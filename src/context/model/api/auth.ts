import {
  Success,
  Failure,
  ApiResultResponseFailure,
  ApiCall,
  ApiResultPromise,
} from "./types";

import GenericApi, { GenericApiOptions } from "./generic";
import { immerable } from "immer";
import User from "../../../models/User";

export interface AuthApiOptions extends GenericApiOptions {
  setAccessCsrf?: (csrf: string) => void;
  setRefreshCsrf?: (csrf: string) => void;
  setUser?: (user: User) => void;
}

export interface RefreshTokenResult {
  accessCsrf: string;
}

interface RefreshTokenResponse {
  access_csrf: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResult {
  accessCsrf: string;
  refreshCsrf: string;
  user: User;
}

interface LoginResponse {
  access_csrf: string;
  refresh_csrf: string;
  user: UserResponse;
}

interface UserResponse {
  uuid: string;
  username: string;
}

// export interface RegisterResult {}

// interface RegisterResponse {}

/**
 * Api calls related to authentication.
 *
 * Because application credentials are partly stored in HttpOnly cookies,
 * methods in this class will potentially have side-effects that change
 * the current authentication state of the application. They are therefore
 * tightly coupled to application state, and are **not purely wrappers
 * around HTTP calls.**
 */
export default class AuthApi extends GenericApi {
  [immerable] = true;

  private setAccessCsrf: (csrf: string) => void = () => undefined;

  private setRefreshCsrf: (csrf: string) => void = () => undefined;

  private setUser: (user: User) => void = () => undefined;

  constructor(options: AuthApiOptions) {
    super(options);

    if (options.setAccessCsrf) {
      this.setAccessCsrf = options.setAccessCsrf;
    }

    if (options.setRefreshCsrf) {
      this.setRefreshCsrf = options.setRefreshCsrf;
    }

    if (options.setUser) {
      this.setUser = options.setUser;
    }
  }

  /**
   * Refresh the application's access token.
   *
   * Because credentials are partly stored in HttpOnly cookies,
   * calling this method will potentially change the current authentication
   * state of the application.
   */
  async refreshToken(): ApiResultPromise<RefreshTokenResult> {
    return ApiCall(async () => {
      const response = await this.ky.post("refresh");

      if (!response.ok) {
        const data: ApiResultResponseFailure = await response.json();
        return Failure(data.code, data.message);
      }

      const data: RefreshTokenResponse = await response.json();

      this.setAccessCsrf(data.access_csrf);

      return Success<RefreshTokenResult>({
        accessCsrf: data.access_csrf,
      });
    });
  }

  /**
   * Authenticate the application.
   *
   * Because credentials are partly stored in HttpOnly cookies,
   * calling this method will potentially change the current authentication
   * state of the application.
   */
  async login(
    username: string,
    password: string
  ): ApiResultPromise<LoginResult> {
    return ApiCall(async () => {
      const response = await this.ky.post("login", {
        json: { username, password } as LoginRequest,
      });

      if (!response.ok) {
        const data: ApiResultResponseFailure = await response.json();
        return Failure(data.code, data.message);
      }

      const data: LoginResponse = await response.json();
      const user: User = new User({
        uuid: data.user.uuid,
        username: data.user.username,
      });

      this.setAccessCsrf(data.access_csrf);
      this.setRefreshCsrf(data.refresh_csrf);
      this.setUser(user);

      return Success<LoginResult>({
        accessCsrf: data.access_csrf,
        refreshCsrf: data.refresh_csrf,
        user,
      });
    });
  }
}
