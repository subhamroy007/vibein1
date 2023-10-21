import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { fetchComments } from "../post/post.thunk";
import { ReplyResponseParams } from "../../types/response.types";
import { ReplyAdapterParams } from "../../types/store.types";
import { getReplyInitialState, upsertManyReply } from "./reply.adapter";
import { fetchReplies } from "../comment/comment.thunks";

/**
 * utlity function that takes a single argument of type ReplyResponseParams
 * and converts it to a type of ReplyAdapterParams
 * by changing all the other entities in the comment (e.g createdBy)
 * to its corresponding id references
 * @param reply
 * @returns
 */
function tranformToReplyAdapterParams(
  reply: ReplyResponseParams
): ReplyAdapterParams {
  return {
    ...reply,
    createdBy: reply.createdBy.username,
  };
}

const replySlice = createSlice({
  name: "reply",
  initialState: getReplyInitialState(),
  reducers: {
    /**
     * switch the value of isLiked field between true or false
     * @param state
     * @param action
     */
    toggleReplyLikeState: (state, action: PayloadAction<string>) => {
      const targetReplyId = action.payload; //fetch the target reply id
      const targetReply = state.entities[targetReplyId]; //fetch the target reply adapter object from the target id

      //check if the replu exists
      if (targetReply) {
        //increment or decrement the value of noOfLikes based on the flag value
        targetReply.noOfLikes = targetReply.isLiked
          ? targetReply.noOfLikes - 1
          : targetReply.noOfLikes + 1;
        targetReply.isLiked = !targetReply.isLiked; //toggle the flag state
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchComments.fulfilled,
      (state, { payload: { comments } }) => {
        comments.forEach((comment) => {
          if (comment.replies) {
            upsertManyReply(
              state,
              comment.replies.map((comment) =>
                tranformToReplyAdapterParams(comment)
              )
            );
          }
        });
      }
    );
    builder.addCase(
      fetchReplies.fulfilled,
      (state, { payload: { replies } }) => {
        upsertManyReply(
          state,
          replies.map((reply) => tranformToReplyAdapterParams(reply))
        );
      }
    );
  },
});

const replyReducer = replySlice.reducer;

export default replyReducer;

export const {
  actions: { toggleReplyLikeState },
} = replySlice;
