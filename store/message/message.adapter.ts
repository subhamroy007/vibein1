import { createEntityAdapter } from "@reduxjs/toolkit";
import { MessageAdapterParams } from "../../types/store.types";

const messageAdapter = createEntityAdapter<MessageAdapterParams>({
  selectId: (model) => model.id,
  sortComparer: (model1, model2) => model1.id.localeCompare(model2.id),
});

export const { selectById: selectMessageById } = messageAdapter.getSelectors();
export const {
  addMany: addManyMessages,
  addOne: addOneMessage,
  removeOne: removeOneMessage,
  removeMany: removeMayMessages,
  removeAll: removeAllMessages,
  updateOne: updateOneMessage,
  updateMany: updateManyMessage,
  upsertOne: upsertOneMessage,
  upsertMany: upsertManyMessage,
  getInitialState: getMessageInitialState,
} = messageAdapter;
