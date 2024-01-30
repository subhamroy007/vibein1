import {
  getForYouMomentFeedThunk,
  getForYouPhotosFeedThunk,
  getHomeFeedThunk,
  getInboxChatsThunk,
} from "./../client/client.thunk";
import {
  EntityState,
  PayloadAction,
  createSlice,
  Draft,
} from "@reduxjs/toolkit";
import {
  getAccountInitialState,
  upsertManyAccount,
  upsertOneAccount,
} from "./account.adapter";
import { fetchComments, fetchSimilarPosts } from "../post/post.thunk";
import {
  AccountResponseParams,
  PostResponseParams,
} from "../../types/response.types";
import {
  AccountAdapterParams,
  AccountStoreParams,
} from "../../types/store.types";
import { fetchReplies } from "../comment/comment.thunks";
import { getLocationScreenThunk } from "../location-screen/location_screen.thunk";
import {
  getAccountAllPostThunk,
  getAccountHomeRouteThunk,
  getAccountMomentsThunk,
  getAccountPhotosThunk,
  getAccountTaggedPostThunk,
} from "./account.thunk";
import {
  getHashtagGeneralRouteThunk,
  getHashtagTopPostsRouteThunk,
} from "../hashtag/hashtag.thunk";
import { getChatMessagesThunk } from "../chat/chat.thunk";

function tranformToAccountAdapterParams(
  account: AccountResponseParams
): AccountAdapterParams {
  return {
    ...account,
  };
}

function addPostAccountsToStore(
  state: Draft<EntityState<AccountAdapterParams>>,
  posts: PostResponseParams[]
) {
  const accounts: AccountAdapterParams[] = [];
  posts.forEach((post) => {
    accounts.push(tranformToAccountAdapterParams(post.createdBy));
    if (post.taggedAccounts) {
      post.taggedAccounts.forEach((taggedAccount) => {
        accounts.push(tranformToAccountAdapterParams(taggedAccount));
      });
    }
  });
  upsertManyAccount(state, accounts);
}

const accountStoreInitialState: AccountStoreParams = {
  profiles: {},
  ...getAccountInitialState(),
};

