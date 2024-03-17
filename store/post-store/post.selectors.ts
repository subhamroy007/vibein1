import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { selectPostById } from "./post.adapter";
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
import { PostPhotoAdapterParams } from "../../types/store.types";

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
