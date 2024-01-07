import {
  getHomeFeedThunk,
  getForYouMomentFeedThunk,
  getForYouPhotosFeedThunk,
} from "./client.thunk";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  ClientStoreParams,
  PostFeedItemIdentfierParams,
} from "../../types/store.types";
import {
  AccountResponseParams,
  PostResponseParams,
} from "../../types/response.types";

const initialState: ClientStoreParams = {
  imageCache: {},
  isFullScreenActive: false,
  foryou: {
    moments: {
      posts: [],
      thunkInfo: { state: "idle", lastRequestError: null, meta: null },
    },
    photos: {
      posts: [],
      thunkInfo: { state: "idle", lastRequestError: null, meta: null },
    },
  },
};

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    initInbox(state, action: PayloadAction<AccountResponseParams[]>) {
      state.inbox = {
        thunkInfo: { state: "idle", lastRequestError: null, meta: null },
        chats: action.payload.map((item) => ({
          type: "one-to-one",
          username: item.username,
        })),
      };
    },
    initHomeFeed(
      state,
      action: PayloadAction<{ posts: PostResponseParams[] }>
    ) {
      state.homeFeed = {
        memoryAuthors: [],
        thunkInfo: { state: "idle", lastRequestError: null, meta: null },
        posts: action.payload.posts.map((post) => ({
          type: "post",
          postId: post._id,
        })),
      };
    },
    initDiscoverFeed(
      state,
      action: PayloadAction<{ posts: PostResponseParams[] }>
    ) {
      state.discoverFeed = {
        thunkInfo: { state: "idle", lastRequestError: null, meta: null },
        posts: action.payload.posts.map((post) => post._id),
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
      if (state.homeFeed) {
        state.homeFeed.thunkInfo = {
          lastRequestError: null,
          meta: null,
          state: "loading",
        };
      }
    });
    builder.addCase(getHomeFeedThunk.rejected, (state, action) => {
      if (state.homeFeed) {
        state.homeFeed.thunkInfo = {
          lastRequestError: action.payload!,
          meta: {
            lastRequestStatusCode: action.meta.statusCode!,
            lastRequestTimestamp: action.meta.requestTimestamp!,
          },
          state: "failed",
        };
      }
    });
    builder.addCase(getHomeFeedThunk.fulfilled, (state, action) => {
      if (state.homeFeed) {
        state.homeFeed.thunkInfo = {
          lastRequestError: null,
          meta: {
            lastRequestStatusCode: action.meta.statusCode!,
            lastRequestTimestamp: action.meta.requestTimestamp!,
          },
          state: "success",
        };
        const newFeedItems =
          action.payload.posts.map<PostFeedItemIdentfierParams>((post) => ({
            postId: post._id,
            type: "post",
          }));
        state.homeFeed.posts = [...newFeedItems];
      }
    });
    builder.addCase(getForYouMomentFeedThunk.pending, (state, action) => {
      state.foryou.moments.thunkInfo = {
        lastRequestError: null,
        meta: null,
        state: "loading",
      };
    });
    builder.addCase(getForYouMomentFeedThunk.rejected, (state, action) => {
      state.foryou.moments.thunkInfo = {
        lastRequestError: action.payload!,
        meta: {
          lastRequestStatusCode: action.meta.statusCode!,
          lastRequestTimestamp: action.meta.requestTimestamp!,
        },
        state: "failed",
      };
    });
    builder.addCase(getForYouMomentFeedThunk.fulfilled, (state, action) => {
      state.foryou.moments.thunkInfo = {
        lastRequestError: null,
        meta: {
          lastRequestStatusCode: action.meta.statusCode!,
          lastRequestTimestamp: action.meta.requestTimestamp!,
        },
        state: "success",
      };
      const newFeedItems =
        action.payload.posts.map<PostFeedItemIdentfierParams>((post) => ({
          postId: post._id,
          type: "post",
        }));
      state.foryou.moments.posts = [...newFeedItems];
    });
    builder.addCase(getForYouPhotosFeedThunk.pending, (state, action) => {
      state.foryou.photos.thunkInfo = {
        lastRequestError: null,
        meta: null,
        state: "loading",
      };
    });
    builder.addCase(getForYouPhotosFeedThunk.rejected, (state, action) => {
      state.foryou.photos.thunkInfo = {
        lastRequestError: action.payload!,
        meta: {
          lastRequestStatusCode: action.meta.statusCode!,
          lastRequestTimestamp: action.meta.requestTimestamp!,
        },
        state: "failed",
      };
    });
    builder.addCase(getForYouPhotosFeedThunk.fulfilled, (state, action) => {
      state.foryou.photos.thunkInfo = {
        lastRequestError: null,
        meta: {
          lastRequestStatusCode: action.meta.statusCode!,
          lastRequestTimestamp: action.meta.requestTimestamp!,
        },
        state: "success",
      };
      const newFeedItems =
        action.payload.posts.map<PostFeedItemIdentfierParams>((post) => ({
          postId: post._id,
          type: "post",
        }));
      state.foryou.photos.posts = [...newFeedItems];
    });
  },
});

const clientReducer = clientSlice.reducer;

export default clientReducer;

export const {
  actions: {
    updateToasterMsg,
    initInbox,
    initHomeFeed,
    initClientInfo,
    initDiscoverFeed,
    setFullScreenActiveState,
  },
} = clientSlice;