const accountSlice = createSlice({
  name: "account",
  initialState: accountStoreInitialState,
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
    initAccountProfileRoute(
      state,
      {
        payload: { routeId, username },
      }: PayloadAction<{ routeId: string; username: string }>
    ) {
      state.profiles[routeId] = {
        routeId,
        username,
        home: {
          state: "idle",
          data: {
            allPosts: { hasEndReached: false, posts: [] },
            suggestedAccounts: [],
          },
          lastUpdatedAt: Date.now(),
        },
        moments: {
          state: "idle",

          lastUpdatedAt: Date.now(),

          data: { posts: [], hasEndReached: false },
        },
        photos: {
          state: "idle",

          lastUpdatedAt: Date.now(),

          data: { posts: [], hasEndReached: false },
        },
        taggedPosts: {
          state: "idle",

          lastUpdatedAt: Date.now(),

          data: { posts: [], hasEndReached: false },
        },
      };
    },
    removeAccountProfileRoute(
      state,
      { payload: { routeId } }: PayloadAction<{ routeId: string }>
    ) {
      state.profiles[routeId] = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getHomeFeedThunk.fulfilled,
      (state, { payload: { posts } }) => {
        addPostAccountsToStore(state, posts);
      }
    );
    builder.addCase(
      getHashtagGeneralRouteThunk.fulfilled,
      (state, { payload: { topPosts } }) => {
        addPostAccountsToStore(state, topPosts);
      }
    );
    builder.addCase(
      getHashtagTopPostsRouteThunk.fulfilled,
      (state, { payload: { posts } }) => {
        addPostAccountsToStore(state, posts);
      }
    );
    builder.addCase(
      getLocationScreenThunk.fulfilled,
      (state, { payload: { posts } }) => {
        addPostAccountsToStore(state, posts);
      }
    );
    builder.addCase(
      getAccountHomeRouteThunk.fulfilled,
      (
        state,
        {
          payload: { posts, account },
          meta: {
            arg: { routeId },
          },
        }
      ) => {
        addPostAccountsToStore(state, posts);
        upsertOneAccount(state, tranformToAccountAdapterParams(account));
        const targetRoute = state.profiles[routeId]?.home;
        if (targetRoute) {
          targetRoute.state = "success";
          targetRoute.data.allPosts = {
            hasEndReached: false,
            posts: posts.map((post) => post._id),
          };
          targetRoute.lastUpdatedAt = Date.now();
          targetRoute.data.suggestedAccounts = [];
        }
      }
    );
    builder.addCase(
      getAccountHomeRouteThunk.pending,
      (
        state,
        {
          meta: {
            arg: { routeId },
          },
        }
      ) => {
        const targetRoute = state.profiles[routeId]?.home;
        if (targetRoute) {
          targetRoute.state = "loading";
        }
      }
    );
    builder.addCase(
      getAccountHomeRouteThunk.rejected,
      (
        state,
        {
          meta: {
            arg: { routeId },
          },
        }
      ) => {
        const targetRoute = state.profiles[routeId]?.home;
        if (targetRoute) {
          targetRoute.state = "failed";
        }
      }
    );
    builder.addCase(
      getAccountAllPostThunk.fulfilled,
      (
        state,
        {
          payload: { posts },
          meta: {
            arg: { routeId, username },
          },
        }
      ) => {
        addPostAccountsToStore(state, posts);
        const targetRoute = state.profiles[routeId]?.home;

        if (targetRoute) {
          targetRoute.state = "success";
          targetRoute.data.allPosts.hasEndReached = Math.random() > 0.5;
          targetRoute.data.allPosts.posts = [
            ...targetRoute.data.allPosts.posts,
            ...(targetRoute.data.allPosts.hasEndReached
              ? []
              : posts.map((post) => post._id)),
          ];
        }
      }
    );
    builder.addCase(
      getAccountAllPostThunk.pending,
      (
        state,
        {
          meta: {
            arg: { routeId },
          },
        }
      ) => {
        const targetRoute = state.profiles[routeId]?.home;
        if (targetRoute) {
          targetRoute.state = "loading";
        }
      }
    );
    builder.addCase(
      getAccountAllPostThunk.rejected,
      (
        state,
        {
          meta: {
            arg: { routeId },
          },
        }
      ) => {
        const targetRoute = state.profiles[routeId]?.home;
        if (targetRoute) {
          targetRoute.state = "failed";
        }
      }
    );
    builder.addCase(
      getForYouMomentFeedThunk.fulfilled,
      (state, { payload: { posts } }) => {
        addPostAccountsToStore(state, posts);
      }
    );
    builder.addCase(
      getForYouPhotosFeedThunk.fulfilled,
      (state, { payload: { posts } }) => {
        addPostAccountsToStore(state, posts);
      }
    );
    builder.addCase(
      getAccountTaggedPostThunk.fulfilled,
      (
        state,
        {
          payload: { posts },
          meta: {
            arg: { routeId, refresh },
            requestTimestamp,
          },
        }
      ) => {
        addPostAccountsToStore(state, posts);
        const targetRoute = state.profiles[routeId]?.taggedPosts;
        if (targetRoute) {
          targetRoute.state = "success";
          const newPostIds = posts.map((post) => post._id);
          if (refresh || !targetRoute.data.posts.length) {
            targetRoute.data = {
              posts: newPostIds,
              hasEndReached: false,
            };
            targetRoute.lastUpdatedAt = Date.now();
          } else if (requestTimestamp > targetRoute.lastUpdatedAt) {
            targetRoute.data.hasEndReached = Math.random() > 0.5;
            targetRoute.data.posts = [
              ...targetRoute.data.posts,
              ...(targetRoute.data.hasEndReached ? [] : newPostIds),
            ];
          }
        }
      }
    );
    builder.addCase(
      getAccountTaggedPostThunk.pending,
      (
        state,
        {
          meta: {
            arg: { routeId },
          },
        }
      ) => {
        const targetRoute = state.profiles[routeId]?.taggedPosts;
        if (targetRoute) {
          targetRoute.state = "loading";
        }
      }
    );
    builder.addCase(
      getAccountTaggedPostThunk.rejected,
      (
        state,
        {
          meta: {
            arg: { routeId },
          },
        }
      ) => {
        const targetRoute = state.profiles[routeId]?.taggedPosts;
        if (targetRoute) {
          targetRoute.state = "failed";
        }
      }
    );
    builder.addCase(
      getAccountMomentsThunk.fulfilled,
      (
        state,
        {
          payload: { posts },
          meta: {
            arg: { routeId, refresh },
            requestTimestamp,
          },
        }
      ) => {
        addPostAccountsToStore(state, posts);
        const targetRoute = state.profiles[routeId]?.moments;
        if (targetRoute) {
          targetRoute.state = "success";
          const newPostIds = posts.map((post) => post._id);
          if (refresh || !targetRoute.data.posts.length) {
            targetRoute.data = {
              posts: newPostIds,
              hasEndReached: false,
            };
            targetRoute.lastUpdatedAt = Date.now();
          } else if (requestTimestamp > targetRoute.lastUpdatedAt) {
            targetRoute.data.hasEndReached = Math.random() > 0.5;
            targetRoute.data.posts = [
              ...targetRoute.data.posts,
              ...(targetRoute.data.hasEndReached ? [] : newPostIds),
            ];
          }
        }
      }
    );
    builder.addCase(
      getAccountMomentsThunk.pending,
      (
        state,
        {
          meta: {
            arg: { routeId },
          },
        }
      ) => {
        const targetRoute = state.profiles[routeId]?.moments;
        if (targetRoute) {
          targetRoute.state = "loading";
        }
      }
    );
    builder.addCase(
      getAccountMomentsThunk.rejected,
      (
        state,
        {
          meta: {
            arg: { routeId },
          },
        }
      ) => {
        const targetRoute = state.profiles[routeId]?.moments;
        if (targetRoute) {
          targetRoute.state = "failed";
        }
      }
    );
    builder.addCase(
      getAccountPhotosThunk.fulfilled,
      (
        state,
        {
          payload: { posts },
          meta: {
            arg: { routeId, refresh },
            requestTimestamp,
          },
        }
      ) => {
        addPostAccountsToStore(state, posts);
        const targetRoute = state.profiles[routeId]?.photos;
        if (targetRoute) {
          targetRoute.state = "success";
          const newPostIds = posts.map((post) => post._id);
          if (refresh || !targetRoute.data.posts.length) {
            targetRoute.data = {
              posts: newPostIds,
              hasEndReached: false,
            };
            targetRoute.lastUpdatedAt = Date.now();
          } else if (requestTimestamp > targetRoute.lastUpdatedAt) {
            targetRoute.data.hasEndReached = Math.random() > 0.5;
            targetRoute.data.posts = [
              ...targetRoute.data.posts,
              ...(targetRoute.data.hasEndReached ? [] : newPostIds),
            ];
          }
        }
      }
    );
    builder.addCase(
      getAccountPhotosThunk.pending,
      (
        state,
        {
          meta: {
            arg: { routeId },
          },
        }
      ) => {
        const targetRoute = state.profiles[routeId]?.photos;
        if (targetRoute) {
          targetRoute.state = "loading";
        }
      }
    );
    builder.addCase(
      getAccountPhotosThunk.rejected,
      (
        state,
        {
          meta: {
            arg: { routeId },
          },
        }
      ) => {
        const targetRoute = state.profiles[routeId]?.photos;
        if (targetRoute) {
          targetRoute.state = "failed";
        }
      }
    );
    builder.addCase(
      getInboxChatsThunk.fulfilled,
      (state, { payload: { chats } }) => {
        const newAccounts = chats
          .map((chat) => {
            const accounts = [
              tranformToAccountAdapterParams(chat.receipient.account),
            ];
            accounts.push(
              ...chat.recentMessages
                .map((message) => {
                  return [
                    tranformToAccountAdapterParams(message.createdBy),
                    ...message.likes.map((account) =>
                      tranformToAccountAdapterParams(account)
                    ),
                  ];
                })
                .flat()
            );
            return accounts;
          })
          .flat();
        upsertManyAccount(state, newAccounts);
      }
    );
    builder.addCase(
      getChatMessagesThunk.fulfilled,
      (state, { payload: { messages } }) => {
        const newAccounts = messages
          .map((message) => {
            return [
              tranformToAccountAdapterParams(message.createdBy),
              ...message.likes.map((account) =>
                tranformToAccountAdapterParams(account)
              ),
            ];
          })
          .flat();
        upsertManyAccount(state, newAccounts);
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
    initAccountProfileRoute,
    removeAccountProfileRoute,
  },
} = accountSlice;
