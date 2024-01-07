import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { selectHashtagByName } from "./hashtag.adapter";

export const selectHashtagPageInfo = createSelector(
  [(state: RootState) => state, (state: RootState, hashtag: string) => hashtag],
  (state, hashtag) => {
    const hashtagPage = selectHashtagByName(state.hashtag, hashtag);

    if (!hashtagPage) {
      return undefined;
    }

    return hashtagPage;
  }
);
