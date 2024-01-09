import { createEntityAdapter } from "@reduxjs/toolkit";
import { ThunkState } from "../../types/store.types";

export type PostScreenAdapterParams = {
  id: string;
  posts: string[];
  state: ThunkState;
};

const postScreenAdapter = createEntityAdapter<PostScreenAdapterParams>({
  selectId: (model) => model.id,
  sortComparer: (moedl1, model2) => moedl1.id.localeCompare(model2.id),
});

export const { selectById: selectPostScreenById } =
  postScreenAdapter.getSelectors();
export const {
  addOne: addOnePostScreen,
  upsertOne: upsertOnePostScreen,
  removeOne: removeOnePostScreen,
  removeAll: removeAllPostScreen,
  getInitialState: getPostScreenInitialState,
} = postScreenAdapter;
