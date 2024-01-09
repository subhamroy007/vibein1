import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { selectPostScreenById } from "./post_screen.adapter";

export const selectPostScreenInfo = createSelector(
  [
    (state: RootState) => state,
    (state: RootState, screenId: string) => screenId,
  ],
  (state, screenId) => {
    const postScreenInfo = selectPostScreenById(state.postScreen, screenId);

    if (!postScreenInfo) {
      return undefined;
    }

    return postScreenInfo;
  }
);
