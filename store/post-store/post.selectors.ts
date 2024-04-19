import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import {
  selectCommentById,
  selectCommentPlaceholderById,
  selectPostById,
} from "./post.adapter";
import {
  AccountParams,
  PhotoWithHash,
  PostGeneralParams,
  PostVideoParams,
  PhotoWithPreview,
  AudioWithUri,
  AudioWithTitle,
} from "../../types/utility.types";
import { selectAccountParams } from "../account-store/account.selectors";
import {
  CommentListItemIdentifier,
  PostPhotoAdapterParams,
} from "../../types/store.types";
import {
  CommentPlaceholderSelectorParams,
  CommentSectionSelectorParams,
  CommentSelectorParams,
  LikeSectionSelectorParams,
} from "../../types/selector.types";
import { selectClientAccountParams } from "../client/client.selector";

export type PostSelectorParams = PostGeneralParams<
  {
    author: AccountParams;
  } & (
    | {
        type: "photo-post";
        photos: PostPhotoAdapterParams[];
        usedAudio?: AudioWithUri | null;
      }
    | {
        type: "moment-post";
        video: PostVideoParams;
        taggedAccounts?: string[];
        usedAudio?: AudioWithTitle | null;
      }
  )
>;

export type PostPreviewSelectorParams = {
  id: string;
  author: AccountParams;
  isPinned: boolean;
  noOfViews: number;
} & (
  | { type: "photo-post"; firstPhoto: PhotoWithPreview; isAlbum: boolean }
  | { type: "moment-post"; video: { uri: string; poster: PhotoWithHash } }
);

export const selectPostPreview = createSelector(
  [(state: RootState) => state, (state: RootState, id: string) => id],
  (state, id): PostPreviewSelectorParams | undefined => {
    const post = selectPostById(state.post_store.posts, id);

    if (!post) return undefined;

    const author = selectAccountParams(state, post.author);

    if (!author) return undefined;

    if (post.type === "photo-post") {
      return {
        type: "photo-post",
        author,
        firstPhoto: post.photos[0],
        isAlbum: post.photos.length > 1,
        id: post.id,
        isPinned: post.metadata.isPinned,
        noOfViews: post.engagementSummary.noOfViews,
      };
    } else {
      return {
        type: "moment-post",
        author,
        id: post.id,
        isPinned: post.metadata.isPinned,
        noOfViews: post.engagementSummary.noOfViews,
        video: post.video,
      };
    }
  }
);

export const selectPost = createSelector(
  [(state: RootState) => state, (state: RootState, id: string) => id],
  (state, id): PostSelectorParams | undefined => {
    const post = selectPostById(state.post_store.posts, id);

    if (!post) return undefined;

    const author = selectAccountParams(state, post.author);

    if (!author) return undefined;

    return {
      ...post,
      author,
    };
  }
);

export const selectCommentParams = createSelector(
  [(state: RootState) => state, (state: RootState, id: string) => id],
  (state, id): CommentSelectorParams | undefined => {
    const comment = selectCommentById(state.post_store.comments, id);

    if (!comment) return undefined;

    const author = selectAccountParams(state, comment.author);

    if (!author) return undefined;

    let hasLoadedReply = false;
    let isReplyHidden = true;
    let isReplyLoading = false;
    let noOfUnloadedReplies = 0;

    if (comment.repliedTo) {
      const topLevelComment = selectCommentById(
        state.post_store.comments,
        comment.repliedTo
      );
      if (topLevelComment && topLevelComment.replySection) {
        isReplyHidden = topLevelComment.isReplyHidden;
        const replySection = topLevelComment.replySection;
        hasLoadedReply =
          replySection.uploaded.length > 0 ||
          (replySection.fetched.data !== null &&
            replySection.fetched.data.items.length > 0);

        isReplyLoading = replySection.fetched.isLoading;
        noOfUnloadedReplies =
          topLevelComment.noOfReplies -
          replySection.uploaded.length -
          (replySection.fetched.data
            ? replySection.fetched.data.items.length
            : 0);
      }
    } else {
      isReplyHidden = comment.isReplyHidden;
      noOfUnloadedReplies = comment.noOfReplies;
      const replySection = comment.replySection;
      if (replySection) {
        hasLoadedReply =
          replySection.uploaded.length > 0 ||
          (replySection.fetched.data !== null &&
            replySection.fetched.data.items.length > 0);

        isReplyLoading = replySection.fetched.isLoading;
        noOfUnloadedReplies =
          comment.noOfReplies -
          replySection.uploaded.length -
          (replySection.fetched.data
            ? replySection.fetched.data.items.length
            : 0);
      }
    }

    return {
      ...comment,
      author,
      isAuthor: Math.random() > 0.6,
      isPostAuthor: Math.random() > 0.6,
      isReplyHidden,
      isReplyLoading,
      noOfUnloadedReplies,
      hasLoadedReply,
    };
  }
);

