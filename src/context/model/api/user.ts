import { immerable } from "immer";
import User from "../../../models/User";
import CrudApi from "./crud";
import { ApiCall, ApiResultPromise, Success, WrapFailure } from "./types";

interface CreateUserRequest {
  username: string;
  password: string;
}

interface UserResponse {
  uuid: string;
  username: string;
}

export default class UsersApi extends CrudApi<User> {
  [immerable] = true;

  /**
   * Create a new user.
   */
  async create(user: User): ApiResultPromise<User> {
    return ApiCall(async () => {
      const response = await this.ky.post("users", {
        json: {
          username: user.username,
          password: user.password,
        } as CreateUserRequest,
      });

      if (!response.ok) {
        return WrapFailure(response);
      }

      const data: UserResponse = await response.json();

      return Success(new User({ username: data.username, uuid: data.uuid }));
    });
  }

  /**
   * Retrieve a user.
   */
  async get(uuid: string): ApiResultPromise<User> {
    return ApiCall(async () => {
      const response = await this.ky.get(`users/${uuid}`);

      if (!response.ok) {
        return WrapFailure(response);
      }

      const data: UserResponse = await response.json();

      return Success(new User({ username: data.username, uuid: data.uuid }));
    });
  }

  /**
   * Delete a user.
   */
  async delete(objectOrUuid: User | string): ApiResultPromise<void> {
    return ApiCall(async () => {
      let uuid: string;

      if (objectOrUuid instanceof User) {
        uuid = objectOrUuid.uuid;
      } else {
        uuid = objectOrUuid;
      }

      const response = await this.ky.delete(`users/${uuid}`);

      if (!response.ok) {
        return WrapFailure(response);
      }

      return Success(undefined);
    });
  }

  /**
   * Search for users.
   *
   * @stub
   */
  async search(): ApiResultPromise<User[]> {
    return Success([]);
  }
}
