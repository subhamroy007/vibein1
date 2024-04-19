import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { AccountField, AccountParams } from "../../types/utility.types";
import { selectAccountById } from "./account.adapter";
import {
  AccountSelectorParams,
  MemorySectionSelectorParams,
} from "../../types/selector.types";

export const selectAccountParams = createSelector(
  [
    (state: RootState) => state.account_store,
    (state: RootState, username: string) => username,
    (state: RootState, username: string, includeFields?: AccountField[]) =>
      includeFields,
  ],
  (state, username, includeFields): AccountSelectorParams | undefined => {
    const account = selectAccountById(state.accounts, username);

    if (!account) {
      return undefined;
    }

    const output = {} as AccountSelectorParams;

    output.id = account.id;
    output.username = account.username;
    output.profilePictureUri = account.profilePictureUri;

    if (!includeFields) {
      return output;
    }

    if (includeFields.includes("fullname")) {
      output.fullname = account.fullname;
    }

    if (includeFields.includes("has-requeste-to-follow-client")) {
      output.hasRequestedToFollowClient = account.hasRequestedToFollowClient;
    }

    if (includeFields.includes("is-followed")) {
      output.isFollowed = account.isFollowed;
    }

    if (includeFields.includes("has-followed-client")) {
      output.hasFollowedClient = account.hasFollowedClient;
    }

    if (includeFields.includes("no-of-followers")) {
      output.noOfFollowers = account.noOfFollowers;
    }

    if (includeFields.includes("is-private")) {
      output.isPrivate = account.isPrivate;
    }

    if (includeFields.includes("is-favourite")) {
      output.isFavourite = account.isFavourite;
    }

    if (includeFields.includes("bio")) {
      output.bio = account.bio;
    }

    if (includeFields.includes("no-of-followings")) {
      output.noOfFollowings = account.noOfFollowings;
    }

    if (includeFields.includes("no-of-posts")) {
      output.noOfPosts = account.noOfPosts;
    }

    if (includeFields.includes("is-available")) {
      output.isAvailable = account.isAvailable;
    }

    if (includeFields.includes("is-blocked")) {
      output.isBlocked = account.isBlocked;
    }

    if (includeFields.includes("is-memory-hidden")) {
      output.isMemoryHidden = account.isMemoryHidden;
    }

    if (includeFields.includes("memory-info")) {
      let isMemoryAvailable = account.memorySection?.data ? true : false;
      if (account.memorySection?.data && account.noOfAvailableMemories) {
        isMemoryAvailable =
          account.memorySection.data.length === account.noOfAvailableMemories;
      }
      output.memoryInfo = {
        hasMemory: account.noOfAvailableMemories ? true : false,
        hasUnseenMemory: account.noOfUnseenMemories ? true : false,
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
        username: account.username,
        profilePictureUri: account.profilePictureUri,
      },
      memorySection: account.memorySection,
    };
  }
);
