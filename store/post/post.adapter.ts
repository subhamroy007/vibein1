import { createEntityAdapter } from "@reduxjs/toolkit";
import { OutdatedParam23 } from "../../types/store.types";

const postAdapter = createEntityAdapter<OutdatedParam23>({
  selectId: (model) => model.id,
  sortComparer: (post1, post2) => post1.id.localeCompare(post2.id),
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
