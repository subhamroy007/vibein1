import { createEntityAdapter } from "@reduxjs/toolkit";

export type HashtagAdapterParams = {
  name: string;
  noOfPosts: number;
  posts: string[];
  previewUrl: string;
};

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
