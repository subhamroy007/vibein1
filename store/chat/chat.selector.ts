import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { selectAccountParams } from "../account-store/account.selectors";
import { selectClientAccountParams } from "../client/client.selector";
import { formatDateTime, formatTime24Hour } from "../../utility";
import { selectMessageById } from "./chat.adater";
import { AccountSelectorParams } from "../../types/selector.types";
import { MessageResponseReactionParams } from "../../types/response.types";
import { getRandom } from "../../mocks";
import { generateAccount } from "../../mocks/accounts";

export type MessageShortInfo = {
  timestamp: string;
  text: string;
  seenInfo?: {
    isSeen: boolean;
    seenBy: string[];
  };
};

export type LastMessageItemSelectorParams =
  | ({
      isPlaceHolder: false;
    } & MessageShortInfo)
  | { isPlaceHolder: true; isSending: boolean; isError: boolean };

export type OneToOneChatListSelectorParams = {
  id: string;
  receipient: {
    name: string;
    profilePictureUri: string;
  };
  lastMessageItem: LastMessageItemSelectorParams;
  isMuted: boolean;
  noOfUnseenMessages: number;
};

export type GroupChatListSelectorParams = {
  id: string;
  name: string;
  posterUri?: string;
  isMuted: boolean;
  noOfUnseenMessages: number;
  recepientProfilePictureUris?: [string, string];
  lastMessageItem: LastMessageItemSelectorParams;
};

export type ChatListSelectorParams =
  | ({ type: "one-to-one" } & OneToOneChatListSelectorParams)
  | ({ type: "group" } & GroupChatListSelectorParams);

export const selectChatListParams = createSelector(
  [(state: RootState) => state, (state: RootState, chatId: string) => chatId],
  (state, chatId): ChatListSelectorParams | undefined => {
    const targetChat = state.chat.chats.entities[chatId];

    const clientAccount = selectClientAccountParams(state);

    if (!targetChat || !clientAccount) {
      console.log("log1");
      return undefined;
    }

    let lastMessageItem = {} as LastMessageItemSelectorParams;

    if (targetChat.messages.items.length) {
      const lastMessageIdentifier = targetChat.messages.items[0];
      if (lastMessageIdentifier.isPlaceHolder) {
        const targetPlaceHolder =
          state.chat.messagePlaceHolders.entities[lastMessageIdentifier.key];
        if (!targetPlaceHolder) return undefined;
        lastMessageItem = {
          isPlaceHolder: true,
          isError: targetPlaceHolder.error ? true : false,
          isSending: targetPlaceHolder.isSending,
        };
      } else {
        const targetMessage = selectMessageShortInfo(
          state,
          lastMessageIdentifier.key,
          targetChat.id
        );

        if (!targetMessage) {
          return undefined;
        }
        lastMessageItem = {
          isPlaceHolder: false,
          ...targetMessage,
        };
      }
    } else {
      lastMessageItem = {
        isPlaceHolder: false,
        text: targetChat.isMember
          ? "you joined this chat"
          : targetChat.type === "group"
          ? targetChat.invitedBy + " invited you"
          : "sent you a message request",
        timestamp: formatDateTime(targetChat.joinedAt, 1),
      };
    }

    if (targetChat.type === "one-to-one") {
      const receipientAccount = selectAccountParams(
        state,
        targetChat.receipient.account
      );

      if (!receipientAccount) {
        return undefined;
      }
      return {
        type: "one-to-one",
        id: targetChat.id,
        isMuted: targetChat.isMuted,
        receipient: {
          name: receipientAccount.name!,
          profilePictureUri: receipientAccount.profilePictureUri,
        },
        lastMessageItem,
        noOfUnseenMessages: targetChat.noOfUnseenMessages,
      };
    } else {
      const recepientProfilePictureUris: string[] = [];

      targetChat.receipients.forEach((receipient) => {
        const receipientAccount = selectAccountParams(
          state,
          receipient.account
        );
        if (receipientAccount && recepientProfilePictureUris.length < 2) {
          recepientProfilePictureUris.push(receipientAccount.profilePictureUri);
        }
      });

      if (recepientProfilePictureUris.length === 0) {
        recepientProfilePictureUris.push(
          clientAccount.profilePictureUri,
          clientAccount.profilePictureUri
        );
      } else if (recepientProfilePictureUris.length === 1) {
        recepientProfilePictureUris.push(clientAccount.profilePictureUri);
      }

      return {
        type: "group",
        id: targetChat.id,
        isMuted: targetChat.isMuted,
        name: targetChat.name,
        posterUri: targetChat.posterUri,
        recepientProfilePictureUris: recepientProfilePictureUris as [
          string,
          string
        ],
        lastMessageItem,
        noOfUnseenMessages: targetChat.noOfUnseenMessages,
      };
    }
  }
);

