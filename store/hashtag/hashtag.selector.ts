import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { selectHashtagByName } from "./hashtag.adapter";

export const selectHashtagGeneralRoute = createSelector(
  [(state: RootState) => state, (_: RootState, routeId: string) => routeId],
  (state, routeId) => {
    const routeParams = state.hashtag.generalRoutes[routeId];

    return routeParams;
  }
);

export const selectHashtagAdapterParams = createSelector(
  [(state: RootState) => state, (_: RootState, hashtag: string) => hashtag],
  (state, hashtag) => {
    const hashtagParams = state.hashtag.entities[hashtag];

    return hashtagParams;
  }
);
