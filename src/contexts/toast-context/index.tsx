import * as React from "react";
import ToastComponent from "src/components/toast";

type IToast = { type: string; message: string };
type Action = { type: "ADD_TOAST" | "REMOVE_TOAST"; payload: IToast };
type Dispatch = (action: Action) => void;
type State = {
  toasts: IToast[];
};
type ToastProviderProps = { children: React.ReactNode; autoExpireIn?: number };

const ToastStateContext = React.createContext<{ state: State; dispatch: Dispatch } | undefined>(
  undefined
);

function toastReducer(state: State, action: Action) {
  switch (action.type) {
    case "ADD_TOAST": {
      return { toasts: [...state.toasts, action.payload] };
    }
    case "REMOVE_TOAST": {
      const newToasts = state.toasts.filter((toast) => toast.message !== action.payload.message);
      return { toasts: newToasts };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

let expiration = 0;

function ToastProvider({ children, autoExpireIn = 0 }: ToastProviderProps) {
  const [state, dispatch] = React.useReducer(toastReducer, { toasts: [] });

  expiration = autoExpireIn;

  const value = { state, dispatch };

  const staticValue = React.useMemo(() => value, [value]);

  return (
    <ToastStateContext.Provider value={staticValue}>
      {children}
      <ToastComponent />
    </ToastStateContext.Provider>
  );
}

function useInternalToast() {
  const context = React.useContext(ToastStateContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  const {
    state: { toasts },
    dispatch,
  } = context;

  function remove(message: string) {
    dispatch({ type: "REMOVE_TOAST", payload: { type: "asd", message } });
  }

  function markForDeletion(message: string) {
    if (expiration) {
      setTimeout(() => {
        remove(message);
      }, expiration);
    }
  }

  return { toasts, dispatch, remove, markForDeletion };
}

function useToast() {
  const { toasts, dispatch, markForDeletion } = useInternalToast();

  function add(type: string, message: string) {
    if (toasts.findIndex((t) => t.message === message) === -1) {
      dispatch({ type: "ADD_TOAST", payload: { type, message } });
      markForDeletion(message);
    }
  }

  const notify = (message: string) => add("notification", message);
  const warn = (message: string) => add("warning", message);
  const error = (message: string) => add("error", message);
  const success = (message: string) => add("success", message);

  return { notify, warn, error, success };
}

export { ToastProvider, useToast, useInternalToast };
