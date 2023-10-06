import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";

import { selectAccountParams } from "../account/account.selectors";
import { AccountField } from "../../types/utility.types";
import {
  AccountAdapterParams,
  HomeFeedStoreParams,
  InboxStoreParams,
} from "../../types/store.types";

export const selectClientAccountParams = createSelector(
  [
    (state: RootState) => state,
    (_: RootState, includeFields?: AccountField[]) => includeFields,
  ],
  (state, includeFields): AccountAdapterParams | undefined => {
    const accountParams = selectAccountParams(
      state,
      state.client.loggedInAccount.id,
      includeFields
    );

    return accountParams;
  }
);

export const selectHomeFeedParams = createSelector(
  [(state: RootState) => state.client.homeFeed],
  (homeFeed): HomeFeedStoreParams => {
    return homeFeed;
  }
);

export const selectInboxParams = createSelector(
  [(state: RootState) => state.client.inbox],
  (inbox): InboxStoreParams => {
    return inbox;
  }
);

export const selectToasterMsg = createSelector(
  [(state: RootState) => state.client.toasterMsg],
  (msg) => {
    return msg;
  }
);
