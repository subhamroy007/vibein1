import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { selectPostById } from "./post.adapter";
import { selectAccountParams } from "../account/account.selectors";
import { selectClientAccountParams } from "../client/client.selector";
import { CommentSectionSelectorParams } from "../../types/selector.types";

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

    const postOutput = {
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

    const client = selectClientAccountParams(state);

    if (!client) {
      return undefined;
    }

    const output = {
      author: post.createdBy,
      isClientAuthorOfPost: client.username === post.createdBy,
      comments: post.comments,
      commentSectionThunkInfo: post.commentSectionThunkInfo,
    };

    return output;
  }
);

export const selectGridPostParams = createSelector(
  [(state: RootState) => state, (_: RootState, id: string) => id],
  (state, postId) => {
    const post = selectPostById(state.post, postId);

    if (!post) {
      return undefined;
    }

    const {
      photos,
      isPinned,
      engagementSummary: { noOfViews },
    } = post;

    const postOutput = {
      previewUrl: photos[0].previewUrl,
      isPinned,
      noOfViews,
      isAlbum: photos.length > 1,
    };

    return postOutput;
  }
);
