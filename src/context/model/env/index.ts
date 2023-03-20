import { immerable } from "immer";

export enum AppEnvironment {
  Development = "development",
  Production = "production",
}

export enum Locale {
  ZhTw = "zh-TW",
  EnUs = "en-US",
}

export interface EnvConfigOptions {
  environment?: AppEnvironment;
  locale?: Locale;
}

export type EnvConfig = Required<EnvConfigOptions>;

export const DefaultEnvConfig: () => EnvConfig = () => ({
  environment: AppEnvironment.Development,
  locale: Locale.ZhTw,
});

export default class Env {
  [immerable] = true;

  config: EnvConfig = DefaultEnvConfig();

  constructor(options: EnvConfigOptions) {
    if (
      options.environment &&
      Object.values(AppEnvironment).includes(options.environment)
    ) {
      this.config.environment = options.environment;
    }

    if (options.locale) {
      this.config.locale = options.locale;
    }
  }
}
