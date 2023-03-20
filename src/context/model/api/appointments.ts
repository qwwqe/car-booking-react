import { immerable } from "immer";
import Appointment from "../../../models/Appointment";
import CrudApi from "./crud";
import { ApiCall, ApiResultPromise, Success, WrapFailure } from "./types";

export interface AppointmentResponse {
  start_time: string;
  end_time: string;
  uuid: string;
  car_uuid: string;
  user_uuid: string;
}

export interface AppointmentRequest {
  start_time: string;
  end_time: string;
  uuid: string;
  car_uuid: string;
  user_uuid: string;
}

export interface SearchAppointmentFilter {
  startTime: Date;
  endTime: Date;
  uuid: string;
  userUuid: string;
  carUuid: string;
}

function responseToAppointment(response: AppointmentResponse): Appointment {
  return new Appointment({
    startTime: new Date(response.start_time),
    endTime: new Date(response.end_time),
    uuid: response.uuid,
    userUuid: response.user_uuid,
    carUuid: response.car_uuid,
  });
}

function appointmentToRequest(appointment: Appointment): AppointmentRequest {
  return {
    start_time: appointment.startTime.toISOString(),
    end_time: appointment.endTime.toISOString(),
    uuid: appointment.uuid,
    car_uuid: appointment.carUuid,
    user_uuid: appointment.userUuid,
  };
}

export default class AppointmentsApi extends CrudApi<Appointment> {
  [immerable] = true;

  private prefix = "appointments";

  async create(appointment: Appointment): ApiResultPromise<Appointment> {
    return ApiCall(async () => {
      const response = await this.ky.post(this.prefix, {
        json: appointmentToRequest(appointment),
      });

      if (!response.ok) {
        return WrapFailure(response);
      }

      const data: AppointmentResponse = await response.json();

      return Success(responseToAppointment(data));
    });
  }

  async delete(uuid: string): ApiResultPromise<void>;

  async delete(appointment: Appointment): ApiResultPromise<void>;

  async delete(data: string | Appointment): ApiResultPromise<void> {
    let uuid: string;

    if (data instanceof Appointment) {
      uuid = data.uuid;
    } else {
      uuid = data;
    }

    const response = await this.ky.delete(`${this.prefix}/${uuid}`);

    if (!response.ok) {
      return WrapFailure(response);
    }

    return Success(undefined);
  }

  async get(uuid: string): ApiResultPromise<Appointment> {
    return ApiCall(async () => {
      const response = await this.ky.get(`${this.prefix}/${uuid}`);

      if (!response.ok) {
        return WrapFailure(response);
      }

      const data: AppointmentResponse = await response.json();

      return Success(responseToAppointment(data));
    });
  }

  async search(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    filter: SearchAppointmentFilter
  ): ApiResultPromise<Appointment[]> {
    // stub
    return Success([]);
  }
}
