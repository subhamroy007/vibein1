import {
  getInboxChatsThunk,
  fetchExploreFeed,
  fetchMomentsFeed,
  fetchPhotosFeed,
  fetchPostSuggestions,
  fetchQuickSearchResult,
  fetchSearchedAccounts,
  fetchSearchedHashtags,
  fetchSearchedPosts,
  fetchHomeFeedPosts,
} from "./client.thunk";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  ChatItemIdentifierParams,
  ClientStoreParams,
  PostFeedItemIdentfierParams,
  PostItemIdentifier,
} from "../../types/store.types";
import {
  AccountResponseParams,
  ChatResponseParams,
  OutDatedResponseParams2,
} from "../../types/response.types";
import { SEARCH_HISTORY } from "../../mocks/search";

const initialState: ClientStoreParams = {
  isDarkScreenFocused: false,
  isMediaMuted: true,
  loggedInAccount: null,
  theme: "system",
  notification: { msg: "", dispatchedAt: -1 },
  explore: {
    feed: {
      data: null,
      error: null,
      isLoading: false,
      failedToRefresh: false,
    },
    post_suggestions: {},
  },
  home: {
    data: null,
    error: null,
    failedToRefresh: false,
    isLoading: false,
  },
  foryou: {
    moments: {
      data: null,
      error: null,
      isLoading: false,
      failedToRefresh: false,
    },
    photos: {
      data: null,
      error: null,
      isLoading: false,
      failedToRefresh: false,
    },
  },
  inbox: {
    state: "idle",
    lastUpdatedAt: Date.now(),
    chats: [],
    nextPageInfo: { hasEndReached: false },
  },
  searchSection: {
    quickSearch: { error: null, data: {}, isLoading: false },
    searchHistory: SEARCH_HISTORY,
    fullSearch: null,
  },
};

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    setMediaMuted: (state, { payload }: PayloadAction<boolean>) => {
      state.isMediaMuted = payload;
    },
    toggleMediaMuted: (state) => {
      state.isMediaMuted = !state.isMediaMuted;
    },
    initHomeFeed(
      state,
      {
        payload: { posts },
      }: PayloadAction<{ posts: OutDatedResponseParams2[] }>
    ) {
      state.home = {
        data: null,
        error: null,
        failedToRefresh: false,
        isLoading: false,
      };
    },
    initPostSuggestionRoute(
      state,
      { payload }: PayloadAction<PostItemIdentifier>
    ) {
      state.explore.post_suggestions[payload.id] = {
        createdAt: Date.now(),
        data: { items: [payload], endCursor: "", hasEndReached: false },
        error: null,
        failedToRefresh: false,
        isLoading: false,
        seed: payload,
      };
    },
    initInbox: (state, { payload }: PayloadAction<ChatResponseParams[]>) => {
      state.inbox.chats = payload.map((chat) => ({
        chatId: chat.id,
        type: "direct",
      }));
    },
    initFullSearch(state, action: PayloadAction<string>) {
      state.searchSection.fullSearch = {
        searchPhase: action.payload,
        accountSearchResults: { data: null, error: null, isLoading: false },
        hashtagSearchResults: { data: null, error: null, isLoading: false },
        postSearchResults: {
          isLoading: false,
          data: null,
          error: null,
        },
      };
    },
    resetFullSearch(state) {
      state.searchSection.fullSearch = null;
    },
    initClientInfo(state, { payload }: PayloadAction<AccountResponseParams>) {
      state.loggedInAccount = {
        ...payload,
        noOfUnseenNotifications: 0,
      };
    },
    changeDarkScreenFocused(state, action: PayloadAction<boolean>) {
      state.isDarkScreenFocused = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchHomeFeedPosts.fulfilled,
      (
        state,
        {
          payload: { data, endCursor, hasEndReached },
          meta: {
            arg: { refresh },
          },
        }
      ) => {
        const homeFeed = state.home;
        homeFeed.isLoading = false;
        const newItems = data.map<PostItemIdentifier>((post) => ({
          id: post.id,
          type: post.type,
        }));
        if (refresh || !homeFeed.data) {
          homeFeed.data = {
            endCursor,
            hasEndReached,
            items: newItems,
          };
        } else {
          homeFeed.data.endCursor = endCursor;
          homeFeed.data.hasEndReached = hasEndReached;
          homeFeed.data.items = [...homeFeed.data.items, ...newItems];
        }
      }
    );
    builder.addCase(
      fetchHomeFeedPosts.pending,
      (
        state,
        {
          meta: {
            arg: { refresh },
          },
        }
      ) => {
        const homeFeed = state.home;
        homeFeed.isLoading = true;
        homeFeed.error = null;
        homeFeed.failedToRefresh = false;
      }
    );
    builder.addCase(
      fetchHomeFeedPosts.rejected,
      (
        state,
        {
          meta: {
            arg: { refresh },
          },
          payload,
        }
      ) => {
        const homeFeed = state.home;
        homeFeed.error = payload;
        homeFeed.isLoading = false;
        if (refresh) {
          homeFeed.failedToRefresh = true;
        }
      }
    );
    builder.addCase(
      fetchPhotosFeed.fulfilled,
      (
        state,
        {
          payload: { data, endCursor, hasEndReached },
          meta: {
            arg: { refresh },
          },
        }
      ) => {
        const photosFeed = state.foryou.photos;
        photosFeed.isLoading = false;
        const newItems = data.map<PostItemIdentifier>((post) => ({
          id: post.id,
          type: post.type,
        }));
        if (refresh || !photosFeed.data) {
          photosFeed.data = {
            endCursor,
            hasEndReached,
            items: newItems,
          };
        } else {
          photosFeed.data.endCursor = endCursor;
          photosFeed.data.hasEndReached = hasEndReached;
          photosFeed.data.items = [...photosFeed.data.items, ...newItems];
        }
      }
    );
    builder.addCase(
      fetchPhotosFeed.pending,
      (
        state,
        {
          meta: {
            arg: { refresh },
          },
        }
      ) => {
        const photosFeed = state.foryou.photos;
        photosFeed.isLoading = true;
        photosFeed.error = null;
        photosFeed.failedToRefresh = false;
      }
    );
    builder.addCase(
      fetchPhotosFeed.rejected,
      (
        state,
        {
          meta: {
            arg: { refresh },
          },
          payload,
        }
      ) => {
        const photosFeed = state.foryou.photos;
        photosFeed.error = payload;
        photosFeed.isLoading = false;
        if (refresh) {
          photosFeed.failedToRefresh = true;
        }
      }
    );
    builder.addCase(
      fetchMomentsFeed.fulfilled,
      (
        state,
        {
          payload: { data, endCursor, hasEndReached },
          meta: {
            arg: { refresh },
          },
        }
      ) => {
        const momentsFeed = state.foryou.moments;
        momentsFeed.isLoading = false;
        const newItems = data.map<PostItemIdentifier>((post) => ({
          id: post.id,
          type: post.type,
        }));
        if (refresh || !momentsFeed.data) {
          momentsFeed.data = {
            endCursor,
            hasEndReached,
            items: newItems,
          };
        } else {
          momentsFeed.data.items = [...momentsFeed.data.items, ...newItems];
          momentsFeed.data.endCursor = endCursor;
          momentsFeed.data.hasEndReached = hasEndReached;
        }
      }
    );
    builder.addCase(
      fetchMomentsFeed.pending,
      (
        state,
        {
          meta: {
            arg: { refresh },
          },
        }
      ) => {
        const momentsFeed = state.foryou.moments;
        momentsFeed.isLoading = true;
        momentsFeed.error = null;
        momentsFeed.failedToRefresh = false;
      }
    );
    builder.addCase(
      fetchMomentsFeed.rejected,
      (
        state,
        {
          meta: {
            arg: { refresh },
          },
          payload,
        }
      ) => {
        const momentsFeed = state.foryou.moments;
        momentsFeed.error = payload;
        momentsFeed.isLoading = false;
        if (refresh) {
          momentsFeed.failedToRefresh = true;
        }
      }
    );
    builder.addCase(
      fetchExploreFeed.fulfilled,
      (
        state,
        {
          payload: { data, endCursor, hasEndReached },
          meta: {
            arg: { refresh },
          },
        }
      ) => {
        const exploreFeed = state.explore.feed;
        exploreFeed.isLoading = false;
        const newItems = data.map<PostItemIdentifier>((post) => ({
          id: post.id,
          type: post.type,
        }));
        if (refresh || !exploreFeed.data) {
          exploreFeed.data = { endCursor, hasEndReached, items: newItems };
        } else {
          exploreFeed.data.items = [...exploreFeed.data.items, ...newItems];
          exploreFeed.data.endCursor = endCursor;
          exploreFeed.data.hasEndReached = hasEndReached;
        }
      }
    );
    builder.addCase(
      fetchExploreFeed.pending,
      (
        state,
        {
          meta: {
            arg: { refresh },
          },
        }
      ) => {
        const exploreFeed = state.explore.feed;
        exploreFeed.isLoading = true;
        exploreFeed.error = null;
        exploreFeed.failedToRefresh = false;
      }
    );
    builder.addCase(
      fetchExploreFeed.rejected,
      (
        state,
        {
          meta: {
            arg: { refresh },
          },
          payload,
        }
      ) => {
        const exploreFeed = state.explore.feed;
        exploreFeed.error = payload;
        exploreFeed.isLoading = false;
        if (refresh) {
          exploreFeed.failedToRefresh = true;
        }
      }
    );
    builder.addCase(
      fetchPostSuggestions.fulfilled,
      (
        state,
        {
          payload,
          meta: {
            arg: { postId },
          },
        }
      ) => {
        const suggestionRoute = state.explore.post_suggestions[postId];
        if (suggestionRoute) {
          suggestionRoute.data.endCursor = payload.endCursor;
          suggestionRoute.data.hasEndReached = payload.hasEndReached;
          suggestionRoute.isLoading = false;
          const newItems = payload.data.map<PostItemIdentifier>((post) => ({
            id: post.id,
            type: post.type,
          }));
          suggestionRoute.data.items = [
            ...suggestionRoute.data.items,
            ...newItems,
          ];
        }
      }
    );
    builder.addCase(
      fetchPostSuggestions.pending,
      (
        state,
        {
          meta: {
            arg: { postId },
          },
        }
      ) => {
        const suggestionRoute = state.explore.post_suggestions[postId];
        if (suggestionRoute) {
          suggestionRoute.isLoading = true;
          suggestionRoute.error = null;
        }
      }
    );
    builder.addCase(
      fetchPostSuggestions.rejected,
      (
        state,
        {
          meta: {
            arg: { postId },
          },
          payload,
        }
      ) => {
        const suggestionRoute = state.explore.post_suggestions[postId];
        if (suggestionRoute) {
          suggestionRoute.error = payload;
          suggestionRoute.isLoading = false;
        }
      }
    );
    builder.addCase(
      getInboxChatsThunk.fulfilled,
      (
        state,
        {
          payload: { data, nextPageInfo },
          meta: {
            arg: { refresh },
          },
        }
      ) => {
        state.inbox.state = "success";
        const newChats = data.map<ChatItemIdentifierParams>((chat) => ({
          type: "direct",
          chatId: chat.id,
        }));
        if (refresh || !state.inbox.chats.length) {
          state.inbox.lastUpdatedAt = Date.now();
          state.inbox.chats = newChats;
        } else {
          state.inbox.chats = [...state.inbox.chats, ...newChats];
        }
        state.inbox.nextPageInfo = nextPageInfo;
      }
    );
    builder.addCase(getInboxChatsThunk.pending, (state) => {
      state.inbox.state = "loading";
    });
    builder.addCase(getInboxChatsThunk.rejected, (state) => {
      state.inbox.state = "failed";
    });
    builder.addCase(fetchQuickSearchResult.pending, (state, action) => {
      state.searchSection.quickSearch.isLoading = true;
      state.searchSection.quickSearch.error = null;
    });
    builder.addCase(fetchQuickSearchResult.rejected, (state, action) => {
      state.searchSection.quickSearch.isLoading = false;
      state.searchSection.quickSearch.error = action.payload;
    });
    builder.addCase(
      fetchQuickSearchResult.fulfilled,
      (
        state,
        {
          payload,
          meta: {
            arg: { searchPhase },
          },
        }
      ) => {
        state.searchSection.quickSearch.data[searchPhase] = payload.result;
        state.searchSection.quickSearch.isLoading = false;
      }
    );
    builder.addCase(fetchSearchedAccounts.pending, (state, action) => {
      const fullSearch = state.searchSection.fullSearch;
      if (fullSearch) {
        fullSearch.accountSearchResults.error = null;
        fullSearch.accountSearchResults.isLoading = true;
      }
    });
    builder.addCase(fetchSearchedAccounts.rejected, (state, action) => {
      const fullSearch = state.searchSection.fullSearch;
      if (fullSearch) {
        fullSearch.accountSearchResults.error = action.payload;
        fullSearch.accountSearchResults.isLoading = false;
      }
    });
    builder.addCase(fetchSearchedAccounts.fulfilled, (state, action) => {
      const fullSearch = state.searchSection.fullSearch;
      if (fullSearch) {
        fullSearch.accountSearchResults.isLoading = false;
        fullSearch.accountSearchResults.data = action.payload.accounts.map(
          (account) => ({ type: "account", ...account })
        );
      }
    });
    builder.addCase(fetchSearchedHashtags.pending, (state, action) => {
      const fullSearch = state.searchSection.fullSearch;
      if (fullSearch) {
        fullSearch.hashtagSearchResults.error = null;
        fullSearch.hashtagSearchResults.isLoading = true;
      }
    });
    builder.addCase(fetchSearchedHashtags.rejected, (state, action) => {
      const fullSearch = state.searchSection.fullSearch;
      if (fullSearch) {
        fullSearch.hashtagSearchResults.error = action.payload;
        fullSearch.hashtagSearchResults.isLoading = false;
      }
    });
    builder.addCase(fetchSearchedHashtags.fulfilled, (state, action) => {
      const fullSearch = state.searchSection.fullSearch;
      if (fullSearch) {
        fullSearch.hashtagSearchResults.isLoading = false;
        fullSearch.hashtagSearchResults.data = action.payload.hashtags.map(
          (hashtag) => ({ type: "hashtag", ...hashtag })
        );
      }
    });
    builder.addCase(fetchSearchedPosts.fulfilled, (state, { payload }) => {
      const postRoute = state.searchSection.fullSearch?.postSearchResults;

      if (postRoute) {
        const newItems = payload.data.map<PostItemIdentifier>((post) => ({
          id: post.id,
          type: post.type,
        }));
        postRoute.isLoading = false;
        if (postRoute.data) {
          postRoute.data.items = [...postRoute.data.items, ...newItems];
          postRoute.data.endCursor = payload.endCursor;
          postRoute.data.hasEndReached = payload.hasEndReached;
        } else {
          postRoute.data = {
            endCursor: payload.endCursor,
            hasEndReached: payload.hasEndReached,
            items: newItems,
          };
        }
      }
    });
    builder.addCase(fetchSearchedPosts.pending, (state) => {
      const fullSearch = state.searchSection.fullSearch;
      if (fullSearch) {
        fullSearch.postSearchResults.isLoading = true;
        fullSearch.postSearchResults.error = null;
      }
    });
    builder.addCase(fetchSearchedPosts.rejected, (state, { payload }) => {
      const fullSearch = state.searchSection.fullSearch;
      if (fullSearch) {
        fullSearch.postSearchResults.error = payload;
        fullSearch.postSearchResults.isLoading = false;
      }
    });
  },
});

const clientReducer = clientSlice.reducer;

export default clientReducer;

export const {
  actions: {
    initHomeFeed,
    initClientInfo,
    initInbox,
    changeDarkScreenFocused,
    setMediaMuted,
    initPostSuggestionRoute,
    initFullSearch,
    resetFullSearch,
    toggleMediaMuted,
  },
} = clientSlice;
