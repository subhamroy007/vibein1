import {
  Draft,
  EntityState,
  PayloadAction,
  createSlice,
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
import { AccountParams } from "../../types/utility.types";
import {
  CommentResponseParams,
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
  MemoryAdapterParams,
} from "../../types/store.types";
import { addRandomAccount, fetchAccountMemories } from "./account.thunks";

const initialState = {
  accounts: getAccountAdapterInitialState(),
  memories: getMemoryAdapterInitialState(),
};

const addAccountFromPostToStore = (
  state: Draft<{
    accounts: EntityState<AccountParams>;
  }>,
  posts: PostResponseParams[]
) => {
  const accounts: AccountAdapeterParams[] = [];
  posts.forEach((post) => {
    accounts.push(post.author);

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
            targetAccount.noOfAvailableMemories = payload.memories.length;
            targetAccount.noOfUnseenMemories = payload.memories.filter(
              (item) => !item.metadata.isSeen
            ).length;
            upsertManyMemories(state.memories, newMemories);
          }
        }
      }
    );
    builder.addCase(addRandomAccount.fulfilled, (state, { payload }) => {
      upsertOneAccount(state.accounts, payload);
    });
  },
});

const accountStoreReducer = accountSlice.reducer;

export default accountStoreReducer;

export const {
  actions: { setMemoryLike },
} = accountSlice;
