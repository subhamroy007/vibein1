import { getInboxChatsThunk } from "./../client/client.thunk";
import {
  EntityState,
  PayloadAction,
  createSlice,
  Draft,
  Update,
} from "@reduxjs/toolkit";
import {
  addManyAccounts,
  getAccountInitialState,
  updateManyAccount,
  upsertManyAccount,
  upsertOneAccount,
} from "./account.adapter";
import {
  AccountResponseParams,
  ChatResponseParams,
  MessageResponseParams,
  OutDatedResponseParams2,
} from "../../types/response.types";
import {
  AccountAdapterParams,
  AccountStoreParams,
} from "../../types/store.types";
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
import { getChatInfoThunk, getChatMessagesThunk } from "../inbox/chat.thunk";

function tranformToAccountAdapterParams(
  account: AccountResponseParams
): AccountAdapterParams {
  return {
    ...account,
  };
}

function addPostAccountsToStore(
  state: Draft<EntityState<AccountAdapterParams>>,
  posts: OutDatedResponseParams2[]
) {
  const accounts: AccountAdapterParams[] = [];
  posts.forEach((post) => {
    accounts.push(tranformToAccountAdapterParams(post.author));
    if (post.taggedAccounts) {
      post.taggedAccounts.forEach((taggedAccount) => {
        accounts.push(tranformToAccountAdapterParams(taggedAccount));
      });
    }
  });
  const newAccounts: AccountAdapterParams[] = [];
  const existingAccounts: Update<AccountAdapterParams>[] = [];
  accounts.forEach((account) => {
    state.entities[account.username]
      ? existingAccounts.push({ id: account.username, changes: account })
      : newAccounts.push(account);
  });
  addManyAccounts(state, newAccounts);
  updateManyAccount(state, existingAccounts);
}

function addChatsAccountToStore(
  state: Draft<EntityState<AccountAdapterParams>>,
  chats: ChatResponseParams[]
) {
  const accounts = extractAccountFromChats(chats);
  const newAccounts: AccountAdapterParams[] = [];
  const existingAccounts: Update<AccountAdapterParams>[] = [];
  accounts.forEach((account) => {
    state.entities[account.username]
      ? existingAccounts.push({ id: account.username, changes: account })
      : newAccounts.push(account);
  });
  addManyAccounts(state, newAccounts);
  updateManyAccount(state, existingAccounts);
}

function addMessagesAccountToStore(
  state: Draft<EntityState<AccountAdapterParams>>,
  messages: MessageResponseParams[]
) {
  const accounts = extractAccountFromMessages(messages);
  const newAccounts: AccountAdapterParams[] = [];
  const existingAccounts: Update<AccountAdapterParams>[] = [];
  accounts.forEach((account) => {
    state.entities[account.username]
      ? existingAccounts.push({ id: account.username, changes: account })
      : newAccounts.push(account);
  });
  addManyAccounts(state, newAccounts);
  updateManyAccount(state, existingAccounts);
}

const accountStoreInitialState: AccountStoreParams = {
  profiles: {},
  ...getAccountInitialState(),
};

const extractAccountFromMessages = (messages: MessageResponseParams[]) => {
  return messages
    .map((message) => {
      const nestedAccounts = message.reactions.map((reaction) =>
        tranformToAccountAdapterParams({
          ...reaction.author,
        })
      );
      nestedAccounts.push(
        tranformToAccountAdapterParams({
          ...message.author,
        })
      );
      return nestedAccounts;
    })
    .flat();
};

const extractAccountFromChats = (chats: ChatResponseParams[]) => {
  return chats
    .map((chat) => {
      const nestedAccounts = [
        tranformToAccountAdapterParams({
          ...chat.receipient.account,
        }),
      ];
      if (chat.recentMessages) {
        nestedAccounts.push(
          ...extractAccountFromMessages(chat.recentMessages.data)
        );
      }
      return nestedAccounts;
    })
    .flat();
};

const accountSlice = createSlice({
  name: "account",
  initialState: accountStoreInitialState,
  reducers: {
    addManyAccountToStore: (
      state,
      { payload: accounts }: PayloadAction<AccountResponseParams[]>
    ) => {
      const newAccounts: AccountAdapterParams[] = [];
      const existingAccounts: Update<AccountAdapterParams>[] = [];
      accounts.forEach((account) => {
        state.entities[account.username]
          ? existingAccounts.push({
              id: account.username,
              changes: account,
            })
          : newAccounts.push(account);
      });
      addManyAccounts(state, newAccounts);
      updateManyAccount(state, existingAccounts);
    },
    toggleAccountFollowingState: (state, action: PayloadAction<string>) => {
      const targetAccountId = action.payload;
      const targetAccount = state.entities[targetAccountId];
      if (targetAccount) {
        if (targetAccount.isFollowed !== undefined) {
          if (targetAccount.noOfFollowers !== undefined) {
            targetAccount.noOfFollowers = targetAccount.isFollowed
              ? targetAccount.noOfFollowers - 1
              : targetAccount.noOfFollowers + 1;
          }
          targetAccount.isFollowed = !targetAccount.isFollowed;
        }
      }
    },
    toggleAccountBlockState: (state, action: PayloadAction<string>) => {
      const targetAccountId = action.payload;
      const targetAccount = state.entities[targetAccountId];
      if (targetAccount) {
        if (targetAccount.isBlocked !== undefined) {
          targetAccount.isBlocked = !targetAccount.isBlocked;
        }
      }
    },
    toggleAccountFollowRequestState: (state, action: PayloadAction<string>) => {
      const targetAccountId = action.payload;
      const targetAccount = state.entities[targetAccountId];
      if (targetAccount) {
        if (targetAccount.isRequestedToFollow !== undefined) {
          targetAccount.isRequestedToFollow =
            !targetAccount.isRequestedToFollow;
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
    addAccountFromChats: (
      state,
      { payload }: PayloadAction<ChatResponseParams[]>
    ) => {
      addChatsAccountToStore(state, payload);
    },
  },
  extraReducers: (builder) => {
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
            posts: posts.map((post) => post.id),
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
              : posts.map((post) => post.id)),
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
          const newPostIds = posts.map((post) => post.id);
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
          const newPostIds = posts.map((post) => post.id);
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
          const newPostIds = posts.map((post) => post.id);
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
      (state, { payload: { data } }) => {
        addChatsAccountToStore(state, data);
      }
    );
    builder.addCase(
      getChatMessagesThunk.fulfilled,
      (state, { payload: { data } }) => {
        addMessagesAccountToStore(state, data);
      }
    );
    builder.addCase(getChatInfoThunk.fulfilled, (state, { payload }) => {
      addChatsAccountToStore(state, [payload]);
    });
  },
});

const accountReducer = accountSlice.reducer;

export default accountReducer;

export const {
  actions: {
    addManyAccountToStore,
    toggleAccountFollowingState,
    toggleAccountFollowRequestState,
    toggleAccountBlockState,
    initAccountProfileRoute,
    removeAccountProfileRoute,
    addAccountFromChats,
  },
} = accountSlice;
