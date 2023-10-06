import { createEntityAdapter } from "@reduxjs/toolkit";
import { PostAdapterParams } from "../../types/store.types";

const postAdapter = createEntityAdapter<PostAdapterParams>({
  selectId: (model) => model._id,
  sortComparer: (post1, post2) => post1._id.localeCompare(post2._id),
});

export const { selectById: selectPostById } = postAdapter.getSelectors();
export const {
  addMany: addManyPosts,
  addOne: addOnePost,
  removeOne: removeOnePost,
  removeMany: removeMayPosts,
  removeAll: removeAllPosts,
  updateOne: updateOnePost,
  updateMany: updateManyPost,
  upsertOne: upsertOnePost,
  upsertMany: upsertManyPost,
  getInitialState: getPostInitialState,
} = postAdapter;
