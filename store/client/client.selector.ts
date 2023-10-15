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
  [(state: RootState) => state.client.homeFeed],
  (homeFeed) => {
    return homeFeed;
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
