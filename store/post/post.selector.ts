import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { selectPostById } from "./post.adapter";
import { selectAccountParams } from "../account/account.selectors";
import { PostSelectorParams } from "../../types";

export const selectPostParams = createSelector(
  [(state: RootState) => state, (state: RootState, id: string) => id],
  (state, postId) => {
    const post = selectPostById(state.post, postId);

    if (!post) {
      return undefined;
    }

    const author = selectAccountParams(state, post.createdBy, [
      "is-favourite",
      "is-following",
    ]);

    if (!author) {
      return undefined;
    }

    const postOutput: PostSelectorParams = {
      ...post,
      createdBy: author,
    };

    return postOutput;
  }
);

export const selectPostCommentSection = createSelector(
  [(state: RootState) => state, (state: RootState, id: string) => id],
  (state, postId) => {
    const post = selectPostById(state.post, postId);

    if (!post) {
      return undefined;
    }

    return post.commentSection;
  }
);
