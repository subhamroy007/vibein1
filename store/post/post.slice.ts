import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getPostInitialState, upsertManyPost } from "./post.adapter";
import { getHomeFeedData } from "../client/client.thunk";
import { fetchComments } from "./post.thunk";
import { PostResponseParams } from "../../types/response.types";
import { PostAdapterParams } from "../../types/store.types";

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
  };
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
      getHomeFeedData.fulfilled,
      (state, { payload: { posts } }) => {
        upsertManyPost(
          state,
          posts.map((post) => tranformToPostAdapterParams(post))
        );
      }
    );
    builder.addCase(fetchComments.pending, (state, action) => {
      const targetPostId = action.meta.arg; //fetch the target post id;
      const targetPost = state.entities[targetPostId]; //fetch the target post from the store;
      if (targetPost) {
        targetPost.commentSectionThunkInfo = {
          lastRequestError: null,
          meta: null,
          state: "loading",
        };
      }
    });

    builder.addCase(fetchComments.rejected, (state, action) => {
      const targetPostId = action.meta.arg; //fetch the target post id;
      const targetPost = state.entities[targetPostId]; //fetch the target post from the store;
      if (targetPost) {
        targetPost.commentSectionThunkInfo = {
          lastRequestError: action.payload!,
          meta: {
            lastRequestStatusCode: action.meta.statusCode!,
            lastRequestTimestamp: action.meta.requestTimestamp!,
          },
          state: "failed",
        };
      }
    });

    builder.addCase(fetchComments.fulfilled, (state, action) => {
      const targetPostId = action.meta.arg; //fetch the target post id;

      const targetPost = state.entities[targetPostId]; //fetch the target post from the post id;

      //check if the target post exists
      if (targetPost) {
        targetPost.comments = [
          ...action.payload.comments.map((comment) => comment._id),
        ];
        targetPost.commentSectionThunkInfo = {
          lastRequestError: null,
          meta: {
            lastRequestStatusCode: action.meta.statusCode!,
            lastRequestTimestamp: action.meta.requestTimestamp!,
          },
          state: "success",
        };
      }
    });
  },
});

const postReducer = postSlice.reducer;

export default postReducer;

export const {
  actions: { addManyPostToStore, togglePostLikeState, togglePostSaveState },
} = postSlice;
