import { createEntityAdapter } from "@reduxjs/toolkit";
import { ThunkState } from "../../types/store.types";

export type LocationScreenAdapterParams = {
  screenId: string;
  state: ThunkState;
  data: {
    id: string;
    name: string;
    fullAddress: string;
    noOfPosts: number;
    previewPhotoUrl: string;
    posts: string[];
  } | null;
};

const locationScreenAdapter = createEntityAdapter<LocationScreenAdapterParams>({
  selectId: (model) => model.screenId,
  sortComparer: (moedl1, model2) =>
    moedl1.screenId.localeCompare(model2.screenId),
});

export const { selectById: selectLocationScreenById } =
  locationScreenAdapter.getSelectors();
export const {
  addOne: addOneLocationScreen,
  upsertOne: upsertOneLocationScreen,
  removeOne: removeOneLocationScreen,
  removeAll: removeAllLocationScreen,
  getInitialState: getLocationScreenInitialState,
} = locationScreenAdapter;
