import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";

import { AccountAdapterParams } from "../../types/store.types";

export const selectClientAccountParams = createSelector(
  [(state: RootState) => state],
  (state): AccountAdapterParams | undefined => {
    const accountParams = state.client.loggedInAccount;

    if (!accountParams) {
      return undefined;
    }

    return accountParams;
  }
);

export const selectHomeFeedParams = createSelector(
  [(state: RootState) => state.client.home],
  (homeFeed) => {
    return homeFeed;
  }
);

export const selectForYouMomentsFeedParams = createSelector(
  [(state: RootState) => state.client.foryou.moments],
  (momentsFeed) => {
    return momentsFeed;
  }
);

export const selectForYouPhotosFeedParams = createSelector(
  [(state: RootState) => state.client.foryou.photos],
  (photosFeed) => {
    return photosFeed;
  }
);

export const selectInboxParams = createSelector(
  [(state: RootState) => state.client.inbox],
  (inbox) => {
    return inbox;
  }
);

export const selectToasterMsg = createSelector(
  [(state: RootState) => state.client.toasterMsg],
  (msg) => {
    return msg;
  }
);

export const getFullScreenActiveState = createSelector(
  [(state: RootState) => state.client.isFullScreenActive],
  (isFullScreenActive) => {
    return isFullScreenActive;
  }
);
