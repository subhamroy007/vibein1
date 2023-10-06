import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { selectAccountById } from "./account.adapter";
import { AccountField } from "../../types/utility.types";
import { AccountAdapterParams } from "../../types/store.types";

export const selectAccountParams = createSelector(
  [
    (state: RootState) => state.account,
    (state: RootState, id: string) => id,
    (state: RootState, id: string, includeFields?: AccountField[]) =>
      includeFields,
  ],
  (state, id, includeFields): AccountAdapterParams | undefined => {
    const account = selectAccountById(state, id);

    if (!account) {
      return undefined;
    }

    if (!includeFields) {
      return account;
    }

    let data: AccountAdapterParams = {
      _id: account._id,
      username: account.username,
      profilePictureUrl: account.profilePictureUrl,
    };

    if (includeFields.includes("fullname")) {
      data["fullname"] = account.fullname;
    }

    if (includeFields.includes("has-requested-to-follow")) {
      data["hasRequestedToFollow"] = account.hasRequestedToFollow;
    }

    if (includeFields.includes("is-followed")) {
      data["isFollowed"] = account.isFollowed;
    }

    if (includeFields.includes("is-following")) {
      data["isFollowing"] = account.isFollowing;
    }

    if (includeFields.includes("no-of-followers")) {
      data["noOfFollowers"] = account.noOfFollowers;
    }

    if (includeFields.includes("is-private")) {
      data["isPrivate"] = account.isPrivate;
    }

    if (includeFields.includes("is-favourite")) {
      data["isFavourite"] = account.isFavourite;
    }

    return data;
  }
);
