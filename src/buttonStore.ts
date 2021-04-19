import { Button, Args } from "./types";
import { configureStore, createReducer } from "@reduxjs/toolkit";

const buttonReducer = createReducer([], (builder) => {
  builder
    .addCase("CYCLE", (state) => {
      state = state;
    })
    .addCase("ADD_BUTTON", (state, action: { payload: Button }) => {
      if (
        !state.some((button) => button.id === action.payload.id) &&
        action.payload.id
      ) {
        state.push(action.payload);
      }
    })
    .addCase(
      "UPDATE_BUTTON_ARGS",
      (state, action: { payload: { id: string; args: Args } }) => {
        state = state.map((button) => {
          if (button.id === action.payload.id) {
            const newArgs = action.payload.args;
            button.args = newArgs;
          }
          return button;
        });
      }
    )
    .addCase("REMOVE_BUTTON", (state, action) => {
      return state.filter((button, i) => i !== action.payload.index);
    });
});

export const cycleEvent = () => {
  store.dispatch({ type: "CYCLE" });
};

export const store = configureStore({
  reducer: buttonReducer,
});

export const updateButtonArgs = (args: Args, id: string) => {
  store.dispatch({ type: "UPDATE_BUTTON_ARGS", payload: { id, args } });
};

export const getButtonFromStore = (id: string): Button => {
  const state = store.getState();
  return state.filter((button) => button.id === id)[0];
};
