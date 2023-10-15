import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getCommentInitialState, upsertManyComment } from "./comment.adapter";
import { fetchComments } from "../post/post.thunk";
import { CommentResponseParams } from "../../types/response.types";
import { CommentAdapterParams } from "../../types/store.types";

/**
 * utlity function that takes a single argument of type CommentResponseParams
 * and converts it to a type of CommentAdapterParams
 * by changing all the other entities in the comment (e.g createdBy)
 * to its corresponding id references
 * @param comment
 * @returns
 */
function tranformToCommentAdapterParams(
  comment: CommentResponseParams
): CommentAdapterParams {
  return {
    ...comment,
    createdBy: comment.createdBy.username,
    replies: comment.replies ? comment.replies.map((reply) => reply._id) : [],
    replySectionThunkInfo: null,
  };
}

const commentSlice = createSlice({
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
  },
});

const commentReducer = commentSlice.reducer;

export default commentReducer;

export const {
  actions: { toggleCommentLikeState, toggleCommentPinkState },
} = commentSlice;
