import { selectAccountParams } from "./../account/account.selectors";
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { selectChatById, selectMessageById } from "./chat.adapter";
import { selectClientAccountParams } from "../client/client.selector";
import { getTop3MostRepeatedEmojis } from "../../utility";
import { InboxDirectChatInfoParams } from "../../types/selector.types";

export const selectMessageParams = createSelector(
  [(state: RootState) => state, (_: RootState, messageId: string) => messageId],
  (state, messageId) => {
    const targetMessage = selectMessageById(state.chat.messages, messageId);

    if (!targetMessage) return undefined;

    const clientAccount = selectClientAccountParams(state);

    if (!clientAccount) return undefined;

    const authorAccount = selectAccountParams(state, targetMessage.author, [
      "name",
    ]);

    if (!authorAccount) return undefined;

    return {
      ...targetMessage,
      author: {
        ...authorAccount,
        isClient: authorAccount.id === clientAccount.id,
      },
      reactionInfo: {
        noOfReactions: targetMessage.reactions.length,
        topReactionsString: getTop3MostRepeatedEmojis(targetMessage.reactions),
      },
    };
  }
);

export const selectMessageInfo = createSelector(
  [(state: RootState) => state, (_: RootState, messageId: string) => messageId],
  (state, messageId) => {
    const targetMessage = selectMessageById(state.chat.messages, messageId);

    if (!targetMessage) return undefined;

    const clientAccount = selectClientAccountParams(state);

    if (!clientAccount) return undefined;

    const authorAccount = selectAccountParams(state, targetMessage.author, [
      "name",
    ]);

    if (!authorAccount) return undefined;

    let shortText = targetMessage.body.text;
    if (targetMessage.body.attachment) {
      if (targetMessage.body.attachment.type === "media") {
        shortText = targetMessage.body.attachment.media.length + " files";
      }
    }

    return {
      id: targetMessage.id,
      createdAt: targetMessage.createdAt,
      seenByReceipient: targetMessage.seenByReceipient,
      author: {
        ...authorAccount,
        isClient: authorAccount.id === clientAccount.id,
      },
      text: shortText,
    };
  }
);

export const selectChatItem = createSelector(
  [(state: RootState) => state, (_: RootState, chatId: string) => chatId],
  (state, chatId) => {
    const targetChatAdapterParams = selectChatById(state.chat.chats, chatId);

    if (!targetChatAdapterParams) return undefined;

    const lastMessageId = targetChatAdapterParams.messages.data[0];

    const lastMessage = selectMessageInfo(state, lastMessageId);

    const receipientAccount = selectAccountParams(
      state,
      targetChatAdapterParams.receipient.userId,
      ["name"]
    );

    if (!receipientAccount) return undefined;

    return {
      id: targetChatAdapterParams.id,
      noOfUnseenMessages: targetChatAdapterParams.noOfUnseenMessages,
      muted: targetChatAdapterParams.muted,
      lastMessage,
      receipient: {
        typing: targetChatAdapterParams.receipient.typing,
        ...receipientAccount,
      },
      globalTimestamp: targetChatAdapterParams.joinedAt
        ? targetChatAdapterParams.joinedAt
        : lastMessage!.createdAt,
    };
  }
);

export const selectChat = createSelector(
  [(state: RootState) => state, (_: RootState, chatId: string) => chatId],
  (state, chatId) => {
    const targetChatAdapterParams = selectChatById(state.chat.chats, chatId);

    if (!targetChatAdapterParams) return undefined;

    const receipientAccount = selectAccountParams(
      state,
      targetChatAdapterParams.receipient.userId,
      ["name"]
    );

    if (!receipientAccount) return undefined;

    return {
      ...targetChatAdapterParams,
      receipient: {
        ...targetChatAdapterParams.receipient,
        ...receipientAccount,
      },
    };
  }
);
