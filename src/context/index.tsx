import React, { useContext, createContext, useReducer, useMemo } from "react";
import GlobalState, { DefaultGlobalStateOptions } from "./model";
import { Action } from "./reducer/actions";
import reducer from "./reducer";

export interface GlobalStateInterface {
  state: GlobalState;
  dispatch: (action: Action) => void;
}

const generateContext: () => GlobalStateInterface = () => {
  const initial = useMemo(
    () =>
      new GlobalState({
        apiConfigOptions: {
          baseUrl: import.meta.env.VITE_BASE_URL,
        },
        envConfigOptions: {
          environment: import.meta.env.VITE_APP_ENVIRONMENT,
        },
      }),
    []
  );

  const [state, dispatch] = useReducer<React.Reducer<GlobalState, Action>>(
    reducer,
    initial
  );

  return { state, dispatch };
};

const DefaultContext = {
  state: new GlobalState(DefaultGlobalStateOptions()),
  dispatch: () => undefined,
};

const GlobalStateContext = createContext<GlobalStateInterface>(DefaultContext);

function GlobalStateProvider(props: React.PropsWithChildren<object>) {
  const context = generateContext();
  return <GlobalStateContext.Provider value={context} {...props} />;
}

function useGlobalState(): GlobalStateInterface {
  const context = useContext(GlobalStateContext);

  if (!context) {
    throw new Error("GlobalStateContext並不存在");
  }

  return context;
}

export { GlobalStateProvider, useGlobalState };
