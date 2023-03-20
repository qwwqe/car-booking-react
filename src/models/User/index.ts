import { immerable } from "immer";

export interface UserOptions {
  username?: string;
  password?: string;
  uuid?: string;
}

export default class User {
  [immerable] = true;

  username = "";

  password = "";

  uuid = "";

  constructor(options?: UserOptions) {
    if (!options) {
      return;
    }

    if (options.username) {
      this.username = options.username;
    }

    if (options.password) {
      this.password = options.password;
    }

    if (options.uuid) {
      this.uuid = options.uuid;
    }
  }
}
