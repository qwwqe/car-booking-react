import { immerable } from "immer";

export interface CarOptions {
  plate?: string;
  uuid?: string;
  userUuid?: string;
}

export default class Car {
  [immerable] = true;

  plate = "";

  uuid = "";

  userUuid = "";

  constructor(options?: CarOptions) {
    if (!options) {
      return;
    }

    if (options.plate) {
      this.plate = options.plate;
    }

    if (options.uuid) {
      this.uuid = options.uuid;
    }

    if (options.userUuid) {
      this.userUuid = options.userUuid;
    }
  }
}
