import produce from "immer";
import GlobalState from "../model";
import { Action, ActionType } from "./actions";

export default produce((draft: GlobalState, action: Action) => {
  switch (action.type) {
    case ActionType.Login:
      draft.login(action.user);
      break;
    case ActionType.Logout:
      draft.logout();
      break;
    case ActionType.LoginFromStorage:
      draft.loginFromStorage();
      break;
    default:
      break;
  }
});
