import { createEntityAdapter } from "@reduxjs/toolkit";
import { AudioParams } from "../../types/utility.types";

const audioAdapter = createEntityAdapter<AudioParams>({
  selectId: (model) => model.id,
  sortComparer: (memory1, memory2) => memory1.id.localeCompare(memory2.id),
});

export const { selectById: selectAudioById } = audioAdapter.getSelectors();
export const {
  addMany: addManyAudios,
  addOne: addOneAudio,
  removeOne: removeOneAudio,
  removeMany: removeManyAudios,
  removeAll: removeAllAudios,
  updateOne: updateOneAudio,
  updateMany: updateManyAudios,
  upsertOne: upsertOneAudio,
  upsertMany: upsertManyAudios,
  getInitialState: getAudioAdapterInitialState,
} = audioAdapter;
