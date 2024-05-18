import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { AccountField } from "../../types/utility.types";
import { selectAccountById } from "./account.adapter";
import {
  AccountSelectorParams,
  MemorySectionSelectorParams,
} from "../../types/selector.types";
import { selectClientAccountParams } from "../client/client.selector";

export const selectAccountParams = createSelector(
  [
    (state: RootState) => state,
    (state: RootState, userId: string) => userId,
    (state: RootState, userId: string, includeFields?: AccountField[]) =>
      includeFields,
  ],
  (state, userId, includeFields): AccountSelectorParams | undefined => {
    const account = selectAccountById(state.account_store.accounts, userId);

    const client = selectClientAccountParams(state);

    if (!account || !client) {
      return undefined;
    }

    const output = {} as AccountSelectorParams;

    output.id = account.id;
    output.userId = account.userId;
    output.profilePictureUri = account.profilePictureUri;
    output.isClient = client.id === account.id;

    if (!includeFields || includeFields.includes("name")) {
      output.name = account.name;
    }

    if (
      !includeFields ||
      includeFields.includes("has-requeste-to-follow-client")
    ) {
      output.hasRequestedToFollowClient = account.hasRequestedToFollowClient;
    }

    if (!includeFields || includeFields.includes("is-followed")) {
      output.isFollowed = account.isFollowed;
    }

    if (!includeFields || includeFields.includes("has-followed-client")) {
      output.hasFollowedClient = account.hasFollowedClient;
    }

    if (!includeFields || includeFields.includes("no-of-followers")) {
      output.noOfFollowers = account.noOfFollowers;
    }

    if (!includeFields || includeFields.includes("is-private")) {
      output.isPrivate = account.isPrivate;
    }

    if (!includeFields || includeFields.includes("is-requested-to-follow")) {
      output.isRequestedToFollow = account.isRequestedToFollow;
    }

    if (!includeFields || includeFields.includes("is-favourite")) {
      output.isFavourite = account.isFavourite;
    }

    if (!includeFields || includeFields.includes("bio")) {
      output.bio = account.bio;
    }

    if (!includeFields || includeFields.includes("no-of-followings")) {
      output.noOfFollowings = account.noOfFollowings;
    }

    if (!includeFields || includeFields.includes("no-of-posts")) {
      output.noOfPosts = account.noOfPosts;
    }

    if (!includeFields || includeFields.includes("no-of-tagged-posts")) {
      output.noOfTaggedPosts = account.noOfTaggedPosts;
    }

    if (!includeFields || includeFields.includes("is-available")) {
      output.isAvailable = account.isAvailable;
    }

    if (!includeFields || includeFields.includes("is-blocked")) {
      output.isBlocked = account.isBlocked;
    }

    if (!includeFields || includeFields.includes("is-memory-hidden")) {
      output.isMemoryHidden = account.isMemoryHidden;
    }

    if (!includeFields || includeFields.includes("post-meta")) {
      output.postMeta = account.postMeta;
    }

    if (!includeFields || includeFields.includes("memory-info")) {
      let isMemoryAvailable = account.memorySection?.data ? true : false;
      if (
        account.memorySection?.data &&
        account.memoryInfo?.noOfAvailableMemories
      ) {
        isMemoryAvailable =
          account.memorySection.data.length ===
          account.memoryInfo.noOfAvailableMemories;
      }
      output.memoryInfo = {
        hasMemory: account.memoryInfo?.noOfAvailableMemories ? true : false,
        hasUnseenMemory: account.memoryInfo?.noOfUnseenMemories ? true : false,
        isMemoryAvailable,
      };
    }

    return output;
  }
);

export const selectAccountMemorySection = createSelector(
  [(state: RootState) => state, (state: RootState, userId: string) => userId],
  (state, userId): MemorySectionSelectorParams | undefined => {
    const account = selectAccountById(state.account_store.accounts, userId);

    if (!account) {
      return undefined;
    }

    return {
      account: {
        id: account.id,
        userId: account.userId,
        profilePictureUri: account.profilePictureUri,
        name: account.name,
      },
      memorySection: account.memorySection,
    };
  }
);

export const selectAccountAllPosts = createSelector(
  [(state: RootState) => state, (state: RootState, userId: string) => userId],
  (state, userId) => {
    const profile = state.account_store.profiles[userId];

    if (!profile) return undefined;

    return profile.allPosts;
  }
);

export const selectAccountTaggedPosts = createSelector(
  [(state: RootState) => state, (state: RootState, userId: string) => userId],
  (state, userId) => {
    const profile = state.account_store.profiles[userId];

    if (!profile) return undefined;

    return profile.taggedPosts;
  }
);

export const selectAccountPhotoPosts = createSelector(
  [(state: RootState) => state, (state: RootState, userId: string) => userId],
  (state, userId) => {
    const profile = state.account_store.profiles[userId];

    if (!profile) return undefined;

    return profile.photos;
  }
);

export const selectAccountMomentPosts = createSelector(
  [(state: RootState) => state, (state: RootState, userId: string) => userId],
  (state, userId) => {
    const profile = state.account_store.profiles[userId];

    if (!profile) return undefined;

    return profile.moments;
  }
);

export const selectAccountProfile = createSelector(
  [(state: RootState) => state, (state: RootState, userId: string) => userId],
  (state, userId) => {
    const profile = state.account_store.profiles[userId];

    if (!profile) return undefined;

    const account = selectAccountParams(state, userId);

    if (!account) return undefined;
    return {
      account,
      expiresAt: profile.expiresAt,
      createdAt: profile.createdAt,
    };
  }
);

export const selectAccountFollowings = createSelector(
  [(state: RootState) => state, (state: RootState, userId: string) => userId],
  (state, userId) => {
    const relatedAccounts =
      state.account_store.profiles[userId]?.relatedAccounts;

    if (!relatedAccounts || !relatedAccounts.followings) return null;

    return relatedAccounts.followings;
  }
);

export const selectAccountSuggestions = createSelector(
  [(state: RootState) => state, (state: RootState, userId: string) => userId],
  (state, userId) => {
    const relatedAccounts =
      state.account_store.profiles[userId]?.relatedAccounts;

    if (!relatedAccounts || !relatedAccounts.suggested) return null;

    return relatedAccounts.suggested;
  }
);

export const selectAccountFollowers = createSelector(
  [
    (state: RootState) => state,
    (state: RootState, userId: string) => userId,
    (state: RootState, userId: string, searchPhase: string | null) =>
      searchPhase,
  ],
  (state, userId, searchPhase) => {
    const relatedAccounts =
      state.account_store.profiles[userId]?.relatedAccounts;

    const account = selectAccountParams(state, userId, ["no-of-followers"]);

    if (
      !relatedAccounts ||
      !relatedAccounts.followers ||
      account?.noOfFollowers === undefined
    )
      return null;

    return {
      allAccounts: relatedAccounts.followers.allAccounts,
      searchedAccounts: searchPhase
        ? relatedAccounts.followers.searchedAccounts[searchPhase]
        : null,
      noOfFollowers: account.noOfFollowers,
    };
  }
);
