import { MessageResponseParams } from "./../../types/response.types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  addOneMessagePlaceHolder,
  getChatAdapterInitialState,
  getMessageAdapterInitialState,
  getMessagePlaceHolderAdapterInitialState,
  upsertManyChats,
  upsertManyMessages,
} from "./chat.adater";
import { ChatResponseParams } from "../../types/response.types";
import {
  ChatAdapterParams,
  MessageAdapterParams,
  MessageItemIdentitfier,
} from "../../types/store.types";
import { fetchInboxChats } from "./chat.thunk";

function changeToChatAdapterParams(chats: ChatResponseParams[]): {
  chatItems: ChatAdapterParams[];
  messageItems: MessageAdapterParams[];
} {
  const messageItems: MessageAdapterParams[] = [];
  const chatItems = chats.map<ChatAdapterParams>((chat) => {
    if (chat.recentMessages) {
      messageItems.push(
        ...changeToMessageAdapterParams(chat.recentMessages.items)
      );
    }
    const messageItemIdetifiers = chat.recentMessages
      ? chat.recentMessages.items.map<MessageItemIdentitfier>((message) => ({
          isPlaceHolder: false,
          key: message.id,
        }))
      : [];
    if (chat.type === "one-to-one") {
      return {
        type: "one-to-one",
        id: chat.id,
        isMember: chat.isMember,
        isMuted: chat.isMuted,
        receipient: {
          account: chat.receipient.account.userId,
          isMember: chat.receipient.isMember,
          lastSeenAt: chat.receipient.lastSeenAt,
        },
        joinedAt: chat.joinedAt,
        messages: chat.recentMessages
          ? {
              endCursor: "",
              hasEndReached: chat.recentMessages.hasEndReached,
              items: messageItemIdetifiers,
            }
          : { endCursor: "", hasEndReached: true, items: [] },
        noOfUnseenMessages: chat.noOfUnseenMessages,
      };
    } else {
      return {
        type: "group",
        id: chat.id,
        isMember: chat.isMember,
        isMuted: chat.isMuted,
        name: chat.name,
        receipients: chat.receipients.map((receipient) => ({
          account: receipient.account.userId,
          isAdmin: receipient.isAdmin,
          isMember: receipient.isMember,
          joinedAt: receipient.joinedAt,
        })),
        posterUri: chat.posterUri,
        joinedAt: chat.joinedAt,
        invitedBy: chat.invitedBy,
        noOfUnseenMessages: chat.noOfUnseenMessages,
        messages: chat.recentMessages
          ? {
              endCursor: "",
              hasEndReached: chat.recentMessages.hasEndReached,
              items: messageItemIdetifiers,
            }
          : { endCursor: "", hasEndReached: true, items: [] },
      };
    }
  });

  return { chatItems, messageItems };
}

function changeToMessageAdapterParams(
  messages: MessageResponseParams[]
): MessageAdapterParams[] {
  const items = messages.map<MessageAdapterParams>((message) => {
    return {
      id: message.id,
      author: message.author.userId,
      reactions: message.reactions.map((reaction) => ({
        account: reaction.account.userId,
        emoji: reaction.emoji,
      })),
      seenBy: message.seenBy.map((seen) => seen.userId),
      sentTo: message.sentTo,
      uploadedAt: message.uploadedAt,
      text: message.text,
      attachment: message.attachment
        ? message.attachment.type === "post"
          ? { type: "post", post: message.attachment.post.id }
          : { type: "media", media: message.attachment.media }
        : undefined,
    };
  });

  return items;
}

const initialState = {
  chats: getChatAdapterInitialState(),
  messages: getMessageAdapterInitialState(),
  messagePlaceHolders: getMessagePlaceHolderAdapterInitialState(),
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMessageReaction(
      state,
      {
        payload: { emoji, messageId, userId },
      }: PayloadAction<{ messageId: string; emoji: string; userId: string }>
    ) {
      let isUpdated = false;
      const message = state.messages.entities[messageId];
      if (!message) return;
      message.reactions.map((reaction) => {
        if (reaction.account !== userId) {
          return reaction;
        } else {
          if (reaction.emoji !== emoji) {
            reaction.emoji = emoji;
          }
          isUpdated = true;
          return reaction;
        }
      });
      if (!isUpdated) {
        console.log("case 3");
        message.reactions.push({ account: userId, emoji });
      }
    },
    addMessageDraft(
      state,
      {
        payload: { sentTo, text, id },
      }: PayloadAction<{ text?: string; sentTo: string; id: string }>
    ) {
      addOneMessagePlaceHolder(state.messagePlaceHolders, {
        createdAt: Date.now(),
        error: null,
        id,
        isSending: false,
        sentTo,
        text,
      });
      const chat = state.chats.entities[sentTo];
      if (!chat) return;
      chat.messages.items = [
        { isPlaceHolder: true, key: id },
        ...chat.messages.items,
      ];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInboxChats.fulfilled, (state, { payload }) => {
      const { chatItems, messageItems } = changeToChatAdapterParams(
        payload.chats
      );
      upsertManyChats(state.chats, chatItems);
      upsertManyMessages(state.messages, messageItems);
    });
  },
});

const chatReducer = chatSlice.reducer;

export const {
  actions: { setMessageReaction, addMessageDraft },
} = chatSlice;

export default chatReducer;
