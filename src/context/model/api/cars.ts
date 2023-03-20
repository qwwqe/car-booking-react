import { immerable } from "immer";
import Car from "../../../models/Car";
import CrudApi from "./crud";
import { ApiCall, ApiResultPromise, Success, WrapFailure } from "./types";

interface CreateCarRequest {
  uuid: string;
  plate: string;
  user_uuid: string;
}

interface CarResponse {
  uuid: string;
  plate: string;
  user_uuid: string;
}

interface SearchCarFilter {
  uuid?: string;
  plate?: string;
  userUuid?: string;
}

export default class CarsApi extends CrudApi<Car> {
  [immerable] = true;

  async create(car: Car): ApiResultPromise<Car> {
    return ApiCall(async () => {
      const response = await this.ky.post("cars", {
        json: {
          uuid: car.uuid,
          plate: car.plate,
          user_uuid: car.userUuid,
        } as CreateCarRequest,
      });

      if (!response.ok) {
        return WrapFailure(response);
      }

      const data: CarResponse = await response.json();

      return Success(
        new Car({
          uuid: data.uuid,
          plate: data.plate,
          userUuid: data.user_uuid,
        })
      );
    });
  }

  async delete(objectOrUuid: Car | string): ApiResultPromise<void> {
    let uuid: string;

    if (objectOrUuid instanceof Car) {
      uuid = objectOrUuid.uuid;
    } else {
      uuid = objectOrUuid;
    }

    return ApiCall(async () => {
      const response = await this.ky.delete(`cars/${uuid}`);

      if (!response.ok) {
        return WrapFailure(response);
      }

      return Success(undefined);
    });
  }

  async get(uuid: string): ApiResultPromise<Car> {
    return ApiCall(async () => {
      const response = await this.ky.get(`cars/${uuid}`);

      if (!response.ok) {
        return WrapFailure(response);
      }

      const data: CarResponse = await response.json();

      return Success(
        new Car({
          uuid: data.uuid,
          plate: data.plate,
          userUuid: data.user_uuid,
        })
      );
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async search(filter: SearchCarFilter): ApiResultPromise<Car[]> {
    return ApiCall(async () => {
      // stub
      return Success([
        new Car({ uuid: "a", plate: "AXR-8049", userUuid: "1231" }),
        new Car({ uuid: "b", plate: "JLD-3043", userUuid: "1232" }),
        new Car({ uuid: "c", plate: "POD-3323", userUuid: "1233" }),
        new Car({ uuid: "d", plate: "QQD-1129", userUuid: "1234" }),
      ]);
    });
  }
}
