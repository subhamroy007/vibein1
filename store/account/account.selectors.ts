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

    if (includeFields.includes("bio")) {
      data["bio"] = account.bio;
    }

    if (includeFields.includes("follower-count")) {
      data["noOfFollowers"] = account.noOfFollowers;
    }

    if (includeFields.includes("following-count")) {
      data["noOfFollowings"] = account.noOfFollowings;
    }

    if (includeFields.includes("post-count")) {
      data["noOfPosts"] = account.noOfPosts;
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
