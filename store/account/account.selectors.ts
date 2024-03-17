import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { selectAccountById } from "./account.adapter";
import { AccountField } from "../../types/utility.types";
import { AccountAdapterParams } from "../../types/store.types";

export const selectAccountParams = createSelector(
  [
    (state: RootState) => state.account,
    (state: RootState, username: string) => username,
    (state: RootState, username: string, includeFields?: AccountField[]) =>
      includeFields,
  ],
  (state, username, includeFields) => {
    const account = selectAccountById(state, username);

    if (!account) {
      return undefined;
    }

    if (!includeFields) {
      return account;
    }

    let data: AccountAdapterParams = {
      id: account.id,
      username: account.username,
      profilePictureUri: account.profilePictureUri,
    };

    if (includeFields.includes("fullname")) {
      data["fullname"] = account.fullname;
    }

    if (includeFields.includes("has-requeste-to-follow-client")) {
      data["hasRequestedToFollowClient"] = account.hasRequestedToFollowClient;
    }

    if (includeFields.includes("is-followed")) {
      data["isFollowed"] = account.isFollowed;
    }

    if (includeFields.includes("has-followed-client")) {
      data["hasFollowedClient"] = account.hasFollowedClient;
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

    if (includeFields.includes("bio")) {
      data["bio"] = account.bio;
    }

    if (includeFields.includes("no-of-followings")) {
      data["noOfFollowings"] = account.noOfFollowings;
    }

    if (includeFields.includes("no-of-posts")) {
      data["noOfPosts"] = account.noOfPosts;
    }

    if (includeFields.includes("is-available")) {
      data["isAvailable"] = account.isAvailable;
    }

    if (includeFields.includes("is-blocked")) {
      data["isBlocked"] = account.isBlocked;
    }

    if (includeFields.includes("is-memory-hidden")) {
      data["isMemoryHidden"] = account.isMemoryHidden;
    }

    return data;
  }
);

export const selectAccountHomeRouteParams = createSelector(
  [
    (state: RootState) => state.account,
    (state: RootState, routeId: string) => routeId,
  ],
  (state, routeId) => {
    const route = state.profiles[routeId]?.home;
    return route;
  }
);

export const selectAccountMomentRouteParams = createSelector(
  [
    (state: RootState) => state.account,
    (state: RootState, routeId: string) => routeId,
  ],
  (state, routeId) => {
    const route = state.profiles[routeId]?.moments;

    return route;
  }
);

export const selectAccountPhotosRouteParams = createSelector(
  [
    (state: RootState) => state.account,
    (state: RootState, routeId: string) => routeId,
  ],
  (state, routeId) => {
    const route = state.profiles[routeId]?.photos;

    return route;
  }
);

export const selectAccountTagsRouteParams = createSelector(
  [
    (state: RootState) => state.account,
    (state: RootState, routeId: string) => routeId,
  ],
  (state, routeId) => {
    const route = state.profiles[routeId]?.taggedPosts;
    return route;
  }
);
