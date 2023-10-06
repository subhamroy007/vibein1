import { createEntityAdapter } from "@reduxjs/toolkit";
import { CommentAdapterParams } from "../../types/store.types";

const commentAdapter = createEntityAdapter<CommentAdapterParams>({
  selectId: (model) => model._id,
  sortComparer: (comment1, comment2) =>
    comment1._id.localeCompare(comment2._id),
});

export const { selectById: selectCommentById } = commentAdapter.getSelectors();
export const {
  addMany: addManyComments,
  addOne: addOneComment,
  removeOne: removeOneComment,
  removeMany: removeMayComments,
  removeAll: removeAllComments,
  updateOne: updateOneComment,
  updateMany: updateManyComment,
  upsertOne: upsertOneComment,
  upsertMany: upsertManyComment,
  getInitialState: getCommentInitialState,
} = commentAdapter;
