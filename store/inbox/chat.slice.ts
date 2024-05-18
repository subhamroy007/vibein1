import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getInboxChatsThunk } from "../client/client.thunk";
import {
  ChatAdapterParams,
  ChatStoreParams,
  MessageAdapterParams,
} from "../../types/store.types";
import {
  MessageResponseParams,
  ChatResponseParams,
} from "../../types/response.types";
import {
  addOneChat,
  getChatAdapterInitialState,
  getMessageAdapterInitialState,
  removeManyMessages,
  removeOneMessage,
  upsertManyChat,
  upsertManyMessage,
} from "./chat.adapter";
import { getChatInfoThunk, getChatMessagesThunk } from "./chat.thunk";

const toMessageAdapterParams = (messages: MessageResponseParams[]) => {
  return messages.map<MessageAdapterParams>((message) => {
    return {
      ...message,
      author: message.author.userId,
      createdAt: message.createdAt,
      reactions: message.reactions.map((reaction) => ({
        author: reaction.author.userId,
        reactionEmoji: reaction.reactionEmoji,
      })),
      state: "success",
    };
  });
};

const toChatAdapterParams = (chats: ChatResponseParams[]) => {
  const newChats = chats.map<ChatAdapterParams>((chat) => {
    return {
      ...chat,
      joinedAt: chat.joinedAt,
      messages: chat.recentMessages
        ? {
            data: chat.recentMessages.data.map((message) => message.id),
            endCursor: chat.recentMessages.endCursor,
            hasEndReached: chat.recentMessages.hasEndReached,
            totalCount: chat.recentMessages.totalCount,
            state: "success",
          }
        : {
            data: [],
            endCursor: "",
            hasEndReached: true,
            state: "success",
            totalCount: 0,
          },
      receipient: {
        typing: false,
        lastActiveAt: chat.receipient.lastActiveAt,
        userId: chat.receipient.account.userId,
        isMember: chat.receipient.isMember,
        isMessageRequestRestricted: chat.receipient.isMessageRequestRestricted,
      },
      state: "success",
    };
  });
  const allRecentMessages = chats
    .map((chat) => {
      return chat.recentMessages ? chat.recentMessages.data : [];
    })
    .flat();

  return {
    chats: newChats,
    messages: toMessageAdapterParams(allRecentMessages),
  };
};

const initialState: ChatStoreParams = {
  chats: getChatAdapterInitialState(),
  messages: getMessageAdapterInitialState(),
};

