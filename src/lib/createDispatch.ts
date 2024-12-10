import { CreateDispatchType } from "zustore";
import { getCurrentUser, logout } from "./actions/user.action";

export const createDispatch: CreateDispatchType = ({
  name,
  payload,
  tools,
}) => {
  const { dispatch, addState, state } = tools;

  // Action functions
  const setAge = () => {
    const age = payload.value;
    dispatch({ ...state.info, age }, "info"); // Example of using addState
  };

  const lang = () => {
    const lang = payload?.lang;
    addState({ lang }, "info2"); // Example of using addState
  };

  const getLoginUser = async () => {
    const callback = payload?.callback;
    const { error, ...currentUser } = (await getCurrentUser()) || {};

    dispatch({ user: currentUser });
    if (!error) {
      callback && (await callback());
    }
  };

  const logoutUser = async () => {
    await logout();

    dispatch({ user: null });
  };

  // Switch based on the function name
  switch (name) {
    case "setAge":
      return setAge();
    case "lang":
      return lang();
    case "getLoginUser":
      return getLoginUser();
    case "logoutUser":
      return logoutUser();
    default:
      console.log("No matching action for:", name);
      break;
  }
};