export const selectCommentPlaceholder = createSelector(
  [(state: RootState) => state, (state: RootState, id: string) => id],
  (state, id): CommentPlaceholderSelectorParams | undefined => {
    const placeholder = selectCommentPlaceholderById(
      state.post_store.comment_placeholders,
      id
    );

    if (!placeholder) return undefined;

    const client = selectClientAccountParams(state);

    if (!client) return undefined;

    let noOfUnloadedReplies = 0;
    let isReplyLoading = false;
    if (placeholder.repliedTo) {
      const topLevelComment = selectCommentById(
        state.post_store.comments,
        placeholder.repliedTo
      );
      if (topLevelComment && topLevelComment.replySection) {
        const replySection = topLevelComment.replySection;
        isReplyLoading = replySection.fetched.isLoading;
        noOfUnloadedReplies =
          topLevelComment.noOfReplies -
          replySection.uploaded.length -
          (replySection.fetched.data
            ? replySection.fetched.data.items.length
            : 0);
      }
    }

    return {
      ...placeholder,
      author: client,
      noOfUnloadedReplies,
      isReplyLoading,
    };
  }
);

export const selectCommentSection = createSelector(
  [(state: RootState) => state, (state: RootState, postId: string) => postId],
  (state, postId): CommentSectionSelectorParams | undefined => {
    const commentSection =
      state.post_store.posts.entities[postId]?.commentSection;
    if (!commentSection) return undefined;

    const items: CommentListItemIdentifier[] = [];

    commentSection.pending.forEach((item) => {
      items.push({ type: "placeholder", key: item.key, isLastReply: false });
    });
    commentSection.uploaded.forEach((item) => {
      items.push({ type: "comment", key: item.key, isLastReply: false });
    });
    commentSection.fetched.data?.items.forEach((item) => {
      items.push({ type: "comment", key: item.key, isLastReply: false });
      const targetComment = selectCommentById(
        state.post_store.comments,
        item.key
      );
      if (
        targetComment &&
        !targetComment.isReplyHidden &&
        targetComment.replySection
      ) {
        const replySection = targetComment.replySection;
        replySection.pending.forEach((replyItem, index) => {
          const isLastReply =
            index === replySection.pending.length - 1 &&
            replySection.uploaded.length === 0 &&
            (replySection.fetched.data === null ||
              replySection.fetched.data.items.length === 0);
          items.push({ type: "placeholder", key: replyItem.key, isLastReply });
        });
        replySection.uploaded.forEach((replyItem, index) => {
          const isLastReply =
            index === replySection.uploaded.length - 1 &&
            (replySection.fetched.data === null ||
              replySection.fetched.data.items.length === 0);
          items.push({ type: "comment", key: replyItem.key, isLastReply });
        });
        replySection.fetched.data?.items.forEach((replyItem, index) => {
          const isLastReply = replySection.fetched.data
            ? replySection.fetched.data.items.length - 1 === index
            : false;
          items.push({ type: "comment", key: replyItem.key, isLastReply });
        });
      }
    });

    return {
      isError: commentSection.fetched.error || false,
      isLoading: commentSection.fetched.isLoading,
      comments: items,
    };
  }
);

export const selectLikeSection = createSelector(
  [
    (state: RootState) => state,
    (state: RootState, postId: string) => postId,
    (state: RootState, postId: string, searchPhase: string | null) =>
      searchPhase,
  ],
  (state, postId, searchPhase): LikeSectionSelectorParams | undefined => {
    const targetPost = state.post_store.posts.entities[postId];
    if (!targetPost) return undefined;
    const likeSection = targetPost.likeSection;
    if (!likeSection) return undefined;

    const searchedAccounts = searchPhase
      ? likeSection.searchedLikes.data[searchPhase]
      : undefined;

    const isLoading = searchPhase
      ? likeSection.searchedLikes.isLoading
      : likeSection.allLikes.isLoading;
    const isError = searchPhase
      ? likeSection.searchedLikes.error || false
      : likeSection.allLikes.error || false;

    return {
      isLoading,
      isError,
      data: likeSection.allLikes.data
        ? {
            allLikes: likeSection.allLikes.data,
            engagementSummary: {
              noOfLikes: targetPost.engagementSummary.noOfLikes,
              noOfViews: targetPost.engagementSummary.noOfViews,
            },
            filteredAccounts: searchedAccounts,
          }
        : null,
    };
  }
);
