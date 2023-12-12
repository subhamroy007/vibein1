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

export const selectDiscoverFeedParams = createSelector(
  [(state: RootState) => state.client.discoverFeed],
  (feed) => {
    if (!feed) {
      return undefined;
    }

    const postGrounps = [];

    for (let i = 0; i < feed.posts.length; i += 3) {
      const postId1 = feed.posts[i];
      const postId2 = feed.posts[i + 1] ? feed.posts[i + 1] : "";
      const postId3 = feed.posts[i + 2] ? feed.posts[i + 2] : "";
      const groupId = postId1 + postId2 + postId3;

      postGrounps.push({ groupId, posts: feed.posts.slice(i, i + 3) });
    }

    return { postGrounps, thunkInfo: feed.thunkInfo };
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

export const getImageFileUrl = createSelector(
  [
    (state: RootState, _: string) => state.client.imageCache,
    (state: RootState, url: string) => url,
  ],
  (imageCache, url) => {
    const fileUrl = imageCache[url];
    return fileUrl ? fileUrl : null;
  }
);