export const selectMessageShortInfo = createSelector(
  [
    (state: RootState) => state,
    (state: RootState, messageId: string) => messageId,
    (state: RootState, messageId: string, chatId: string) => chatId,
  ],
  (state, messageId, chatId): MessageShortInfo | undefined => {
    const targetMessage = state.chat.messages.entities[messageId];

    if (!targetMessage) {
      return undefined;
    }

    const targetChat = state.chat.chats.entities[chatId];

    if (!targetChat) {
      return undefined;
    }

    const targetMessageAuthor = selectAccountParams(
      state,
      targetMessage.author
    );

    if (!targetMessageAuthor) {
      return undefined;
    }

    let msgText = "";
    if (targetMessageAuthor.isClient) {
      if (targetMessage.attachment) {
        if (targetMessage.attachment.type === "media") {
          msgText =
            "you sent " + targetMessage.attachment.media.length + " files";
        } else {
          msgText = "you sent a post";
        }
      } else if (targetMessage.text) {
        msgText = "you: " + targetMessage.text;
      }
    } else {
      if (targetMessage.attachment) {
        if (targetMessage.attachment.type === "media") {
          msgText =
            targetMessageAuthor.name +
            " sent " +
            targetMessage.attachment.media.length +
            " files";
        } else {
          msgText = targetMessageAuthor.name + " sent a post";
        }
      } else if (targetMessage.text) {
        msgText =
          (targetChat.type === "group" ? targetMessageAuthor.name + ": " : "") +
          targetMessage.text;
      }
    }
    let seenInfo: MessageShortInfo["seenInfo"];

    if (targetMessageAuthor.isClient) {
      if (targetChat.type === "one-to-one") {
        seenInfo = {
          isSeen:
            targetMessage.seenBy.length > 0 && targetChat.receipient.isMember,
          seenBy: [],
        };
      } else {
        const eligableMembers = targetChat.receipients.filter(
          (item) => item.joinedAt < targetMessage.uploadedAt
        );
        const seenBy: string[] = [];
        const allSeens = eligableMembers.filter((item) => {
          if (item.isMember) {
            const targetAccount = selectAccountParams(state, item.account);
            if (targetAccount) {
              seenBy.push(targetAccount.profilePictureUri);
            }
          }
          return targetMessage.seenBy.includes(item.account);
        });
        const isSeen =
          eligableMembers.length === allSeens.length &&
          seenBy.length === allSeens.length;
        seenInfo = {
          isSeen,
          seenBy: isSeen ? [] : seenBy,
        };
      }
    }

    return {
      text: msgText,
      timestamp: formatDateTime(targetMessage.uploadedAt, 1),
      seenInfo,
    };
  }
);

export const selectChatDetails = createSelector(
  [(state: RootState) => state, (state: RootState, chatId: string) => chatId],
  (state, chatId) => {
    return state.chat.chats.entities[chatId];
  }
);

type MessageSelectorParams = {
  id: string;
  author: AccountSelectorParams;
  uploadedAt: string;
  text?: string;
  reactions: MessageResponseReactionParams[];
};

export const selectMessage = createSelector(
  [
    (state: RootState) => state,
    (state: RootState, messageId: string) => messageId,
  ],
  (state, messageId): MessageSelectorParams | undefined => {
    const targetMessage = selectMessageById(state.chat.messages, messageId);

    if (!targetMessage) return undefined;

    const author = selectAccountParams(state, targetMessage.author);

    if (!author) return undefined;

    const reactions: MessageResponseReactionParams[] = [];

    const emojis = ["😍", "😀", "🤩", "🥳", "😂", "😎"];

    if (Math.random() > 0.5) {
      for (let i = 0; i < getRandom(10, 1); i++) {
        reactions.push({
          account: generateAccount(["name"]),
          emoji: emojis[getRandom(emojis.length - 1)],
        });
      }
    }

    return {
      id: targetMessage.id,
      author,
      uploadedAt: formatTime24Hour(targetMessage.uploadedAt),
      text: targetMessage.text,
      reactions,
    };
  }
);
