import {
  Draft,
  EntityState,
  PayloadAction,
  createSlice,
  Dictionary,
} from "@reduxjs/toolkit";
import {
  getAccountAdapterInitialState,
  getMemoryAdapterInitialState,
  upsertManyAccounts,
  upsertManyMemories,
  upsertOneAccount,
} from "./account.adapter";
import {
  fetchExploreFeed,
  fetchHomeFeedMemoryAccounts,
  fetchHomeFeedPosts,
  fetchMomentsFeed,
  fetchPhotosFeed,
  fetchPostSuggestions,
  fetchSearchedPosts,
} from "../client/client.thunk";
import { AccountParams, ItemKey } from "../../types/utility.types";
import {
  CommentResponseParams,
  MomentPostResponseParams,
  PhotoPostResponseParams,
  PostResponseParams,
} from "../../types/response.types";
import {
  fetchComments,
  fetchFilteredLikes,
  fetchLikes,
  fetchReplies,
  uploadComment,
} from "../post-store/post.thunks";
import {
  AccountAdapeterParams,
  AccountProfileSectionParams,
  MemoryAdapterParams,
} from "../../types/store.types";
import {
  addRandomAccount,
  fetchAccountAllPosts,
  fetchAccountFollowers,
  fetchAccountFollowings,
  fetchAccountMemories,
  fetchAccountMomentPosts,
  fetchAccountPhotoPosts,
  fetchAccountProfileDetails,
  fetchAccountSearchedFollowers,
  fetchAccountSuggestions,
  fetchAccountTaggedPosts,
} from "./account.thunks";
import { isMomentPost, isPhotoPost } from "../post-store/post.slice";
import {
  fetchHashtagRoute,
  fetchHashtagTopPosts,
} from "../hashtag/hashtag.thunk";
import {
  fetchLocationRoute,
  fetchLocationTopPosts,
} from "../location/location.thunk";

const profiles: Dictionary<AccountProfileSectionParams> = {};

const initialState = {
  accounts: getAccountAdapterInitialState(),
  memories: getMemoryAdapterInitialState(),
  profiles,
};

const addAccountFromPostToStore = (
  state: Draft<{
    accounts: EntityState<AccountParams>;
  }>,
  posts:
    | PostResponseParams[]
    | PhotoPostResponseParams[]
    | MomentPostResponseParams[]
) => {
  const accounts: AccountAdapeterParams[] = [];
  posts.forEach((post) => {
    accounts.push(post.author);
    if (isMomentPost(post) && post.taggedAccounts) {
      accounts.push(...post.taggedAccounts);
    } else if (isPhotoPost(post)) {
      const newAccounts = post.photos
        .map((photo) =>
          photo.taggedAccounts
            ? photo.taggedAccounts.map((tag) => tag.account)
            : []
        )
        .flat();
      accounts.push(...newAccounts);
    }
  });
  upsertManyAccounts(state.accounts, accounts);
};

const addAccountFromCommentToStore = (
  state: Draft<{
    accounts: EntityState<AccountParams>;
  }>,
  comments: CommentResponseParams[]
) => {
  const accounts = comments.map<AccountAdapeterParams>((comment) => ({
    ...comment.author,
  }));
  upsertManyAccounts(state.accounts, accounts);
};

