import { Draft, EntityState, createSlice } from "@reduxjs/toolkit";
import {
  getAccountAdapterInitialState,
  upsertManyAccounts,
} from "./account.adapter";
import {
  fetchExploreFeed,
  fetchHomeFeedPosts,
  fetchMomentsFeed,
  fetchPhotosFeed,
  fetchPostSuggestions,
  fetchSearchedPosts,
} from "../client/client.thunk";
import { AccountParams } from "../../types/utility.types";
import { PostResponseParams } from "../../types/response.types";

const initialState = {
  accounts: getAccountAdapterInitialState(),
};

const addAccountFromPostToStore = (
  state: Draft<{
    accounts: EntityState<AccountParams>;
  }>,
  posts: PostResponseParams[]
) => {
  const accounts = posts.map((post) => {
    const accounts = [post.author];

    if (post.type === "moment-post" && post.taggedAccounts) {
      accounts.push(...post.taggedAccounts);
    } else if (post.type === "photo-post") {
      const newAccounts = post.photos
        .map((photo) =>
          photo.taggedAccounts
            ? photo.taggedAccounts.map((tag) => tag.account)
            : []
        )
        .flat();
      accounts.push(...newAccounts);
    }
    upsertManyAccounts(state.accounts, accounts);
  });
};

const accountSlice = createSlice({
  name: "account-store",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchHomeFeedPosts.fulfilled, (state, { payload }) => {
      addAccountFromPostToStore(state, payload.data);
    });
    builder.addCase(fetchExploreFeed.fulfilled, (state, { payload }) => {
      addAccountFromPostToStore(state, payload.data);
    });
    builder.addCase(fetchMomentsFeed.fulfilled, (state, { payload }) => {
      addAccountFromPostToStore(state, payload.data);
    });
    builder.addCase(fetchPhotosFeed.fulfilled, (state, { payload }) => {
      addAccountFromPostToStore(state, payload.data);
    });
    builder.addCase(fetchPostSuggestions.fulfilled, (state, { payload }) => {
      addAccountFromPostToStore(state, payload.data);
    });
    builder.addCase(fetchSearchedPosts.fulfilled, (state, { payload }) => {
      addAccountFromPostToStore(state, payload.data);
    });
  },
});

const accountStoreReducer = accountSlice.reducer;

export default accountStoreReducer;

export const {
  actions: {},
} = accountSlice;
