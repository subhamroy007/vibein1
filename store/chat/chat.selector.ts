import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { selectChatById } from "./chat.adapter";
import { selectAccountParams } from "../account/account.selectors";
import { selectMessageById } from "../message/message.adapter";

export const selectChatParams = createSelector(
  [(state: RootState) => state, (state: RootState, chatId: string) => chatId],
  (state, chatId) => {
    const chatStoreParams = selectChatById(state.chat, chatId);

    if (!chatStoreParams) {
      return undefined;
    }

    const receipient = selectAccountParams(
      state,
      chatStoreParams.receipient.username,
      ["fullname"]
    );

    const lastMessage = chatStoreParams.recentMessages.length
      ? selectMessageById(state.message, chatStoreParams.recentMessages[0])
      : undefined;

    return {
      id: chatStoreParams.id,
      receipient: {
        account: receipient,
      },
      lastMessage,
      noOfUnseenMessages: chatStoreParams.noOfUnseenMessages,
    };
  }
);