const accountSlice = createSlice({
  name: "account-store",
  initialState,
  reducers: {
    setMemoryLike(
      state,
      {
        payload: { memoryId, value },
      }: PayloadAction<{ memoryId: string; value: boolean }>
    ) {
      const targetMemory = state.memories.entities[memoryId];
      if (targetMemory) {
        targetMemory.metadata.isLiked = value;
      }
    },
    setPendingRequestStatus(
      state,
      {
        payload: { userId, value },
      }: PayloadAction<{ userId: string; value: boolean }>
    ) {
      const account = state.accounts.entities[userId];
      if (!account) return;
      account.hasRequestedToFollowClient = false;
      account.hasFollowedClient = value;
    },
    setFollowRequestStatus(
      state,
      {
        payload: { userId, value },
      }: PayloadAction<{ userId: string; value: boolean }>
    ) {
      const account = state.accounts.entities[userId];
      if (!account) return;
      account.isRequestedToFollow = value;
    },
    setFollowingStatus(
      state,
      {
        payload: { userId, value },
      }: PayloadAction<{ userId: string; value: boolean }>
    ) {
      const account = state.accounts.entities[userId];
      if (!account) return;
      account.isFollowed = value;
      if (account.noOfFollowers !== undefined) {
        account.noOfFollowers = account.noOfFollowers + (value ? 1 : -1);
      }
    },
    setBlockStatus(
      state,
      {
        payload: { userId, value },
      }: PayloadAction<{ userId: string; value: boolean }>
    ) {
      const account = state.accounts.entities[userId];
      if (!account) return;
      account.isBlocked = value;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchHomeFeedPosts.fulfilled, (state, { payload }) => {
      addAccountFromPostToStore(state, payload.items);
    });
    builder.addCase(
      fetchHomeFeedMemoryAccounts.fulfilled,
      (state, { payload }) => {
        upsertManyAccounts(
          state.accounts,
          payload.items.map((item) => item.account)
        );
      }
    );
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
    builder.addCase(fetchHashtagRoute.fulfilled, (state, { payload }) => {
      if (payload.topPosts) {
        addAccountFromPostToStore(state, payload.topPosts.items);
      }
    });
    builder.addCase(fetchHashtagTopPosts.fulfilled, (state, { payload }) => {
      addAccountFromPostToStore(state, payload.items);
    });
    builder.addCase(fetchLocationRoute.fulfilled, (state, { payload }) => {
      if (payload.topPosts) {
        addAccountFromPostToStore(state, payload.topPosts.items);
      }
    });
    builder.addCase(fetchLocationTopPosts.fulfilled, (state, { payload }) => {
      addAccountFromPostToStore(state, payload.items);
    });
    builder.addCase(fetchComments.fulfilled, (state, { payload }) => {
      addAccountFromCommentToStore(state, payload.items);
    });
    builder.addCase(fetchReplies.fulfilled, (state, { payload }) => {
      addAccountFromCommentToStore(state, payload.items);
    });
    builder.addCase(uploadComment.fulfilled, (state, { payload }) => {
      addAccountFromCommentToStore(state, [payload]);
    });
    builder.addCase(fetchLikes.fulfilled, (state, { payload }) => {
      upsertManyAccounts(state.accounts, payload.likes.items);
    });
    builder.addCase(fetchFilteredLikes.fulfilled, (state, { payload }) => {
      upsertManyAccounts(state.accounts, payload.accounts);
    });
    builder.addCase(
      fetchAccountMemories.pending,
      (
        state,
        {
          meta: {
            arg: { userId },
          },
        }
      ) => {
        const targetAccount = state.accounts.entities[userId];
        if (targetAccount) {
          if (targetAccount.memorySection) {
            targetAccount.memorySection.error = null;
            targetAccount.memorySection.isLoading = true;
          } else {
            targetAccount.memorySection = {
              data: null,
              error: null,
              isLoading: true,
            };
          }
        }
      }
    );
    builder.addCase(
      fetchAccountMemories.rejected,
      (
        state,
        {
          meta: {
            arg: { userId },
          },
          payload,
        }
      ) => {
        const memorySection = state.accounts.entities[userId]?.memorySection;
        if (memorySection) {
          memorySection.error = payload;
          memorySection.isLoading = false;
        }
      }
    );
    builder.addCase(
      fetchAccountMemories.fulfilled,
      (
        state,
        {
          meta: {
            arg: { userId },
          },
          payload,
        }
      ) => {
        const targetAccount = state.accounts.entities[userId];
        if (targetAccount) {
          targetAccount.profilePictureUri = payload.account.profilePictureUri;
          const memorySection = targetAccount.memorySection;
          if (memorySection) {
            const newMemories = payload.memories.map<MemoryAdapterParams>(
              (memory) => ({ ...memory, views: null, replies: null })
            );
            memorySection.isLoading = false;
            memorySection.data = payload.memories.map((memory) => ({
              key: memory.id,
            }));
            targetAccount.memoryInfo = {
              noOfAvailableMemories: payload.memories.length,
              noOfUnseenMemories: payload.memories.filter(
                (item) => !item.metadata.isSeen
              ).length,
            };
            upsertManyMemories(state.memories, newMemories);
          }
        }
      }
    );
    builder.addCase(addRandomAccount.fulfilled, (state, { payload }) => {
      upsertOneAccount(state.accounts, payload);
    });
    builder.addCase(
      fetchAccountProfileDetails.fulfilled,
      (
        state,
        {
          payload: { account, recentPosts },
          meta: {
            arg: { userId },
          },
        }
      ) => {
        const newItems = recentPosts
          ? recentPosts.items.map<ItemKey>((item) => ({ key: item.id }))
          : [];
        const targetProfile = state.profiles[userId];
        if (!targetProfile) {
          state.profiles[userId] = {
            createdAt: Date.now(),
            expiresAt: -1,
            photos: null,
            moments: null,
            taggedPosts:
              account.noOfTaggedPosts === 0
                ? { endCursor: "", hasEndReached: true, items: [] }
                : null,
            userId,
            allPosts: recentPosts
              ? {
                  endCursor: recentPosts.endCursor,
                  hasEndReached: recentPosts.hasEndReached,
                  items: newItems,
                }
              : null,
            relatedAccounts: {
              followers: null,
              followings: null,
              suggested: null,
            },
          };
        } else {
          const fetchedAccount = state.accounts.entities[userId];
          if (!fetchedAccount) return;
          targetProfile.allPosts = recentPosts
            ? {
                endCursor: recentPosts.endCursor,
                hasEndReached: recentPosts.hasEndReached,
                items: newItems,
              }
            : null;

          if (account.noOfTaggedPosts === 0) {
            targetProfile.taggedPosts = {
              endCursor: "",
              hasEndReached: true,
              items: [],
            };
          } else if (
            fetchedAccount.noOfTaggedPosts !== account.noOfTaggedPosts
          ) {
            targetProfile.taggedPosts = null;
          }

          if (
            account.noOfPosts === 0 ||
            fetchedAccount.noOfPosts !== account.noOfPosts
          ) {
            targetProfile.moments = null;
            targetProfile.photos = null;
          }
        }
        upsertOneAccount(state.accounts, account);
        if (recentPosts) {
          addAccountFromPostToStore(state, recentPosts.items);
        }
      }
    );
    builder.addCase(
      fetchAccountAllPosts.fulfilled,
      (
        state,
        {
          meta: {
            arg: { userId },
          },
          payload,
        }
      ) => {
        addAccountFromPostToStore(state, payload.items);
        const targetProfile = state.profiles[userId];
        if (!targetProfile) return;
        const newPosts = payload.items.map<ItemKey>((post) => ({
          key: post.id,
        }));
        if (!targetProfile.allPosts) {
          targetProfile.allPosts = {
            items: newPosts,
            endCursor: payload.endCursor,
            hasEndReached: payload.hasEndReached,
          };
        } else {
          const allPosts = targetProfile.allPosts;
          allPosts.endCursor = payload.endCursor;
          allPosts.hasEndReached = payload.hasEndReached;
          allPosts.items = [...allPosts.items, ...newPosts];
        }
      }
    );
    builder.addCase(
      fetchAccountTaggedPosts.fulfilled,
      (
        state,
        {
          meta: {
            arg: { userId },
          },
          payload,
        }
      ) => {
        addAccountFromPostToStore(state, payload.items);
        const targetProfile = state.profiles[userId];
        if (!targetProfile) return;
        const newPosts = payload.items.map<ItemKey>((post) => ({
          key: post.id,
        }));
        if (!targetProfile.taggedPosts) {
          targetProfile.taggedPosts = {
            items: newPosts,
            endCursor: payload.endCursor,
            hasEndReached: payload.hasEndReached,
          };
        } else {
          const taggedPosts = targetProfile.taggedPosts;
          taggedPosts.endCursor = payload.endCursor;
          taggedPosts.hasEndReached = payload.hasEndReached;
          taggedPosts.items = [...taggedPosts.items, ...newPosts];
        }
      }
    );
    builder.addCase(
      fetchAccountPhotoPosts.fulfilled,
      (
        state,
        {
          meta: {
            arg: { userId },
          },
          payload,
        }
      ) => {
        addAccountFromPostToStore(state, payload.items);
        const targetProfile = state.profiles[userId];
        if (!targetProfile) return;
        const newPosts = payload.items.map<ItemKey>((post) => ({
          key: post.id,
        }));
        if (!targetProfile.photos) {
          targetProfile.photos = {
            items: newPosts,
            endCursor: payload.endCursor,
            hasEndReached: payload.hasEndReached,
          };
        } else {
          const photoPosts = targetProfile.photos;
          photoPosts.endCursor = payload.endCursor;
          photoPosts.hasEndReached = payload.hasEndReached;
          photoPosts.items = [...photoPosts.items, ...newPosts];
        }
      }
    );
    builder.addCase(
      fetchAccountMomentPosts.fulfilled,
      (
        state,
        {
          meta: {
            arg: { userId },
          },
          payload,
        }
      ) => {
        addAccountFromPostToStore(state, payload.items);
        const targetProfile = state.profiles[userId];
        if (!targetProfile) return;
        const newPosts = payload.items.map<ItemKey>((post) => ({
          key: post.id,
        }));
        if (!targetProfile.moments) {
          targetProfile.moments = {
            items: newPosts,
            endCursor: payload.endCursor,
            hasEndReached: payload.hasEndReached,
          };
        } else {
          const momentPosts = targetProfile.moments;
          momentPosts.endCursor = payload.endCursor;
          momentPosts.hasEndReached = payload.hasEndReached;
          momentPosts.items = [...momentPosts.items, ...newPosts];
        }
      }
    );
    builder.addCase(
      fetchAccountFollowings.fulfilled,
      (
        state,
        {
          payload,
          meta: {
            arg: { userId },
          },
        }
      ) => {
        const relatedAccounts = state.profiles[userId]?.relatedAccounts;
        if (!relatedAccounts) return;
        const newItems = payload.items.map<ItemKey>((account) => ({
          key: account.username,
        }));
        if (!relatedAccounts.followings) {
          relatedAccounts.followings = {
            endCursor: payload.endCursor,
            hasEndReached: payload.hasEndReached,
            items: newItems,
          };
        } else {
          const followings = relatedAccounts.followings;
          followings.endCursor = payload.endCursor;
          followings.hasEndReached = payload.hasEndReached;
          followings.items = [...followings.items, ...newItems];
        }
        upsertManyAccounts(state.accounts, payload.items);
      }
    );
    builder.addCase(
      fetchAccountFollowers.fulfilled,
      (
        state,
        {
          payload,
          meta: {
            arg: { userId },
          },
        }
      ) => {
        const relatedAccounts = state.profiles[userId]?.relatedAccounts;
        if (!relatedAccounts) return;
        const newItems = payload.items.map<ItemKey>((account) => ({
          key: account.username,
        }));
        if (!relatedAccounts.followers) {
          relatedAccounts.followers = {
            allAccounts: {
              endCursor: payload.endCursor,
              hasEndReached: payload.hasEndReached,
              items: newItems,
            },
            searchedAccounts: {},
          };
        } else {
          const followers = relatedAccounts.followers.allAccounts;
          followers.endCursor = payload.endCursor;
          followers.hasEndReached = payload.hasEndReached;
          followers.items = [...followers.items, ...newItems];
        }
        upsertManyAccounts(state.accounts, payload.items);
      }
    );
    builder.addCase(
      fetchAccountSuggestions.fulfilled,
      (
        state,
        {
          payload,
          meta: {
            arg: { userId },
          },
        }
      ) => {
        const relatedAccounts = state.profiles[userId]?.relatedAccounts;
        if (!relatedAccounts) return;
        const newItems = payload.items.map<ItemKey>((account) => ({
          key: account.username,
        }));

        if (!relatedAccounts.suggested) {
          relatedAccounts.suggested = {
            endCursor: payload.endCursor,
            hasEndReached: payload.hasEndReached,
            items: newItems,
          };
        } else {
          const suggested = relatedAccounts.suggested;
          suggested.endCursor = payload.endCursor;
          suggested.hasEndReached = payload.hasEndReached;
          suggested.items = [...suggested.items, ...newItems];
        }
        upsertManyAccounts(
          state.accounts,
          payload.items.map<AccountParams>((account) => ({
            ...account,
            isFollowed: false,
            isRequestedToFollow: false,
          }))
        );
      }
    );
    builder.addCase(
      fetchAccountSearchedFollowers.fulfilled,
      (
        state,
        {
          payload,
          meta: {
            arg: { searchedPhase, userId },
          },
        }
      ) => {
        const searchedFollowers =
          state.profiles[userId]?.relatedAccounts.followers?.searchedAccounts;
        if (searchedFollowers) {
          searchedFollowers[searchedPhase] = payload.accounts.map<ItemKey>(
            (account) => ({ key: account.username })
          );
        }
        upsertManyAccounts(state.accounts, payload.accounts);
      }
    );
  },
});

const accountStoreReducer = accountSlice.reducer;

export default accountStoreReducer;

export const {
  actions: {
    setMemoryLike,
    setBlockStatus,
    setFollowRequestStatus,
    setFollowingStatus,
    setPendingRequestStatus,
  },
} = accountSlice;
