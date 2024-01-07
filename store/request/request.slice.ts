import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { addOneRequest, getRequestInitialState } from "./request.adapter";
import { getHashtagPageThunk } from "../hashtag/hashtag.thunk";

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
  extraReducers: (builder) => {
    builder.addCase(
      getHashtagPageThunk.pending,
      (
        state,
        {
          meta: {
            arg: { requestId, ...requestParams },
          },
        }
      ) => {
        const targetRequest = state.entities[requestId];

        if (targetRequest) {
          targetRequest.state = "loading";
          targetRequest.startTimestamp = Date.now();
          targetRequest.requestParams = requestParams;
        }
      }
    );
    builder.addCase(
      getHashtagPageThunk.rejected,
      (state, { payload, meta: { statusCode, requestId } }) => {
        const targetRequest = state.entities[requestId];

        if (targetRequest) {
          (targetRequest.error = payload),
            (targetRequest.statusCode = statusCode),
            (targetRequest.endTimestamp = Date.now());
          targetRequest.state = "failed";
        }
      }
    );
    builder.addCase(
      getHashtagPageThunk.fulfilled,
      (state, { payload, meta: { requestId, statusCode } }) => {
        const targetRequest = state.entities[requestId];

        if (targetRequest) {
          (targetRequest.responseParams = payload),
            (targetRequest.statusCode = statusCode),
            (targetRequest.endTimestamp = Date.now());
          targetRequest.state = "success";
        }
      }
    );
  },
});

const requestReducer = requestSlice.reducer;

export const {
  actions: { initRequest },
} = requestSlice;

export default requestReducer;
