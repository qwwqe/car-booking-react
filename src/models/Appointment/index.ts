import { immerable } from "immer";

export interface AppointmentOptions {
  startTime?: Date;
  endTime?: Date;
  uuid?: string;
  userUuid?: string;
  carUuid?: string;
}

export default class Appointment {
  [immerable] = true;

  startTime: Date = new Date();

  endTime: Date = new Date();

  uuid = "";

  userUuid = "";

  carUuid = "";

  constructor(options?: AppointmentOptions) {
    if (!options) {
      return;
    }

    if (options.startTime) {
      this.startTime = options.startTime;
    }

    if (options.endTime) {
      this.endTime = options.endTime;
    }

    if (options.uuid) {
      this.uuid = options.uuid;
    }

    if (options.userUuid) {
      this.userUuid = options.userUuid;
    }

    if (options.carUuid) {
      this.carUuid = options.carUuid;
    }
  }
}
