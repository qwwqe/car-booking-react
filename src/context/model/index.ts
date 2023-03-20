import { immerable } from "immer";
import User from "../../models/User";
import Api, { ApiConfigOptions, DefaultApiConfig } from "./api";
import Env, { DefaultEnvConfig, EnvConfigOptions } from "./env";

export interface GlobalStateOptions {
  apiConfigOptions: ApiConfigOptions;
  envConfigOptions: EnvConfigOptions;
}

export const DefaultGlobalStateOptions: () => GlobalStateOptions = () => ({
  apiConfigOptions: DefaultApiConfig(),
  envConfigOptions: DefaultEnvConfig(),
});

export default class GlobalState {
  [immerable] = true;

  userStorageKey = "_user_uuid";

  api: Api;

  env: Env;

  user: User;

  private options: GlobalStateOptions;

  constructor(options: GlobalStateOptions) {
    this.options = options;

    this.api = new Api(options.apiConfigOptions);

    this.env = new Env(options.envConfigOptions);

    this.user = new User();
  }

  /**
   * Login to the application.
   *
   * This differs from authenticating with the backend API.
   */
  login(user: User) {
    console.log("loggin in:", user);
    this.user = user;
    localStorage.setItem(this.userStorageKey, user.uuid);
  }

  /**
   * Logout of the application.
   *
   * This differs from unauthenticating from the backend API.
   */
  logout() {
    this.user = new User();
    localStorage.removeItem(this.userStorageKey);
  }

  /**
   * Login to the application using information saved in local storage.
   *
   * This is intended for quick, preliminary initialization of the application
   * on initial load. It will currently only populate the uuid field of the state
   * User object. The application is responsible for fetching the complete user data
   * and, if desired, loading it into the state by calling {@link login}.
   *
   */
  loginFromStorage() {
    const uuid = localStorage.getItem(this.userStorageKey) || "";
    this.user = new User({ uuid });
    console.log("loggin in from storage", this.user);
  }

  /**
   * Whether or not a user is logged into the application.
   */
  get loggedIn(): boolean {
    return this.user.uuid !== "";
  }
}
