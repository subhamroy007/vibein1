import { createEntityAdapter } from "@reduxjs/toolkit";
import {
  CommentAdapterParams,
  CommentPlaceholderParams,
  PostAdapterParams,
} from "../../types/store.types";

const postAdapter = createEntityAdapter<PostAdapterParams>({
  selectId: (model) => model.id,
  sortComparer: (post1, post2) => post1.id.localeCompare(post2.id),
});

export const { selectById: selectPostById } = postAdapter.getSelectors();
export const {
  addMany: addManyPosts,
  addOne: addOnePost,
  removeOne: removeOnePost,
  removeMany: removeManyPosts,
  removeAll: removeAllPosts,
  updateOne: updateOnePost,
  updateMany: updateManyPosts,
  upsertOne: upsertOnePost,
  upsertMany: upsertManyPosts,
  getInitialState: getPostAdapterInitialState,
} = postAdapter;

const commentAdapter = createEntityAdapter<CommentAdapterParams>({
  selectId: (model) => model.id,
  sortComparer: (post1, post2) => post1.id.localeCompare(post2.id),
});

export const { selectById: selectCommentById } = commentAdapter.getSelectors();
export const {
  addMany: addManyComments,
  addOne: addOneComment,
  removeOne: removeOneComment,
  removeMany: removeManyComments,
  removeAll: removeAllComments,
  updateOne: updateOneComment,
  updateMany: updateManyComments,
  upsertOne: upsertOneComment,
  upsertMany: upsertManyComments,
  getInitialState: getCommentAdapterInitialState,
} = commentAdapter;

const commentPlaceholderAdapter = createEntityAdapter<CommentPlaceholderParams>(
  {
    selectId: (model) => model.id,
    sortComparer: (post1, post2) => post1.id.localeCompare(post2.id),
  }
);

export const { selectById: selectCommentPlaceholderById } =
  commentPlaceholderAdapter.getSelectors();
export const {
  addOne: addOneCommentPlaceholder,
  removeOne: removeOneCommentPlaceholder,
  getInitialState: getCommentPlaceholderAdapterInitialState,
} = commentPlaceholderAdapter;
