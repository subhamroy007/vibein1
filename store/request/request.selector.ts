import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { selectRequestById } from "./request.adapter";

export const selectRequestInfo = createSelector(
  [(state: RootState) => state, (state: RootState, id: string) => id],
  (state, requestId) => {
    const request = selectRequestById(state.request, requestId);

    if (!request) {
      return undefined;
    }

    return {
      state: request.state,
    };
  }
);
