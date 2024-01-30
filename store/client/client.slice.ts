import {
  getHomeFeedThunk,
  getForYouMomentFeedThunk,
  getForYouPhotosFeedThunk,
  getInboxChatsThunk,
} from "./client.thunk";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  ChatItemIdentifierParams,
  ClientStoreParams,
  PostFeedItemIdentfierParams,
} from "../../types/store.types";
import {
  AccountResponseParams,
  PostResponseParams,
} from "../../types/response.types";

const initialState: ClientStoreParams = {
  isFullScreenActive: false,
  loggedInAccount: null,
  theme: "system",
  toasterMsg: null,
  home: {
    state: "idle",
    data: { feed: [], hasEndReached: false },
    lastUpdatedAt: -1,
  },
  foryou: {
    moments: {
      state: "idle",
      data: { feed: [], hasEndReached: false },
      lastUpdatedAt: -1,
    },
    photos: {
      state: "idle",
      data: { feed: [], hasEndReached: false },
      lastUpdatedAt: -1,
    },
  },
  inbox: {
    state: "idle",
    lastUpdatedAt: Date.now(),
    data: { hasEndReached: false, chats: [] },
  },
};

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    initHomeFeed(
      state,
      { payload: { posts } }: PayloadAction<{ posts: PostResponseParams[] }>
    ) {
      state.home = {
        state: "idle",
        lastUpdatedAt: Date.now(),
        data: {
          hasEndReached: false,
          feed: posts.map((post) => ({
            type: "post",
            postId: post._id,
          })),
        },
      };
    },

    updateToasterMsg(state, action: PayloadAction<string>) {
      state.toasterMsg = { text: action.payload, timestamp: Date.now() };
    },
    initClientInfo(state, { payload }: PayloadAction<AccountResponseParams>) {
      state.loggedInAccount = {
        ...payload,
        noOfUnseenNotifications: 0,
      };
    },
    setFullScreenActiveState(state, action: PayloadAction<boolean>) {
      state.isFullScreenActive = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getHomeFeedThunk.pending, (state, action) => {
      const targetRoute = state.home;

      targetRoute.state = "loading";
    });
    builder.addCase(getHomeFeedThunk.rejected, (state, action) => {
      const targetRoute = state.home;

      targetRoute.state = "failed";
    });
    builder.addCase(
      getHomeFeedThunk.fulfilled,
      (state, { payload: { posts } }) => {
        const targetRoute = state.home;

        targetRoute.state = "success";

        targetRoute.lastUpdatedAt = Date.now();
        targetRoute.data = {
          hasEndReached: false,
          feed: posts.map<PostFeedItemIdentfierParams>((post) => ({
            postId: post._id,
            type: "post",
          })),
        };
      }
    );
    builder.addCase(getForYouMomentFeedThunk.pending, (state, action) => {
      const targetRoute = state.foryou.moments;

      targetRoute.state = "loading";
    });
    builder.addCase(getForYouMomentFeedThunk.rejected, (state, action) => {
      const targetRoute = state.foryou.moments;

      targetRoute.state = "failed";
    });
    builder.addCase(
      getForYouMomentFeedThunk.fulfilled,
      (
        state,
        {
          payload: { posts },
          meta: {
            requestTimestamp,
            arg: { refresh },
          },
        }
      ) => {
        const targetRoute = state.foryou.moments;

        targetRoute.state = "success";
        const newFeedItems = posts.map<PostFeedItemIdentfierParams>((post) => ({
          postId: post._id,
          type: "post",
        }));
        if (refresh || !targetRoute.data.feed.length) {
          targetRoute.lastUpdatedAt = Date.now();
          targetRoute.data = { hasEndReached: false, feed: newFeedItems };
        } else if (requestTimestamp > targetRoute.lastUpdatedAt) {
          targetRoute.data.hasEndReached = Math.random() > 0.7;
          targetRoute.data.feed = [
            ...targetRoute.data.feed,
            ...(targetRoute.data.hasEndReached ? [] : newFeedItems),
          ];
        }
      }
    );
    builder.addCase(getForYouPhotosFeedThunk.pending, (state, action) => {
      const targetRoute = state.foryou.photos;

      targetRoute.state = "loading";
    });
    builder.addCase(getForYouPhotosFeedThunk.rejected, (state, action) => {
      const targetRoute = state.foryou.photos;

      targetRoute.state = "failed";
    });
    builder.addCase(
      getForYouPhotosFeedThunk.fulfilled,
      (
        state,
        {
          payload: { posts },
          meta: {
            requestTimestamp,
            arg: { refresh },
          },
        }
      ) => {
        const targetRoute = state.foryou.photos;

        targetRoute.state = "success";
        const newFeedItems = posts.map<PostFeedItemIdentfierParams>((post) => ({
          postId: post._id,
          type: "post",
        }));
        if (refresh || !targetRoute.data.feed.length) {
          targetRoute.lastUpdatedAt = Date.now();
          targetRoute.data = { hasEndReached: false, feed: newFeedItems };
        } else if (requestTimestamp > targetRoute.lastUpdatedAt) {
          targetRoute.data.hasEndReached = Math.random() > 0.7;
          targetRoute.data.feed = [
            ...targetRoute.data.feed,
            ...(targetRoute.data.hasEndReached ? [] : newFeedItems),
          ];
        }
      }
    );
    builder.addCase(
      getInboxChatsThunk.fulfilled,
      (
        state,
        {
          payload: { chats },
          meta: {
            arg: { refresh },
          },
        }
      ) => {
        state.inbox.state = "success";
        const newChats = chats.map<ChatItemIdentifierParams>((chat) => ({
          type: "one-to-one",
          chatId: chat.id,
        }));
        if (refresh || !state.inbox.data.chats.length) {
          state.inbox.lastUpdatedAt = Date.now();
          state.inbox.data.hasEndReached = false;
          state.inbox.data.chats = newChats;
        } else {
          state.inbox.data.chats = [...state.inbox.data.chats, ...newChats];
        }
      }
    );
    builder.addCase(getInboxChatsThunk.pending, (state) => {
      state.inbox.state = "loading";
    });
    builder.addCase(getInboxChatsThunk.rejected, (state) => {
      state.inbox.state = "failed";
    });
  },
});

const clientReducer = clientSlice.reducer;

export default clientReducer;

export const {
  actions: {
    updateToasterMsg,
    initHomeFeed,
    initClientInfo,
    setFullScreenActiveState,
  },
} = clientSlice;
