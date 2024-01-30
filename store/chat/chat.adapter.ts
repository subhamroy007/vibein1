import { createEntityAdapter } from "@reduxjs/toolkit";
import { ChatAdapterParams } from "../../types/store.types";

const chatAdapter = createEntityAdapter<ChatAdapterParams>({
  selectId: (model) => model.id,
  sortComparer: (model1, model2) => model1.id.localeCompare(model2.id),
});

export const { selectById: selectChatById } = chatAdapter.getSelectors();
export const {
  addMany: addManyChats,
  addOne: addOneChat,
  removeOne: removeOneChat,
  removeMany: removeMayChats,
  removeAll: removeAllChats,
  updateOne: updateOneChat,
  updateMany: updateManyChat,
  upsertOne: upsertOneChat,
  upsertMany: upsertManyChat,
  getInitialState: getChatInitialState,
} = chatAdapter;
