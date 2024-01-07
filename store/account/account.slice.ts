import {
  getForYouMomentFeedThunk,
  getForYouPhotosFeedThunk,
  getHomeFeedThunk,
} from "./../client/client.thunk";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getAccountInitialState, upsertManyAccount } from "./account.adapter";
import { fetchComments, fetchSimilarPosts } from "../post/post.thunk";
import {
  AccountResponseParams,
  FulFilledActionParams,
  HashTagPageResponseParams,
  HashtagPageRequestParams,
} from "../../types/response.types";
import { AccountAdapterParams } from "../../types/store.types";
import { fetchReplies } from "../comment/comment.thunks";
import { getHashtagPageThunk } from "../hashtag/hashtag.thunk";

function tranformToAccountAdapterParams(
  account: AccountResponseParams
): AccountAdapterParams {
  return {
    ...account,
  };
}

const accountSlice = createSlice({
  name: "account",
  initialState: getAccountInitialState(),
  reducers: {
    addManyAccountToStore: (
      state,
      action: PayloadAction<AccountResponseParams[]>
    ) => {
      upsertManyAccount(
        state,
        action.payload.map((account) => tranformToAccountAdapterParams(account))
      );
    },
    toggleAccountFollowingState: (state, action: PayloadAction<string>) => {
      const targetAccountId = action.payload;
      const targetAccount = state.entities[targetAccountId];
      if (targetAccount) {
        if (targetAccount.isFollowing !== undefined) {
          if (targetAccount.noOfFollowers !== undefined) {
            targetAccount.noOfFollowers = targetAccount.isFollowing
              ? targetAccount.noOfFollowers - 1
              : targetAccount.noOfFollowers + 1;
          }
          targetAccount.isFollowing = !targetAccount.isFollowing;
        }
      }
    },
    toggleAccountFollowRequestState: (state, action: PayloadAction<string>) => {
      const targetAccountId = action.payload;
      const targetAccount = state.entities[targetAccountId];
      if (targetAccount) {
        if (targetAccount.hasRequestedToFollow !== undefined) {
          targetAccount.hasRequestedToFollow =
            !targetAccount.hasRequestedToFollow;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getHomeFeedThunk.fulfilled,
      (state, { payload: { posts } }) => {
        const accounts: AccountAdapterParams[] = [];

        posts.forEach((post) => {
          accounts.push(tranformToAccountAdapterParams(post.createdBy));
          if (post.taggedAccounts) {
            accounts.push(
              ...post.taggedAccounts.map((taggedAccount) =>
                tranformToAccountAdapterParams(taggedAccount)
              )
            );
          }
        });

        upsertManyAccount(state, accounts);
      }
    );
    builder.addCase(
      getHashtagPageThunk.fulfilled,
      (state, { payload: { posts } }) => {
        const accounts: AccountAdapterParams[] = [];

        posts.forEach((post) => {
          accounts.push(tranformToAccountAdapterParams(post.createdBy));
          if (post.taggedAccounts) {
            accounts.push(
              ...post.taggedAccounts.map((taggedAccount) =>
                tranformToAccountAdapterParams(taggedAccount)
              )
            );
          }
        });

        upsertManyAccount(state, accounts);
      }
    );
    builder.addCase(
      getForYouMomentFeedThunk.fulfilled,
      (state, { payload: { posts } }) => {
        const accounts: AccountAdapterParams[] = [];

        posts.forEach((post) => {
          accounts.push(tranformToAccountAdapterParams(post.createdBy));
          if (post.taggedAccounts) {
            accounts.push(
              ...post.taggedAccounts.map((taggedAccount) =>
                tranformToAccountAdapterParams(taggedAccount)
              )
            );
          }
        });

        upsertManyAccount(state, accounts);
      }
    );
    builder.addCase(
      getForYouPhotosFeedThunk.fulfilled,
      (state, { payload: { posts } }) => {
        const accounts: AccountAdapterParams[] = [];

        posts.forEach((post) => {
          accounts.push(tranformToAccountAdapterParams(post.createdBy));
          if (post.taggedAccounts) {
            accounts.push(
              ...post.taggedAccounts.map((taggedAccount) =>
                tranformToAccountAdapterParams(taggedAccount)
              )
            );
          }
        });

        upsertManyAccount(state, accounts);
      }
    );
    builder.addCase(
      fetchSimilarPosts.fulfilled,
      (state, { payload: { posts } }) => {
        const accounts: AccountAdapterParams[] = [];

        posts.forEach((post) => {
          accounts.push(tranformToAccountAdapterParams(post.createdBy));
          if (post.taggedAccounts) {
            accounts.push(
              ...post.taggedAccounts.map((taggedAccount) =>
                tranformToAccountAdapterParams(taggedAccount)
              )
            );
          }
        });

        upsertManyAccount(state, accounts);
      }
    );
    builder.addCase(
      fetchComments.fulfilled,
      (state, { payload: { comments } }) => {
        const accounts: AccountAdapterParams[] = [];
        comments.forEach((comment) => {
          accounts.push(tranformToAccountAdapterParams(comment.createdBy));
          if (comment.replies) {
            accounts.push(
              ...comment.replies.map((reply) =>
                tranformToAccountAdapterParams(reply.createdBy)
              )
            );
          }
        });
        upsertManyAccount(state, accounts);
      }
    );
    builder.addCase(
      fetchReplies.fulfilled,
      (state, { payload: { replies } }) => {
        const accounts: AccountAdapterParams[] = [];
        replies.forEach((reply) => {
          accounts.push(tranformToAccountAdapterParams(reply.createdBy));
        });
        upsertManyAccount(state, accounts);
      }
    );
  },
});

const accountReducer = accountSlice.reducer;

export default accountReducer;

export const {
  actions: {
    addManyAccountToStore,
    toggleAccountFollowingState,
    toggleAccountFollowRequestState,
  },
} = accountSlice;
