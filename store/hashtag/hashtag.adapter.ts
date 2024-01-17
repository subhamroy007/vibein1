import { createEntityAdapter } from "@reduxjs/toolkit";
import { HashtagAdapterParams } from "../../types/store.types";

const hashtagAdapter = createEntityAdapter<HashtagAdapterParams>({
  selectId: (model) => model.name,
  sortComparer: (tag1, tag2) => tag1.name.localeCompare(tag2.name),
});

export const { selectById: selectHashtagByName } =
  hashtagAdapter.getSelectors();
export const {
  addMany: addManyHashtags,
  addOne: addOneHashtag,
  removeOne: removeOneHashtag,
  removeMany: removeMayHashtags,
  removeAll: removeAllHashtags,
  updateOne: updateOneHashtag,
  updateMany: updateManyHashtag,
  upsertOne: upsertOneHashtag,
  upsertMany: upsertManyHashtag,
  getInitialState: getHashtagInitialState,
} = hashtagAdapter;
