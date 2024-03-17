import { createSlice, Draft, EntityState } from "@reduxjs/toolkit";
import { getPostAdapterInitialState, upsertManyPosts } from "./post.adapter";
import {
  fetchExploreFeed,
  fetchHomeFeedPosts,
  fetchMomentsFeed,
  fetchPhotosFeed,
  fetchPostSuggestions,
  fetchSearchedPosts,
} from "../client/client.thunk";
import { PostResponseParams } from "../../types/response.types";
import {
  PostAdapterParams,
  PostPhotoAccountTagAdapterParams,
} from "../../types/store.types";

const initialState = {
  posts: getPostAdapterInitialState(),
};

const transformToPostAdapter = (
  post: PostResponseParams
): PostAdapterParams => {
  if (post.type === "photo-post") {
    return {
      ...post,
      author: post.author.username,
      photos: post.photos.map((photo) => ({
        ...photo,
        taggedAccounts: photo.taggedAccounts
          ? photo.taggedAccounts.map<PostPhotoAccountTagAdapterParams>(
              (tag) => ({
                account: tag.account.username,
                position: tag.position,
              })
            )
          : undefined,
      })),
    };
  }
  return {
    ...post,
    author: post.author.username,
    taggedAccounts: post.taggedAccounts
      ? post.taggedAccounts.map((account) => account.username)
      : undefined,
  };
};

const addPostsToStore = (
  state: Draft<EntityState<PostAdapterParams>>,
  posts: PostResponseParams[]
) => {
  const newPosts: PostAdapterParams[] = [];
  posts.forEach((post) => {
    newPosts.push(transformToPostAdapter(post));
  });
  upsertManyPosts(state, newPosts);
};

const postSlice = createSlice({
  name: "post-store",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchHomeFeedPosts.fulfilled, (state, { payload }) => {
      addPostsToStore(state.posts, payload.data);
    });
    builder.addCase(fetchExploreFeed.fulfilled, (state, { payload }) => {
      addPostsToStore(state.posts, payload.data);
    });
    builder.addCase(fetchMomentsFeed.fulfilled, (state, { payload }) => {
      addPostsToStore(state.posts, payload.data);
    });
    builder.addCase(fetchPhotosFeed.fulfilled, (state, { payload }) => {
      addPostsToStore(state.posts, payload.data);
    });
    builder.addCase(fetchPostSuggestions.fulfilled, (state, { payload }) => {
      addPostsToStore(state.posts, payload.data);
    });
    builder.addCase(fetchSearchedPosts.fulfilled, (state, { payload }) => {
      addPostsToStore(state.posts, payload.data);
    });
  },
});

const postStoreReducer = postSlice.reducer;

export default postStoreReducer;

export const {
  actions: {},
} = postSlice;
