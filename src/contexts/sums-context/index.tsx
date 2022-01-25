import { IProcessorOptions, ISum } from "src/types";
import { createContext, useContext, useMemo, useReducer } from "react";
import { detectSums } from "src/utils/detect-sums";

const SumsStateContext = createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined);

type SumsProviderProps = { children: React.ReactNode };
type Dispatch = (action: Action) => void;
export type Action = {
  type: "SET_RESULT" | "SET_PROCESSING" | "SET_TOTAL" | "SET_OPTIONS" | "SET_ERROR";
  payload: any;
};

export type State = {
  result: ISum[];
  processing: boolean;
  error: string | null;
  options: IProcessorOptions;
  total: number | null;
};

export const initialState: State = {
  result: [],
  processing: false,
  error: null,
  options: {
    disableFailsafe: false,
  },
  total: 0,
};

export function sumsReducer(state: State = initialState, action: Action) {
  switch (action.type) {
    case "SET_RESULT": {
      return { ...state, result: action.payload };
    }

    case "SET_TOTAL": {
      return {
        ...state,
        total: action.payload,
      };
    }

    case "SET_PROCESSING": {
      return {
        ...state,
        processing: action.payload,
      };
    }

    case "SET_OPTIONS": {
      return {
        ...state,
        options: { ...state.options, ...action.payload },
      };
    }

    case "SET_ERROR": {
      return {
        ...state,
        error: action.payload,
      };
    }

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function SumsProvider({ children }: SumsProviderProps) {
  const [state, dispatch] = useReducer(sumsReducer, initialState);
  const value = { state, dispatch };
  // const staticValue = useMemo(() => value, [value]);

  return (
    <SumsStateContext.Provider value={value /*staticValue*/}>{children}</SumsStateContext.Provider>
  );
}

function useSums() {
  const context = useContext(SumsStateContext);
  if (context === undefined) {
    throw new Error("useSums must be used within a SumsProvider");
  }

  const { state, dispatch } = context;

  const setProcessing = (processing: boolean) => {
    dispatch({ type: "SET_PROCESSING", payload: processing });
  };

  const setOptions = (options: IProcessorOptions) => {
    dispatch({ type: "SET_OPTIONS", payload: options });
  };

  const setResult = (sums: ISum[]) => {
    dispatch({ type: "SET_RESULT", payload: sums });
  };

  const setError = (message: string | null) => {
    dispatch({ type: "SET_ERROR", payload: message });
  };

  const setTotal = (num: number) => {
    dispatch({ type: "SET_TOTAL", payload: num });
  };

  const process = (str: string, options: IProcessorOptions = state.options) => {
    (async () => {
      try {
        setResult([]);
        setTotal(0);
        setError(null);
        setProcessing(true);

        let sums = await detectSums(str, options);
        setTotal(sums.length);

        if (sums.length > 30) {
          sums = sums.slice(0, 30);
        }

        setResult(sums);
      } catch (error: any) {
        setError(error?.message);
      } finally {
        setProcessing(false);
      }
    })();
  };

  return { ...state, process, setOptions };
}

export { SumsProvider, useSums };
