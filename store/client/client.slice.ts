import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getHomeFeedData } from "./client.thunk";
import {
  ClientStoreParams,
  PostFeedItemIdentfierParams,
} from "../../types/store.types";
import {
  AccountResponseParams,
  PostResponseParams,
} from "../../types/response.types";

const initialState: ClientStoreParams = {};

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    initInbox(state, action: PayloadAction<AccountResponseParams[]>) {
      state.inbox = {
        thunkInfo: null,
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
    updateToasterMsg(state, action: PayloadAction<string>) {
      state.toasterMsg = { text: action.payload, timestamp: Date.now() };
    },
    initClientInfo(state, { payload }: PayloadAction<AccountResponseParams>) {
      state.loggedInAccount = {
        ...payload,
        noOfUnseenNotifications: 0,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getHomeFeedData.pending, (state, action) => {
      if (state.homeFeed) {
        state.homeFeed.thunkInfo = {
          lastRequestError: null,
          meta: null,
          state: "loading",
        };
      }
    });
    builder.addCase(getHomeFeedData.rejected, (state, action) => {
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
    builder.addCase(getHomeFeedData.fulfilled, (state, action) => {
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
  },
});

const clientReducer = clientSlice.reducer;

export default clientReducer;

export const {
  actions: { updateToasterMsg, initInbox, initHomeFeed, initClientInfo },
} = clientSlice;
