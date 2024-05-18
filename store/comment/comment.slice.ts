import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getCommentInitialState, upsertManyComment } from "./comment.adapter";
import { fetchComments } from "../post/post.thunk";
import { Comment2 } from "../../types/response.types";
import { Comment1 } from "../../types/store.types";
import { fetchReplies } from "./comment.thunks";

/**
 * utlity function that takes a single argument of type Comment2
 * and converts it to a type of Comment1
 * by changing all the other entities in the comment (e.g createdBy)
 * to its corresponding id references
 * @param comment
 * @returns
 */
function tranformToCommentAdapterParams(comment: Comment2): Comment1 {
  return {
    ...comment,
    createdBy: comment.createdBy.userId,
    replies: comment.replies ? comment.replies.map((reply) => reply.id) : [],
    replySectionThunkInfo: {
      lastRequestError: null,
      meta: null,
      state: "idle",
    },
  };
}

export const commentSlice = createSlice({
  name: "comment",
  initialState: getCommentInitialState(),
  reducers: {
    /**
     * switch the value of isLiked field between true or false
     * @param state
     * @param action
     */
    toggleCommentLikeState: (state, action: PayloadAction<string>) => {
      const targetCommentId = action.payload; //fetch the target comment id
      const targetComment = state.entities[targetCommentId]; //fetch the target comment adapter object from the target comment id

      //check if the comment exists
      if (targetComment) {
        //increment or decrement the value of noOfLikes based on the flag value
        targetComment.noOfLikes = targetComment.isLiked
          ? targetComment.noOfLikes - 1
          : targetComment.noOfLikes + 1;
        targetComment.isLiked = !targetComment.isLiked; //toggle the flag state
      }
    },

    /**
     * switch the value of isPinned field between true or false
     * @param state
     * @param action
     */
    toggleCommentPinkState: (state, action: PayloadAction<string>) => {
      const targetCommentId = action.payload; //fetch the target comment id
      const targetComment = state.entities[targetCommentId]; //fetch the target comment adapter object from the target comment id

      //check if the comment exists
      if (targetComment) {
        targetComment.isPinned = !targetComment.isPinned; //toggle the flag state
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchComments.fulfilled,
      (state, { payload: { comments } }) => {
        upsertManyComment(
          state,
          comments.map((comment) => tranformToCommentAdapterParams(comment))
        );
      }
    );
    builder.addCase(fetchReplies.pending, (state, action) => {
      const targetCommentId = action.meta.arg; //fetch the target comment id;
      const targetComment = state.entities[targetCommentId]; //fetch the target comment from the store;
      if (targetComment) {
        targetComment.replySectionThunkInfo = {
          lastRequestError: null,
          meta: null,
          state: "loading",
        };
      }
    });

    builder.addCase(fetchReplies.rejected, (state, action) => {
      const targetCommentId = action.meta.arg; //fetch the target comment id;
      const targetComment = state.entities[targetCommentId]; //fetch the target comment from the store;
      if (targetComment) {
        targetComment.replySectionThunkInfo = {
          lastRequestError: action.payload!,
          meta: {
            lastRequestStatusCode: action.meta.statusCode!,
            lastRequestTimestamp: action.meta.requestTimestamp!,
          },
          state: "failed",
        };
      }
    });

    builder.addCase(fetchReplies.fulfilled, (state, action) => {
      const targetCommentId = action.meta.arg; //fetch the target comment id;
      const targetComment = state.entities[targetCommentId]; //fetch the target comment from the store;
      if (targetComment) {
        targetComment.replies = [
          ...action.payload.replies.map((reply) => reply.id),
        ];
        targetComment.replySectionThunkInfo = {
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

const commentReducer = commentSlice.reducer;

export default commentReducer;

export const {
  actions: { toggleCommentLikeState, toggleCommentPinkState },
} = commentSlice;
