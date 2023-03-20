import GenericApi from "./generic";
import { ApiResultPromise, SearchFilter } from "./types";

export default abstract class CrudApi<T> extends GenericApi {
  abstract create(o: T): ApiResultPromise<T>;

  abstract delete(o: T): ApiResultPromise<void>;

  abstract delete(uuid: string): ApiResultPromise<void>;

  abstract delete(data: T | string): ApiResultPromise<void>;

  abstract get(uuid: string): ApiResultPromise<T>;

  abstract search(filter: SearchFilter<T>): ApiResultPromise<T[]>;

  // abstract update(o: T): ApiResultPromise<T>;
}
