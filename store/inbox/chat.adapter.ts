import { createEntityAdapter } from "@reduxjs/toolkit";
import {
  MessageAdapterParams,
  ChatAdapterParams,
} from "../../types/store.types";

const messageAdapter = createEntityAdapter<MessageAdapterParams>({
  selectId: (model) => model.id,
  sortComparer: (model1, model2) =>
    model1.createdAt > model2.createdAt ? 1 : 0,
});

export const { selectById: selectMessageById } = messageAdapter.getSelectors();
export const {
  addMany: addManyMessages,
  addOne: addOneMessage,
  removeOne: removeOneMessage,
  removeMany: removeManyMessages,
  removeAll: removeAllMessages,
  updateOne: updateOneMessage,
  updateMany: updateManyMessage,
  upsertOne: upsertOneMessage,
  upsertMany: upsertManyMessage,
  getInitialState: getMessageAdapterInitialState,
} = messageAdapter;

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
  getInitialState: getChatAdapterInitialState,
} = chatAdapter;
