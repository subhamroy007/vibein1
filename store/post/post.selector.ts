import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { selectPostById } from "./post.adapter";
import { selectAccountParams } from "../account/account.selectors";
import { selectClientAccountParams } from "../client/client.selector";
import { CommentSectionSelectorParams } from "../../types/selector.types";
import { SimilarPostSectionStoreParams } from "../../types/store.types";

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

export const selectPostPreviewParams = createSelector(
  [(state: RootState) => state, (_: RootState, id: string) => id],
  (state, postId) => {
    const post = selectPostById(state.post, postId);

    if (!post) {
      return undefined;
    }

    const { photos, isLiked, createdBy } = post;

    const author = selectAccountParams(state, createdBy);

    if (!author) {
      return undefined;
    }

    const postOutput = {
      previewUrl: photos[0].previewUrl,
      originalUrl: photos[0].url,
      createdBy: author,
      isLiked,
    };

    return postOutput;
  }
);

export const selectSimilarPostSection = createSelector(
  [(state: RootState) => state, (state: RootState, id: string) => id],
  (state, postId) => {
    const post = selectPostById(state.post, postId);

    if (!post) {
      return undefined;
    }

    const output: SimilarPostSectionStoreParams = {
      similarPosts: post.similarPosts,
      similarPostSectionThunkInfo: post.similarPostSectionThunkInfo,
    };

    return output;
  }
);
