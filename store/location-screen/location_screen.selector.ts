import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { selectLocationScreenById } from "./location_screen.adapter";

export const selectLocationScreenInfo = createSelector(
  [
    (state: RootState) => state,
    (state: RootState, screenId: string) => screenId,
  ],
  (state, screenId) => {
    const locationScreenInfo = selectLocationScreenById(
      state.locationScreen,
      screenId
    );

    if (!locationScreenInfo) {
      return undefined;
    }

    return locationScreenInfo;
  }
);
