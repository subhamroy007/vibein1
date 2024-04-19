import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";

import {
  PaginatedDataFetchSelectorParams,
  SendSectionItemSelectorParams,
  SendSectionSelectorParams,
} from "../../types/selector.types";
import {
  AccountParams,
  ItemKey,
  SearchParams,
} from "../../types/utility.types";

export const selectClientAccountParams = createSelector(
  [(state: RootState) => state],
  (state): AccountParams | undefined => {
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

export const selectHomeFeedMemoryAccountsSection = createSelector(
  [(state: RootState) => state.client.home.memoryAccounts],
  (memoryAccounts): PaginatedDataFetchSelectorParams<ItemKey> => {
    const accouts: ItemKey[] = [];

    if (memoryAccounts.data) {
      accouts.push(
        ...memoryAccounts.data.items.map<ItemKey>((item) => ({ key: item.key }))
      );
    }

    return {
      data: memoryAccounts.data
        ? { hasEndReached: memoryAccounts.data.hasEndReached, items: accouts }
        : null,
      error: memoryAccounts.error ? JSON.stringify(memoryAccounts.error) : null,
      isExpired: memoryAccounts.expiresAt > Date.now(),
      isLoading: memoryAccounts.isLoading,
      isPageLoading: memoryAccounts.isPageLoading,
    };
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

export const selectAccountAndHashtagSearchSection = createSelector(
  [
    (state: RootState) => state.client.accountAndHashtagSearchSection,
    (_: RootState, searchPhase: string) => searchPhase,
  ],
  (state, searchPhase) => {
    let items: SearchParams[] | undefined = undefined;
    if (searchPhase.startsWith("@")) {
      const accounts = state.data.accountSection[searchPhase];
      if (accounts) {
        items = accounts.map<SearchParams>((account) => ({
          type: "account",
          ...account,
        }));
      }
    } else {
      const hashtags = state.data.hashtagSection[searchPhase];
      if (hashtags) {
        items = hashtags.map<SearchParams>((hashtag) => ({
          type: "hashtag",
          ...hashtag,
        }));
      }
    }

    return {
      isLoading: state.isLoading,
      error: state.error,
      items,
    };
  }
);

export const selectSendSection = createSelector(
  [
    (state: RootState) => state.client,
    (_: RootState, searchPhase: string | null) => searchPhase,
  ],
  (state, searchPhase): SendSectionSelectorParams => {
    const searchedAccounts = searchPhase
      ? state.sendSectionSearchResult.data[searchPhase]
      : undefined;

    let filteredSuggestedAccounts: AccountParams[] | undefined = undefined;
    if (state.suggestedAccounts) {
      if (searchPhase) {
        filteredSuggestedAccounts = state.suggestedAccounts
          .filter((account) => account.username.startsWith(searchPhase))
          .slice(0, 20);
      } else {
        filteredSuggestedAccounts = state.suggestedAccounts.slice(0, 20);
      }
    }

    const items: SendSectionItemSelectorParams[] = [];
    if (filteredSuggestedAccounts) {
      items.push(
        ...filteredSuggestedAccounts.map<SendSectionItemSelectorParams>(
          (account) => ({
            type: "one-to-one",
            id: account.id,
            name: account.fullname!,
            secondaryText: account.username,
            pictureUri: account.profilePictureUri,
          })
        )
      );
    }
    if (searchedAccounts) {
      items.push(
        ...searchedAccounts.map<SendSectionItemSelectorParams>((account) => ({
          type: "one-to-one",
          id: account.id,
          name: account.fullname!,
          secondaryText: account.username,
          pictureUri: account.profilePictureUri,
        }))
      );
    }

    return {
      isLoading: searchPhase ? state.sendSectionSearchResult.isLoading : false,
      isError: searchPhase
        ? state.sendSectionSearchResult.error || false
        : false,
      hasSearchResult: searchPhase ? (searchedAccounts ? true : false) : true,
      items,
    };
  }
);
