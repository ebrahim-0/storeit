/* eslint-disable @typescript-eslint/no-explicit-any */
import { globalState } from "@/store/global-state";
import { create } from "zustand";
import createDispatch from "./createDispatch";

export interface DispatchParams {
  state: Record<string, any>;
  addState: (newState: { [key: string]: any }, key?: string) => void;
  update: (payload?: any, key?: string, cb?: (pa?: object) => void) => void;
}

interface GlobalState {
  state: Record<string, any>;
  actions: Record<string, string>;
  tempState: Record<string, any>; // Store temporary changes
  addState: (newState: { [key: string]: any }, key?: string) => void;
  dispatch: (
    payload?: any,
    key?: string,
    cb?: (pa?: DispatchParams) => void
  ) => void;
  reset: (payload: string | string[]) => void;
  dirty: (payload: string | string[]) => void;
  dispatcher: (action: string, payload: Record<string, any>) => void;
  //   getSelector: (key: string | string[], defaultValue?: any) => any;
}

const initialTempState = {};

export const useDispatch = create<GlobalState>((set, get) => ({
  state: {
    ...globalState,
  },
  actions: {},
  tempState: initialTempState, // Initialize temporary state

  addState: (newState: { [key: string]: any }, key?: string) => {
    const currentState = get().state;

    if (key) {
      currentState[key] = { ...currentState[key], ...newState };
      get().tempState = {
        ...get().tempState,
        [key]: { ...currentState[key], ...newState },
      };
      return;
    }

    Object.keys(newState).forEach((key) => {
      currentState[key] = newState[key]; // Mutate directly
      get().tempState = { ...get().tempState, [key]: newState[key] };
    });
  },

  dispatch: (
    payload: string | object | ((params: DispatchParams) => void),
    key?: string
  ): void | DispatchParams => {
    const { tempState, state, addState, dispatch } = get();

    if (typeof payload === "function") {
      payload({ state, addState, update: dispatch } as DispatchParams);
      return;
    }

    if (Object.keys(tempState).length > 0) {
      set((state) => ({
        state: { ...state.state, ...tempState },
        tempState: initialTempState, // Reset tempState here
      }));
    }

    if (key) {
      set((state) => ({
        state: {
          ...state.state,
          [key]:
            typeof payload === "object"
              ? { ...state.state[key], ...payload }
              : payload,
        },
      }));
    } else {
      set((state) => ({
        state: {
          ...state.state,
          ...(payload as { [key: string]: any }),
        },
      }));
    }

    console.log("state", state);
  },

  reset: (payload: string | string[]) => {
    if (Array.isArray(payload)) {
      payload.forEach((key) => {
        set((state) => ({
          state: { ...state.state, [key]: globalState[key] },
        }));
      });
    } else {
      set((state) => ({
        state: { ...state.state, [payload]: globalState[payload] },
      }));
    }
  },

  dirty: (payload: string | string[]) => {
    set((state) => {
      const newState = { ...state.state };

      if (Array.isArray(payload)) {
        payload.forEach((k) => delete newState[k]);
      } else {
        delete newState[payload];
      }

      return { state: newState };
    });
  },

  dispatcher: (action: string, payload: Record<string, any>) => {
    set((state) => ({
      actions: { ...state.actions, [action]: action },
    }));
    const { dispatch, addState, reset, dirty } = get();
    createDispatch(
      { payload, type: action },
      { update: dispatch, addState, reset, dirty },
      get().actions
    );
    set(() => ({
      actions: {},
    }));
  },
}));
