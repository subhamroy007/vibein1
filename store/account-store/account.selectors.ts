import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { AccountField, AccountParams } from "../../types/utility.types";
import { selectAccountById } from "./account.adapter";

export const selectAccountParams = createSelector(
  [
    (state: RootState) => state.account_store,
    (state: RootState, username: string) => username,
    (state: RootState, username: string, includeFields?: AccountField[]) =>
      includeFields,
  ],
  (state, username, includeFields) => {
    const account = selectAccountById(state.accounts, username);

    if (!account) {
      return undefined;
    }

    if (!includeFields) {
      return account;
    }

    if (!includeFields.includes("fullname")) {
      delete account.fullname;
    }

    if (!includeFields.includes("has-requeste-to-follow-client")) {
      delete account.hasRequestedToFollowClient;
    }

    if (!includeFields.includes("is-followed")) {
      delete account.isFollowed;
    }

    if (!includeFields.includes("has-followed-client")) {
      delete account.hasFollowedClient;
    }

    if (!includeFields.includes("no-of-followers")) {
      delete account.noOfFollowers;
    }

    if (!includeFields.includes("is-private")) {
      delete account.isPrivate;
    }

    if (!includeFields.includes("is-favourite")) {
      delete account.isFavourite;
    }

    if (!includeFields.includes("bio")) {
      delete account.bio;
    }

    if (!includeFields.includes("no-of-followings")) {
      delete account.noOfFollowings;
    }

    if (!includeFields.includes("no-of-posts")) {
      delete account.noOfPosts;
    }

    if (!includeFields.includes("is-available")) {
      delete account.isAvailable;
    }

    if (!includeFields.includes("is-blocked")) {
      delete account.isBlocked;
    }

    if (!includeFields.includes("is-memory-hidden")) {
      delete account.isMemoryHidden;
    }

    return account;
  }
);
