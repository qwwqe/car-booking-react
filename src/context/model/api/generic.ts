import { immerable } from "immer";
import ky from "ky";

export interface GenericApiOptions {
  getKyInstance: () => typeof ky;
}

export default class GenericApi {
  [immerable] = true;

  private getKyInstance: () => typeof ky;

  constructor(options: GenericApiOptions) {
    this.getKyInstance = options.getKyInstance;
  }

  get ky(): typeof ky {
    return this.getKyInstance();
  }
}
