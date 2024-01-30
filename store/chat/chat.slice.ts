import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getChatInitialState, upsertManyChat } from "./chat.adapter";
import { getInboxChatsThunk } from "../client/client.thunk";
import { ChatAdapterParams, ChatStoreParams } from "../../types/store.types";
import { getChatMessagesThunk } from "./chat.thunk";
import { groupMessagesByDate } from "../../utility";

const getInitialState = (): ChatStoreParams => {
  return {
    ...getChatInitialState(),
    chatWindows: {},
  };
};

const chatSlice = createSlice({
  name: "chat",
  initialState: getInitialState(),
  reducers: {
    initChatWindow: (
      state,
      {
        payload: { chatId, routeId },
      }: PayloadAction<{ chatId: string; routeId: string }>
    ) => {
      state.chatWindows[routeId] = {
        chatId,
        routeId,
        state: "idle",
        lastUpdatedAt: Date.now(),
        data: { hasEndReached: false, sections: [] },
      };
    },
    removeChatWindow: (
      state,
      { payload: { routeId } }: PayloadAction<{ routeId: string }>
    ) => {
      state.chatWindows[routeId] = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getInboxChatsThunk.fulfilled,
      (state, { payload: { chats } }) => {
        const newChats = chats.map<ChatAdapterParams>((chat) => {
          return {
            id: chat.id,
            receipient: {
              username: chat.receipient.account.username,
              lastActiveAt: chat.receipient.lastActiveAt
                ? Date.parse(chat.receipient.lastActiveAt)
                : undefined,
            },
            recentMessages: chat.recentMessages.map((message) => message.id),
            noOfUnseenMessages: chat.noOfUnseenMessages,
            joinedAt: chat.joinedAt ? Date.parse(chat.joinedAt) : undefined,
          };
        });
        upsertManyChat(state, newChats);
      }
    );
    builder.addCase(
      getChatMessagesThunk.pending,
      (
        state,
        {
          meta: {
            arg: { routeId },
          },
        }
      ) => {
        const chatWindow = state.chatWindows[routeId];
        if (chatWindow) {
          chatWindow.state = "loading";
        }
      }
    );
    builder.addCase(
      getChatMessagesThunk.rejected,
      (
        state,
        {
          meta: {
            arg: { routeId },
          },
        }
      ) => {
        const chatWindow = state.chatWindows[routeId];
        if (chatWindow) {
          chatWindow.state = "failed";
        }
      }
    );
    builder.addCase(
      getChatMessagesThunk.fulfilled,
      (
        state,
        {
          meta: {
            arg: { routeId },
          },
          payload: { messages },
        }
      ) => {
        const chatWindow = state.chatWindows[routeId];
        if (chatWindow) {
          chatWindow.state = "success";
          const sections = groupMessagesByDate(messages);
          chatWindow.data.sections = [...chatWindow.data.sections, ...sections];
        }
      }
    );
  },
});

const chatReducer = chatSlice.reducer;

export default chatReducer;

export const {
  actions: { initChatWindow, removeChatWindow },
} = chatSlice;
