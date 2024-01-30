import { Draft, EntityState, createSlice } from "@reduxjs/toolkit";
import { getMessageInitialState, upsertManyMessage } from "./message.adapter";
import { getInboxChatsThunk } from "../client/client.thunk";
import { MessageAdapterParams } from "../../types/store.types";
import { getChatMessagesThunk } from "../chat/chat.thunk";
import { MessageResponseParams } from "../../types/response.types";

const convertToStoreParams = (
  state: Draft<EntityState<MessageAdapterParams>>,
  messages: MessageResponseParams[]
) => {
  const storeMessages = messages.map<MessageAdapterParams>((message) => ({
    id: message.id,
    likes: message.likes.map((account) => account.username),
    createdBy: message.createdBy.username,
    createdAt: Date.parse(message.createdAt),
    body: message.body,
  }));
  upsertManyMessage(state, storeMessages);
};

const messageSlice = createSlice({
  name: "message",
  initialState: getMessageInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getInboxChatsThunk.fulfilled,
      (state, { payload: { chats } }) => {
        const messages = chats
          .map((chat) => {
            const recentMessages =
              chat.recentMessages.map<MessageAdapterParams>((message) => ({
                id: message.id,
                likes: message.likes.map((account) => account.username),
                createdBy: message.createdBy.username,
                createdAt: Date.parse(message.createdAt),
                body: message.body,
              }));
            return recentMessages;
          })
          .flat();

        upsertManyMessage(state, messages);
      }
    );
    builder.addCase(
      getChatMessagesThunk.fulfilled,
      (state, { payload: { messages } }) => {
        convertToStoreParams(state, messages);
      }
    );
  },
});

const messageReducer = messageSlice.reducer;

export default messageReducer;

export const {
  actions: {},
} = messageSlice;
