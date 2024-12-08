import React, { createContext, useReducer, useContext, ReactNode } from "react";

export const parseStringify = <T,>(value: T): T => {
  return JSON.parse(JSON.stringify(value));
};

interface GlobalState {}

interface GlobalStateContextType {
  state: GlobalState;
  dispatcher: (functionName: string, payload: any) => void;
  addState: (newState: Record<string, any>, key?: string) => void;
  dispatch: (newState: Record<string, any>, key?: string) => void;
  reset: (keys: string | string[]) => void;
  dirty: (keys: string | string[]) => void;
}

type InitialState = Record<string, any>;

let userGlobalState: InitialState = {};
let tempState: InitialState = {};

type Action =
  | { type: "SET_STATE"; payload: Record<string, any> }
  | { type: "DISPATCH_STATE"; payload: Record<string, any> }
  | { type: "RESET_STATE"; keys: string[] }
  | { type: "REMOVE_KEYS"; keys: string[] };

const stateReducer = (state: GlobalState, action: Action): GlobalState => {
  switch (action.type) {
    case "SET_STATE":
      tempState = { ...action.payload };

      return {
        ...state,
      };
    case "DISPATCH_STATE":
      tempState = {};
      return {
        ...state,
        ...{ ...state, ...tempState, ...action.payload },
      };
    case "RESET_STATE":
      const resetState = parseStringify(state);
      action.keys.forEach((key) => {
        const initialValue = getValue(userGlobalState, key);

        if (initialValue !== undefined) {
          setValue(resetState, key, initialValue);
        } else {
          removeValue(resetState, key);
        }
      });
      return {
        ...resetState,
      };
    case "REMOVE_KEYS":
      const removeState = parseStringify(state);
      action.keys.forEach((key) => {
        removeValue(removeState, key);
      });
      return {
        ...removeState,
      };
    default:
      return state;
  }
};

export type CreateDispatchType = (
  name: string,
  payload: any,
  tools: Tools
) => void;

interface Tools {
  dispatch: (newState: Record<string, any>, key?: string) => void;
  addState: (newState: Record<string, any>, key?: string) => void;
  reset: (keys: string | string[]) => void;
  dirty: (keys: string | string[]) => void;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(
  undefined
);

export const initial = (
  initialState: InitialState,
  createDispatch: CreateDispatchType
) => {
  userGlobalState = initialState;

  const StateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatchState] = useReducer(stateReducer, initialState);

    const addState = (newState: Record<string, any>, key?: string) => {
      if (key) {
        dispatchState({ type: "SET_STATE", payload: { [key]: newState } });
      } else {
        dispatchState({ type: "SET_STATE", payload: newState });
      }
    };

    const dispatch = (newState: Record<string, any>, key?: string) => {
      if (key) {
        dispatchState({ type: "DISPATCH_STATE", payload: { [key]: newState } });
      } else {
        dispatchState({ type: "DISPATCH_STATE", payload: newState });
      }
    };

    const reset = (keys: string | string[]) => {
      const keyArray = Array.isArray(keys) ? keys : [keys];
      dispatchState({ type: "RESET_STATE", keys: keyArray });
    };

    const dirty = (keys: string | string[]) => {
      const keyArray = Array.isArray(keys) ? keys : [keys];
      dispatchState({ type: "REMOVE_KEYS", keys: keyArray });
    };

    const tools: Tools = {
      dispatch,
      addState,
      dirty,
      reset,
    };

    const dispatcher = (name: string, payload: any) => {
      createDispatch(name, payload, tools);
    };

    return (
      <GlobalStateContext.Provider
        value={{ state, dispatcher, dispatch, addState, dirty, reset }}
      >
        {children}
      </GlobalStateContext.Provider>
    );
  };

  return StateProvider;
};

export const StateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatchState] = useReducer(stateReducer, {});

  const addState = (newState: Record<string, any>, key?: string) => {
    if (key) {
      dispatchState({ type: "SET_STATE", payload: { [key]: newState } });
    } else {
      dispatchState({ type: "SET_STATE", payload: newState });
    }
  };

  const dispatch = (newState: Record<string, any>, key?: string) => {
    if (key) {
      dispatchState({ type: "DISPATCH_STATE", payload: { [key]: newState } });
    } else {
      dispatchState({ type: "DISPATCH_STATE", payload: newState });
    }
  };

  const reset = (keys: string | string[]) => {
    const keyArray = Array.isArray(keys) ? keys : [keys];
    dispatchState({ type: "RESET_STATE", keys: keyArray });
  };

  const dirty = (keys: string | string[]) => {
    const keyArray = Array.isArray(keys) ? keys : [keys];
    dispatchState({ type: "REMOVE_KEYS", keys: keyArray });
  };

  const dispatcher = () => {
    throw new Error(
      "You can’t access dispatcher because You don’t add a initial dispatcher function"
    );
  };

  return (
    <GlobalStateContext.Provider
      value={{ state, dispatcher, dispatch, addState, dirty, reset }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useDispatch = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useDispatch must be used within a StateProvider");
  }
  return context;
};

export function useSelector<T = any>(
  keyPath: string,
  defaultValue: T = "" as T
) {
  const { state } = useDispatch();

  const resolveValue = (obj: any, path: string): any => {
    const keys = path.split(".");
    let value = obj;

    for (const key of keys) {
      if (value && typeof value === "object" && key in value) {
        value = value[key];
      } else {
        return undefined;
      }
    }
    return value;
  };

  const value = resolveValue(state, keyPath);

  if (typeof defaultValue === "object" && defaultValue !== null) {
    return { ...defaultValue, ...(value || {}) };
  }

  return value !== undefined ? value : defaultValue;
}

type NestedObject = { [key: string]: any };

const getValue = (obj: any, path: string): any => {
  const keys = path.split(".");
  let value = obj;

  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = value[key];
    } else {
      return undefined;
    }
  }
  return value;
};

function setValue<T>(obj: NestedObject, keyPath: string, newValue: T): void {
  const keys = keyPath.split(".");
  let target: any = obj;

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      target[key] = newValue;
    } else {
      if (!target[key] || typeof target[key] !== "object") {
        target[key] = {};
      }
      target = target[key];
    }
  });
}

function removeValue(obj: NestedObject, keyPath: string): void {
  const keys = keyPath.split(".");
  let target: any = obj;

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      delete target[key];
    } else if (target[key] && typeof target[key] === "object") {
      target = target[key];
    } else {
      return;
    }
  });
}
