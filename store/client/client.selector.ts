import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";

import { AccountAdapterParams } from "../../types/store.types";
import {
  InboxChatInfoParams,
  InboxDirectChatInfoParams,
} from "../../types/selector.types";
import { selectChatById } from "../inbox/chat.adapter";
import { selectAccountParams } from "../account/account.selectors";
import { SearchParams } from "../../types/utility.types";

export const selectInboxChatInfo = createSelector(
  [(state: RootState) => state, (_: RootState, chatId: string) => chatId],
  (state, chatId) => {
    const targetChatAdapterParams = selectChatById(state.chat.chats, chatId);

    if (!targetChatAdapterParams) return undefined;

    const receipientAccount = selectAccountParams(
      state,
      targetChatAdapterParams.receipient.username,
      ["fullname"]
    )!;

    return {
      ...receipientAccount,
      canSendMessage:
        targetChatAdapterParams.receipient.isMember ||
        !targetChatAdapterParams.receipient.isMessageRequestRestricted,
    } as InboxDirectChatInfoParams;
  }
);

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

export const selectDarkScreenFocused = createSelector(
  [(state: RootState) => state.client.isDarkScreenFocused],
  (value) => {
    return value;
  }
);

export const selectInboxFilteredChats = createSelector(
  [
    (state: RootState) => state,
    (_: RootState, searchPhase: string) => searchPhase,
  ],
  (state, searchPhase) => {
    const allChats = state.client.inbox.chats.map<InboxChatInfoParams>(
      (chat) => {
        const targetChat = selectInboxChatInfo(state, chat.chatId)!;
        return { type: "direct", ...targetChat };
      }
    );
    if (searchPhase === "") return allChats;
    return allChats.filter((chat) => {
      if (chat.type === "direct") {
        if (!chat.canSendMessage) {
          return false;
        }
        return (
          chat.username.toLowerCase().includes(searchPhase.toLowerCase()) ||
          chat.fullname.toLowerCase().includes(searchPhase.toLowerCase())
        );
      }
      return false;
    });
  }
);

export const selectExploreFeed = createSelector(
  [(state: RootState) => state],
  (state) => {
    return state.client.explore.feed;
  }
);

export const selectPostSuggestionsRoute = createSelector(
  [
    (state: RootState) => state.client.explore.post_suggestions,
    (_: RootState, postId: string) => postId,
  ],
  (state, postId) => {
    return state[postId];
  }
);

export const selectMediaMutedState = createSelector(
  [(state: RootState) => state],
  (state) => {
    return state.client.isMediaMuted;
  }
);

export const selectQuickSearchResult = createSelector(
  [
    (state: RootState) => state.client.searchSection,
    (_: RootState, searchPhase: string) => searchPhase,
  ],
  (
    state,
    searchPhase
  ): {
    results: SearchParams[] | undefined;
    isLoading: boolean;
    isError: boolean;
    searchHistory: SearchParams[];
  } => {
    return {
      results: state.quickSearch.data[searchPhase],
      isLoading: state.quickSearch.isLoading,
      isError: state.quickSearch.error ? true : false,
      searchHistory: state.searchHistory,
    };
  }
);

export const selectAccountSearchResult = createSelector(
  [(state: RootState) => state.client.searchSection],
  (state) => {
    return state.fullSearch?.accountSearchResults;
  }
);

export const selectHashtagSearchResult = createSelector(
  [(state: RootState) => state.client.searchSection],
  (state) => {
    return state.fullSearch?.hashtagSearchResults;
  }
);

export const selectPostSearchResult = createSelector(
  [(state: RootState) => state.client.searchSection],
  (state) => {
    return state.fullSearch?.postSearchResults;
  }
);
