import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getHomeFeedData } from "./client.thunk";
import {
  ClientStoreParams,
  PostFeedItemIdentfierParams,
} from "../../types/store.types";

const initialState = {
  loggedInAccount: {
    id: "1",
    noOfUnseenNotifications: 3,
  },
  theme: "light",
  homeFeed: {
    data: { feed: [] },
    lastError: null,
    meta: { requestTimestamp: null },
    state: "idle",
  },
  inbox: {
    data: { chats: [] },
    lastError: null,
    meta: { requestTimestamp: null },
    state: "idle",
  },
  toasterMsg: null,
} as ClientStoreParams;

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    // addChatsToInbox(state, action: PayloadAction<{ accounts: string[] }>) {
    //   state.inbox.data.chats.splice(
    //     0,
    //     0,
    //     ...action.payload.accounts.map<ChatListItemParams>((accountId) => ({
    //       accountId,
    //       type: "one-to-one",
    //     }))
    //   );
    //   state.inbox.state = "success";
    // },
    updateToasterMsg(state, action: PayloadAction<string>) {
      state.toasterMsg = { text: action.payload, timestamp: Date.now() };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getHomeFeedData.pending, (state, action) => {
      state.homeFeed.state = "loading";
    });
    builder.addCase(getHomeFeedData.rejected, (state, action) => {
      state.homeFeed.state = "failed";
      state.homeFeed.lastError = action.payload ? action.payload : null;
    });
    builder.addCase(getHomeFeedData.fulfilled, (state, action) => {
      const newFeedItems =
        action.payload.posts.map<PostFeedItemIdentfierParams>((post) => ({
          postId: post._id,
          type: "post",
        }));

      state.homeFeed.state = "success";
      state.homeFeed.data.feed = [...newFeedItems, ...state.homeFeed.data.feed];
      state.homeFeed.meta.requestTimestamp = new Date().toUTCString();
    });
  },
});

const clientReducer = clientSlice.reducer;

export default clientReducer;

export const {
  actions: { updateToasterMsg },
} = clientSlice;
