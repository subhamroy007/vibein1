import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { selectCommentById } from "./comment.adapter";
import { selectAccountParams } from "../account/account.selectors";
import { selectClientAccountParams } from "../client/client.selector";
import {
  CommentSelectorParams,
  ReplySectionSelectorParams,
} from "../../types/selector.types";

export const selectCommentParams = createSelector(
  [(state: RootState) => state, (state: RootState, id: string) => id],
  (state, commentId): CommentSelectorParams | undefined => {
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
    const result: CommentSelectorParams = {
      ...comment,
      createdBy: author,
      isClientAuthorOfComment: author._id === client._id,
    };
    return result;
  }
);

export const selectReplSectionParams = createSelector(
  [(state: RootState) => state, (state: RootState, id: string) => id],
  (state, commentId): ReplySectionSelectorParams | undefined => {
    const comment = selectCommentById(state.comment, commentId);

    if (!comment) {
      return undefined;
    }

    const result: ReplySectionSelectorParams = {
      ...comment.replySection,
      noOfReplies: comment.noOfReplies,
    };

    return result;
  }
);
