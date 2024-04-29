import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";

export const selectLocationRouteParams = createSelector(
  [(state: RootState) => state, (_: RootState, id: string) => id],
  (state, id) => {
    const page = state.location.pages[id];

    return page;
  }
);

export const selectLocationTopPosts = createSelector(
  [(state: RootState) => state, (_: RootState, id: string) => id],
  (state, id) => {
    const data = state.location.pages[id]?.topPosts;

    return data;
  }
);
