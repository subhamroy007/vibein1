import { createEntityAdapter } from "@reduxjs/toolkit";
import { Comment1 } from "../../types/store.types";

const commentAdapter = createEntityAdapter<Comment1>({
  selectId: (model) => model.id,
  sortComparer: (comment1, comment2) => comment1.id.localeCompare(comment2.id),
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