const chatSlice = createSlice({
  name: "inbox",
  initialState,
  reducers: {
    initChat: (
      state,
      {
        payload: { chatId, receipient },
      }: PayloadAction<{ chatId: string; receipient: string }>
    ) => {
      const targetChat = state.chats.entities[chatId];

      if (!targetChat) {
        addOneChat(state.chats, {
          id: chatId,
          muted: false,
          noOfUnseenMessages: 0,
          receipient: {
            typing: false,
            userId: receipient,
            isMember: false,
            isMessageRequestRestricted: false,
          },
          state: "idle",
          messages: {
            data: [],
            endCursor: "",
            hasEndReached: true,
            state: "idle",
            totalCount: 0,
          },
        });
      }
    },
    resetChat: (
      state,
      { payload: { chatId } }: PayloadAction<{ chatId: string }>
    ) => {},
    removeMessage: (
      state,
      {
        payload: { messageId, chatId },
      }: PayloadAction<{ messageId: string; chatId: string }>
    ) => {
      const targetMessage = state.messages.entities[messageId];
      if (targetMessage) {
        removeOneMessage(state.messages, messageId);
        const targetChat = state.chats.entities[chatId];
        if (targetChat) {
          targetChat.messages.data = targetChat.messages.data.filter(
            (message) => message !== messageId
          );
        }
      }
    },
    removeChatMessages: (
      state,
      { payload: { chatId } }: PayloadAction<{ chatId: string }>
    ) => {
      const targetChat = state.chats.entities[chatId];
      if (targetChat) {
        const messageIds = targetChat.messages.data;
        targetChat.messages.data = [];
        targetChat.messages.endCursor = "";
        targetChat.messages.hasEndReached = true;
        targetChat.messages.totalCount = 0;
        removeManyMessages(state.messages, messageIds);
      }
    },
    setMessageReaction: (
      state,
      {
        payload: { messageId, reactionEmoji, clientUsername },
      }: PayloadAction<{
        messageId: string;
        reactionEmoji?: string;
        clientUsername: string;
      }>
    ) => {
      const targetMessage = state.messages.entities[messageId];
      if (targetMessage) {
        const targetReactionIndex = targetMessage.reactions.findIndex(
          (reaction) => reaction.author === clientUsername
        );
        if (targetReactionIndex === -1 && reactionEmoji) {
          targetMessage.reactions.push({
            author: clientUsername,
            reactionEmoji,
          });
        } else {
          if (reactionEmoji) {
            targetMessage.reactions[targetReactionIndex].reactionEmoji =
              reactionEmoji;
          } else {
            targetMessage.reactions = targetMessage.reactions.filter(
              (reaction) => reaction.author !== clientUsername
            );
          }
        }
      }
    },
    addChats: (state, { payload }: PayloadAction<ChatResponseParams[]>) => {
      const { chats, messages } = toChatAdapterParams(payload);
      upsertManyChat(state.chats, chats);
      upsertManyMessage(state.messages, messages);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getInboxChatsThunk.fulfilled,
      (state, { payload: { data } }) => {
        const { chats, messages } = toChatAdapterParams(data);
        upsertManyMessage(state.messages, messages);
        upsertManyChat(state.chats, chats);
      }
    );
    builder.addCase(
      getChatMessagesThunk.pending,
      (
        state,
        {
          meta: {
            arg: { chatId },
          },
        }
      ) => {
        const targetChat = state.chats.entities[chatId];
        if (targetChat) {
          targetChat.messages.state = "loading";
        }
      }
    );
    builder.addCase(
      getChatMessagesThunk.rejected,
      (
        state,
        {
          meta: {
            arg: { chatId },
          },
        }
      ) => {
        const targetChat = state.chats.entities[chatId];
        if (targetChat) {
          targetChat.messages.state = "failed";
        }
      }
    );
    builder.addCase(
      getChatMessagesThunk.fulfilled,
      (
        state,
        {
          meta: {
            arg: { chatId },
          },
          payload: { data, endCursor, hasEndReached, totalCount },
        }
      ) => {
        const targetChat = state.chats.entities[chatId];
        if (targetChat) {
          const newMessages = data.map((message) => message.id);
          targetChat.messages.state = "success";
          targetChat.messages.hasEndReached = hasEndReached;
          targetChat.messages.data = [
            ...targetChat.messages.data,
            ...newMessages,
          ];
        }
        upsertManyMessage(state.messages, toMessageAdapterParams(data));
      }
    );
    builder.addCase(getChatInfoThunk.fulfilled, (state, { payload }) => {
      const { chats, messages } = toChatAdapterParams([payload]);
      upsertManyMessage(state.messages, messages);
      upsertManyChat(state.chats, chats);
    });
    builder.addCase(
      getChatInfoThunk.pending,
      (
        state,
        {
          meta: {
            arg: { chatId },
          },
        }
      ) => {
        const targetChat = state.chats.entities[chatId];
        if (targetChat) {
          targetChat.state = "loading";
        }
      }
    );
    builder.addCase(
      getChatInfoThunk.rejected,
      (
        state,
        {
          meta: {
            arg: { chatId },
          },
        }
      ) => {
        const targetChat = state.chats.entities[chatId];
        if (targetChat) {
          targetChat.state = "failed";
        }
      }
    );
  },
});

const chatReducer = chatSlice.reducer;

export default chatReducer;

export const {
  actions: {
    initChat,
    resetChat,
    addChats,
    removeMessage,
    setMessageReaction,
    removeChatMessages,
  },
} = chatSlice;
