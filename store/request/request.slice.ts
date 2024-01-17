import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { addOneRequest, getRequestInitialState } from "./request.adapter";

const requestSlice = createSlice({
  name: "request",
  initialState: getRequestInitialState(),
  reducers: {
    initRequest: (
      state,
      action: PayloadAction<{
        id: string;
        url: string;
        method: "GET" | "POST" | "DELETE" | "PUT";
      }>
    ) => {
      addOneRequest(state, { ...action.payload, state: "idle" });
    },
  },
  extraReducers: (builder) => {},
});

const requestReducer = requestSlice.reducer;

export const {
  actions: { initRequest },
} = requestSlice;

export default requestReducer;
