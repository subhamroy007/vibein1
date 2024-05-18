import { createEntityAdapter } from "@reduxjs/toolkit";
import {
  MessageAdapterParams,
  ChatAdapterParams,
  MessagePlaceHolderParams,
} from "../../types/store.types";

const chatAdapter = createEntityAdapter<ChatAdapterParams>({
  selectId: (model) => model.id,
  sortComparer: (chat1, chat2) => chat1.id.localeCompare(chat2.id),
});

export const { selectById: selectChatById } = chatAdapter.getSelectors();
export const {
  addMany: addManyChats,
  addOne: addOneChat,
  removeOne: removeOneChat,
  removeMany: removeManyChats,
  removeAll: removeAllChats,
  updateOne: updateOneChat,
  updateMany: updateManyChats,
  upsertOne: upsertOneChat,
  upsertMany: upsertManyChats,
  getInitialState: getChatAdapterInitialState,
} = chatAdapter;

const messageAdapter = createEntityAdapter<MessageAdapterParams>({
  selectId: (model) => model.id,
  sortComparer: (memory1, memory2) => memory1.id.localeCompare(memory2.id),
});

export const { selectById: selectMessageById } = messageAdapter.getSelectors();
export const {
  addMany: addManyMessages,
  addOne: addOneMessage,
  removeOne: removeOneMessage,
  removeMany: removeManyMessages,
  removeAll: removeAllMessages,
  updateOne: updateOneMessage,
  updateMany: updateManyMessages,
  upsertOne: upsertOneMessage,
  upsertMany: upsertManyMessages,
  getInitialState: getMessageAdapterInitialState,
} = messageAdapter;

const messagePlaceHolderAdapter = createEntityAdapter<MessagePlaceHolderParams>(
  {
    selectId: (model) => model.id,
    sortComparer: (memory1, memory2) => memory1.id.localeCompare(memory2.id),
  }
);

export const { selectById: selectMessagePlaceHolderById } =
  messagePlaceHolderAdapter.getSelectors();
export const {
  addMany: addManyMessagePlaceHolders,
  addOne: addOneMessagePlaceHolder,
  removeOne: removeOneMessagePlaceHolder,
  removeMany: removeManyMessagePlaceHolders,
  removeAll: removeAllMessagePlaceHolders,
  updateOne: updateOneMessagePlaceHolder,
  updateMany: updateManyMessagePlaceHolders,
  upsertOne: upsertOneMessagePlaceHolder,
  upsertMany: upsertManyMessagePlaceHolders,
  getInitialState: getMessagePlaceHolderAdapterInitialState,
} = messagePlaceHolderAdapter;
