/* eslint-disable @typescript-eslint/no-explicit-any */

import { useDispatch } from "./useDispatch";

export const useSelector = (key: string | string[], defaultValue: any = "") => {
  const { state, dispatch } = useDispatch();

  const currentState = state;

  if (Array.isArray(key)) {
    return key.map((k, index) => {
      // if (!(k in currentState)) {
      //   dispatch({ [k]: defaultValue[index] });
      //   // set((state) => ({
      //   //   state: { ...state.state, [k]: defaultValue[index] },
      //   // }));
      // }
      return state[k] ?? defaultValue[index];
      // return currentState[k] ?? defaultValue[index];
    });
  }

  // Update state if the key does not exist
  if (!(key in currentState)) {
    dispatch({ [key]: defaultValue });
    // set((state) => ({
    //   state: { ...state.state, [key]: defaultValue },
    // }));
  }
  return state[key] ?? defaultValue;

  // return currentState[key] ?? defaultValue;
};
