import User from "../../models/User";

export enum ActionType {
  Login = "global.login",
  Logout = "global.logout",
  LoginFromStorage = "global.loginFromStorage",
}

export type GlobalAction =
  | { type: ActionType.Login; user: User }
  | { type: ActionType.Logout }
  | { type: ActionType.LoginFromStorage };

export type Action = GlobalAction;
