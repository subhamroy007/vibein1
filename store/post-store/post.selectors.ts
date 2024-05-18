import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { selectPostById } from "./post.adapter";
import {
  PhotoWithHash,
  PostGeneralParams,
  PostVideoParams,
  PhotoWithPreview,
  AudioWithUri,
  AudioWithTitle,
} from "../../types/utility.types";
import { selectAccountParams } from "../account-store/account.selectors";
import {
  CommentItemIdentifier,
  PostPhotoAdapterParams,
} from "../../types/store.types";
import {
  AccountSelectorParams,
  CommentPlaceholderSelectorParams,
  CommentSectionSelectorParams,
  CommentSelectorParams,
  LikeSectionSelectorParams,
} from "../../types/selector.types";
import { selectClientAccountParams } from "../client/client.selector";

export type PostSelectorParams = PostGeneralParams<
  {
    author: AccountSelectorParams;
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
  author: AccountSelectorParams;
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

export const selectLikeSection = createSelector(
  [(state: RootState) => state, (_: RootState, postId: string) => postId],
  (state, postId): LikeSectionSelectorParams | undefined | null => {
    const targetPost = state.post_store.posts.entities[postId];
    if (!targetPost) return undefined;
    const likeSection = targetPost.likeSection;
    if (!likeSection) return null;

    return {
      ...likeSection,
      engagementSummary: targetPost.engagementSummary,
    };
  }
);

export const selectCommentSection = createSelector(
  [
    (state: RootState) => state,
    (state: RootState, postId: string) => postId,
    (state: RootState, postId: string, unHiddenReplyComments: string[]) =>
      unHiddenReplyComments,
  ],
  (
    state,
    postId,
    unHiddenReplyComments
  ): CommentSectionSelectorParams | null => {
    const targetPost = state.post_store.posts.entities[postId];
    if (!targetPost || !targetPost.commentSection) return null;

    const items: CommentItemIdentifier[] = [];

    const pendingItems =
      targetPost.commentSection.pending.map<CommentItemIdentifier>((item) => ({
        isPlaceHolder: true,
        isFirstLoadedReply: false,
        isLastReplyItem: false,
        key: item.key,
      }));

    const uploadedItems =
      targetPost.commentSection.uploaded.map<CommentItemIdentifier>((item) => ({
        isPlaceHolder: false,
        isFirstLoadedReply: false,
        isLastReplyItem: false,
        key: item.key,
      }));

    items.push(...pendingItems, ...uploadedItems);

    targetPost.commentSection.fetched.items.forEach((fetchedItem) => {
      items.push({
        isPlaceHolder: false,
        isFirstLoadedReply: false,
        isLastReplyItem: false,
        key: fetchedItem.key,
      });
      const isReplyHidden = !unHiddenReplyComments.includes(fetchedItem.key);
      if (!isReplyHidden) {
        const targetComment =
          state.post_store.comments.entities[fetchedItem.key];
        if (!targetComment || !targetComment.replySection) return null;

        const noOfFetchedReplies =
          targetComment.replySection.fetched.items.length;
        const firstFetchedReplyId =
          targetComment.replySection.fetched.items[0].key;
        const fetchedReplies =
          targetComment.replySection.fetched.items.map<CommentItemIdentifier>(
            (item, index) => ({
              isPlaceHolder: false,
              isFirstLoadedReply: item.key === firstFetchedReplyId,
              isLastReplyItem: index === noOfFetchedReplies - 1,
              key: item.key,
            })
          );

        const noOfUploadedReplies = targetComment.replySection.uploaded.length;
        const uploadedReplies =
          targetComment.replySection.uploaded.map<CommentItemIdentifier>(
            (item, index) => ({
              isPlaceHolder: false,
              isFirstLoadedReply: false,
              isLastReplyItem:
                !noOfFetchedReplies && index === noOfUploadedReplies - 1,
              key: item.key,
            })
          );

        const noOfPendingReplies = targetComment.replySection.pending.length;
        const pendingReplies =
          targetComment.replySection.pending.map<CommentItemIdentifier>(
            (item, index) => ({
              isPlaceHolder: true,
              isFirstLoadedReply: false,
              isLastReplyItem:
                !noOfFetchedReplies &&
                !noOfUploadedReplies &&
                index === noOfPendingReplies - 1,
              key: item.key,
            })
          );

        items.push(...pendingReplies, ...uploadedReplies, ...fetchedReplies);
      }
    });

    return {
      items,
      hasEndReached: targetPost.commentSection.fetched.hasEndReached,
      createdAt: targetPost.commentSection.createdAt,
    };
  }
);

export const selectComment = createSelector(
  [(state: RootState) => state, (_: RootState, commentId: string) => commentId],
  (state, commentId): CommentSelectorParams | undefined => {
    const targetComment = state.post_store.comments.entities[commentId];

    if (!targetComment) return undefined;

    const targetPost = selectPost(state, targetComment.postId);

    if (!targetPost) return undefined;

    const targetCommentAuthor = selectAccountParams(
      state,
      targetComment.author,
      []
    );
    if (!targetCommentAuthor) return undefined;

    if (!targetComment.repliedTo) {
      return {
        author: targetCommentAuthor,
        createdAt: targetComment.createdAt,
        id: targetComment.id,
        isClientPostAuthor: targetPost.author.isClient,
        isLiked: targetComment.isLiked,
        hasLoadedReply: targetComment.replySection ? true : false,
        noOfHiddenReplies: targetComment.noOfReplies,
        noOfLikes: targetComment.noOfLikes,
        pinned: targetComment.pinned,
        postId: targetComment.postId,
        text: targetComment.text,
        repliedTo: undefined,
      };
    }
    const topLevelComment =
      state.post_store.comments.entities[targetComment.repliedTo];

    const commentSection =
      state.post_store.posts.entities[targetComment.postId]?.commentSection;

    if (!topLevelComment || !commentSection || !topLevelComment.replySection)
      return undefined;

    const noOfHiddenReplies =
      topLevelComment.noOfReplies -
      topLevelComment.replySection.fetched.items.length -
      topLevelComment.replySection.uploaded.length;

    return {
      author: targetCommentAuthor,
      createdAt: targetComment.createdAt,
      id: targetComment.id,
      isClientPostAuthor: targetPost.author.isClient,
      isLiked: targetComment.isLiked,
      hasLoadedReply: false,
      noOfHiddenReplies,
      noOfLikes: targetComment.noOfLikes,
      pinned: false,
      postId: targetComment.postId,
      text: targetComment.text,
      repliedTo: targetComment.repliedTo,
    };
  }
);

export const selectCommentPlaceholder = createSelector(
  [
    (state: RootState) => state,
    (state: RootState, placeholderId: string) => placeholderId,
  ],
  (state, placeholderId): CommentPlaceholderSelectorParams | undefined => {
    const targetPlaceHolder =
      state.post_store.comment_placeholders.entities[placeholderId];

    const client = selectClientAccountParams(state);

    if (!targetPlaceHolder || !client) return undefined;

    if (!targetPlaceHolder.repliedTo) {
      return {
        author: client,
        error: targetPlaceHolder.error,
        id: targetPlaceHolder.id,
        isUploading: targetPlaceHolder.isUploading,
        noOfHiddenReplies: 0,
        postId: targetPlaceHolder.postId,
        text: targetPlaceHolder.text,
        repliedTo: undefined,
      };
    }

    const topLevelComment =
      state.post_store.comments.entities[targetPlaceHolder.repliedTo];

    const commentSection =
      state.post_store.posts.entities[targetPlaceHolder.postId]?.commentSection;

    if (!topLevelComment || !topLevelComment.replySection || !commentSection)
      return undefined;

    return {
      author: client,
      error: targetPlaceHolder.error,
      id: targetPlaceHolder.id,
      isUploading: targetPlaceHolder.isUploading,
      noOfHiddenReplies: topLevelComment.noOfReplies,
      postId: targetPlaceHolder.postId,
      text: targetPlaceHolder.text,
      repliedTo: targetPlaceHolder.repliedTo,
    };
  }
);
