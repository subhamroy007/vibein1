import {
  getForYouMomentFeedThunk,
  getForYouPhotosFeedThunk,
  getHomeFeedThunk,
} from "./../client/client.thunk";
import {
  Draft,
  EntityState,
  PayloadAction,
  createSlice,
} from "@reduxjs/toolkit";
import { getPostInitialState, upsertManyPost } from "./post.adapter";
import { fetchComments, fetchSimilarPosts } from "./post.thunk";
import { PostResponseParams } from "../../types/response.types";
import {
  PostAdapterParams,
  PostFeedItemIdentfierParams,
} from "../../types/store.types";
import { getLocationScreenThunk } from "../location-screen/location_screen.thunk";
import {
  getAccountAllPostThunk,
  getAccountHomeRouteThunk,
  getAccountMomentsThunk,
  getAccountPhotosThunk,
  getAccountTaggedPostThunk,
} from "../account/account.thunk";
import {
  getHashtagGeneralRouteThunk,
  getHashtagTopPostsRouteThunk,
} from "../hashtag/hashtag.thunk";

/**
 * utlity function that takes a single argument of type PostResponseParams
 * and converts it to a type of PostAdapterParams
 * by changing all the other entities in the post (e.g createdBy, taggedAccounts)
 * to its corresponding id references
 * @param post
 * @returns
 */
function tranformToPostAdapterParams(
  post: PostResponseParams
): PostAdapterParams {
  return {
    ...post,
    createdBy: post.createdBy.username,
    taggedAccounts: post.taggedAccounts
      ? post.taggedAccounts.map((account) => account.username)
      : undefined,
    comments: [],
    commentSectionThunkInfo: {
      state: "idle",
      meta: null,
      lastRequestError: null,
    },
    similarPosts: [{ postId: post._id, type: "post" }],
    similarPostSectionThunkInfo: {
      lastRequestError: null,
      meta: null,
      state: "idle",
    },
  };
}

function addPostsToStore(
  state: Draft<EntityState<PostAdapterParams>>,
  posts: PostResponseParams[]
) {
  const entities: PostAdapterParams[] = [];
  posts.forEach((post) => {
    entities.push(tranformToPostAdapterParams(post));
  });
  upsertManyPost(state, entities);
}

const postSlice = createSlice({
  name: "post",
  initialState: getPostInitialState(),
  reducers: {
    addManyPostToStore: (
      state,
      action: PayloadAction<PostResponseParams[]>
    ) => {
      upsertManyPost(
        state,
        action.payload.map((Post) => tranformToPostAdapterParams(Post))
      );
    },

    /**
     * switch the value of isLiked field between true or false
     * @param state
     * @param action
     */
    togglePostLikeState: (state, action: PayloadAction<string>) => {
      const targetPostId = action.payload; //fetch the target post id

      const targetPost = state.entities[targetPostId]; //retrieve the target post adapter object from the target post id

      //check if the target post exists
      if (targetPost) {
        //increment or decrement the value of noOfLikes based on the flag value
        targetPost.engagementSummary.noOfLikes = targetPost.isLiked
          ? targetPost.engagementSummary.noOfLikes - 1
          : targetPost.engagementSummary.noOfLikes + 1;
        targetPost.isLiked = !targetPost.isLiked; //toggle the flag state
      }
    },

    /**
     * switch the value of isLiked field between true or false
     * @param state
     * @param action
     */
    togglePostSaveState: (state, action: PayloadAction<string>) => {
      const targetPostId = action.payload; //fetch the target post id

      const targetPost = state.entities[targetPostId]; //retrieve the target post adapter object from the target post id

      //check if the target post exists
      if (targetPost) {
        targetPost.isSaved = !targetPost.isSaved; //toggle the flag state
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getHomeFeedThunk.fulfilled,
      (state, { payload: { posts } }) => {
        upsertManyPost(
          state,
          posts.map((post) => tranformToPostAdapterParams(post))
        );
      }
    );
    builder.addCase(
      getHashtagGeneralRouteThunk.fulfilled,
      (state, { payload: { topPosts } }) => {
        addPostsToStore(state, topPosts);
      }
    );
    builder.addCase(
      getHashtagTopPostsRouteThunk.fulfilled,
      (state, { payload: { posts } }) => {
        addPostsToStore(state, posts);
      }
    );
    builder.addCase(
      getLocationScreenThunk.fulfilled,
      (state, { payload: { posts } }) => {
        upsertManyPost(
          state,
          posts.map((post) => tranformToPostAdapterParams(post))
        );
      }
    );
    builder.addCase(
      getAccountHomeRouteThunk.fulfilled,
      (state, { payload: { posts } }) => {
        upsertManyPost(
          state,
          posts.map((post) => tranformToPostAdapterParams(post))
        );
      }
    );
    builder.addCase(
      getAccountAllPostThunk.fulfilled,
      (state, { payload: { posts } }) => {
        upsertManyPost(
          state,
          posts.map((post) => tranformToPostAdapterParams(post))
        );
      }
    );
    builder.addCase(
      getAccountTaggedPostThunk.fulfilled,
      (state, { payload: { posts } }) => {
        upsertManyPost(
          state,
          posts.map((post) => tranformToPostAdapterParams(post))
        );
      }
    );
    builder.addCase(
      getAccountPhotosThunk.fulfilled,
      (state, { payload: { posts } }) => {
        upsertManyPost(
          state,
          posts.map((post) => tranformToPostAdapterParams(post))
        );
      }
    );
    builder.addCase(
      getAccountMomentsThunk.fulfilled,
      (state, { payload: { posts } }) => {
        upsertManyPost(
          state,
          posts.map((post) => tranformToPostAdapterParams(post))
        );
      }
    );
    builder.addCase(
      getForYouMomentFeedThunk.fulfilled,
      (state, { payload: { posts } }) => {
        upsertManyPost(
          state,
          posts.map((post) => tranformToPostAdapterParams(post))
        );
      }
    );
    builder.addCase(
      getForYouPhotosFeedThunk.fulfilled,
      (state, { payload: { posts } }) => {
        upsertManyPost(
          state,
          posts.map((post) => tranformToPostAdapterParams(post))
        );
      }
    );
  },
});

const postReducer = postSlice.reducer;

export default postReducer;

export const {
  actions: { addManyPostToStore, togglePostLikeState, togglePostSaveState },
} = postSlice;
