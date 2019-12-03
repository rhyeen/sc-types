import { Status } from "../../entities/status";

export class StatusBuilder {
  static buildStatus(statusData: any):Status {
    const status = new Status(statusData.max);
    status.current = statusData.current;
    return status;
  }
}