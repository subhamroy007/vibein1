import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { selectCommentById } from "./comment.adapter";
import { selectAccountParams } from "../account/account.selectors";
import { selectClientAccountParams } from "../client/client.selector";

export const selectCommentParams = createSelector(
  [(state: RootState) => state, (state: RootState, id: string) => id],
  (state, commentId) => {
    const comment = selectCommentById(state.comment, commentId);

    if (!comment) {
      return undefined;
    }

    const author = selectAccountParams(state, comment.createdBy, ["fullname"]);

    if (!author) {
      return undefined;
    }

    const client = selectClientAccountParams(state);

    if (!client) {
      return undefined;
    }
    const result = {
      ...comment,
      createdBy: author,
      isClientAuthorOfComment: author.id === client.id,
    };
    return result;
  }
);

export const selectReplSectionParams = createSelector(
  [(state: RootState) => state, (state: RootState, id: string) => id],
  (state, commentId) => {
    const comment = selectCommentById(state.comment, commentId);

    if (!comment) {
      return undefined;
    }

    const result = {
      replies: comment.replies,
      replySectionThunkInfo: comment.replySectionThunkInfo,
      noOfReplies: comment.noOfReplies,
    };

    return result;
  }
);
