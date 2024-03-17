import { createEntityAdapter } from "@reduxjs/toolkit";
import { PostAdapterParams } from "../../types/store.types";

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
