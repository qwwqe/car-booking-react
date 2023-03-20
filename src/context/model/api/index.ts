import { immerable } from "immer";
import ky from "ky";
import AppointmentsApi from "./appointments";
import AuthApi, { RefreshTokenResult } from "./auth";
import CarsApi from "./cars";
import { ApiResultPromise } from "./types";
import UsersApi from "./user";

export interface ApiConfigOptions {
  baseUrl: string;
  refreshTokenSlug?: string;
  csrfHeaderName?: string;
  accessCsrfStorageKey?: string;
  refreshCsrfStorageKey?: string;
  userUuidStorageKey?: string;
  refreshFailureCallback?: () => void;
}

export type ApiConfig = Required<ApiConfigOptions>;

export const DefaultApiConfig: () => ApiConfig = () => ({
  baseUrl: "",
  refreshTokenSlug: "refresh",
  csrfHeaderName: "X-CSRF-Token",
  accessCsrfStorageKey: "_access_csrf",
  refreshCsrfStorageKey: "_refresh_csrf",
  userUuidStorageKey: "_user_uuid",
  refreshFailureCallback: () => undefined,
});

export interface ApiInterface {
  auth: AuthApi;
}

interface RefreshTokenCallback {
  (): ApiResultPromise<RefreshTokenResult>;
}

interface RefreshFailedCallback {
  (): void;
}

export default class Api implements ApiInterface {
  [immerable] = true;

  private config: ApiConfig = DefaultApiConfig();

  private ky: typeof ky = ky;

  private _refreshTokenCallback;

  private _refreshFailureCallback;

  auth: AuthApi;

  cars: CarsApi;

  appointments: AppointmentsApi;

  users: UsersApi;

  constructor(options: ApiConfigOptions) {
    this.loadOptions(options);
    this.initKy();

    this.auth = new AuthApi({
      getKyInstance: () => this.ky,
      setAccessCsrf: (csrf: string) => (this.accessCsrf = csrf),
      setRefreshCsrf: (csrf: string) => (this.refreshCsrf = csrf),
    });

    this.cars = new CarsApi({ getKyInstance: () => this.ky });

    this.appointments = new AppointmentsApi({ getKyInstance: () => this.ky });

    this.users = new UsersApi({ getKyInstance: () => this.ky });

    this._refreshTokenCallback = () => this.auth.refreshToken;

    this._refreshFailureCallback = () => this.config.refreshFailureCallback;
  }

  private loadOptions(options: ApiConfigOptions) {
    this.config.baseUrl = options.baseUrl;

    if (options.csrfHeaderName) {
      this.config.csrfHeaderName = options.csrfHeaderName;
    }

    if (options.accessCsrfStorageKey) {
      this.config.accessCsrfStorageKey = options.accessCsrfStorageKey;
    }

    if (options.refreshCsrfStorageKey) {
      this.config.refreshCsrfStorageKey = options.refreshCsrfStorageKey;
    }
  }

  private set accessCsrf(csrf: string) {
    localStorage.setItem(this.config.accessCsrfStorageKey, csrf);
  }

  private get accessCsrf(): string {
    return localStorage.getItem(this.config.accessCsrfStorageKey) || "";
  }

  private set refreshCsrf(csrf: string) {
    localStorage.setItem(this.config.refreshCsrfStorageKey, csrf);
  }

  private get refreshCsrf(): string {
    return localStorage.getItem(this.config.refreshCsrfStorageKey) || "";
  }

  private clearCsrf() {
    localStorage.removeItem(this.config.accessCsrfStorageKey);
    localStorage.removeItem(this.config.refreshCsrfStorageKey);
  }

  private get refreshAccessToken(): RefreshTokenCallback {
    return this._refreshTokenCallback();
  }

  private get handleRefreshFailure(): RefreshFailedCallback {
    return this._refreshFailureCallback();
  }

  /**
   * Authentication state of the API.
   *
   * This indicates whether calls to the remote API are expected to succeed.
   * It does *not* reflect "login state" of the application itself.
   */
  get authenticated(): boolean {
    return this.accessCsrf !== "" && this.refreshCsrf !== "";
  }

  private async initKy() {
    this.ky = ky.extend({
      credentials: "include",
      throwHttpErrors: false,
      prefixUrl: this.config.baseUrl,
      hooks: {
        beforeRequest: [
          async (request) => {
            // TODO(felix): Find a more reliable way of identifying refresh requests.
            if (request.url.endsWith(this.config.refreshTokenSlug)) {
              request.headers.set(this.config.csrfHeaderName, this.refreshCsrf);
            } else {
              request.headers.set(this.config.csrfHeaderName, this.accessCsrf);
            }
          },
        ],
        afterResponse: [
          /**
           * Handler for refreshing credentials and re-attempting failed requests.
           *
           * This handler will ignore responses that do not have a status of 401,
           * or whose URLs end in {@link this.config.refreshTokenSlug}.
           */
          async (request, options, response) => {
            if (response.status !== 401) {
              return;
            }

            if (request.url.endsWith(this.config.refreshTokenSlug)) {
              return;
            }

            this.refreshAccessToken().then((r) => {
              if (!r.ok) {
                this.clearCsrf();
                this.handleRefreshFailure();
              }
            });
          },
        ],
      },
    });
  }
}
