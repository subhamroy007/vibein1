import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";

export const selectHashtagRouteParams = createSelector(
  [(state: RootState) => state, (_: RootState, name: string) => name],
  (state, name) => {
    const page = state.hashtag.pages[name];

    return page;
  }
);

export const selectHashtagTopPosts = createSelector(
  [(state: RootState) => state, (_: RootState, name: string) => name],
  (state, name) => {
    const page = state.hashtag.pages[name]?.topPosts;

    return page;
  }
);
