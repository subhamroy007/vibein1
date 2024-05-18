import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { selectAccountParams } from "../account-store/account.selectors";
import { selectClientAccountParams } from "../client/client.selector";
import { formatDateTime, formatTime24Hour } from "../../utility";
import { selectChatById, selectMessageById } from "./chat.adater";
import { AccountSelectorParams } from "../../types/selector.types";
import { MessageResponseReactionParams } from "../../types/response.types";
import { getRandom } from "../../mocks";
import { generateAccount } from "../../mocks/accounts";
import { MessageItemIdentitfier, PageData } from "../../types/store.types";

export type MessageShortInfo = {
  timestamp: string;
  text: string;
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

    return {
      text: msgText,
      timestamp: formatDateTime(targetMessage.uploadedAt, 1),
    };
  }
);

export type OneToOneChatSelectorReceipientParams = {
  account: AccountSelectorParams;
  lastSeenAt?: number;
  isMember: boolean;
};

export type OneToOneChatSelectorParams = {
  id: string;
  joinedAt: number;
  isMember: boolean;
  isMuted: boolean;
  receipient: OneToOneChatSelectorReceipientParams;
  messages: PageData<MessageItemIdentitfier>;
  noOfUnseenMessages: number;
};

export const selectChatDetails = createSelector(
  [(state: RootState) => state, (state: RootState, chatId: string) => chatId],
  (state, chatId): OneToOneChatSelectorParams | undefined => {
    const chat = selectChatById(state.chat.chats, chatId);
    if (!chat || chat.type === "group") return undefined;

    return {
      id: chat.id,
      isMember: chat.isMember,
      isMuted: chat.isMuted,
      joinedAt: chat.joinedAt,
      messages: chat.messages,
      noOfUnseenMessages: chat.noOfUnseenMessages,
      receipient: {
        account: selectAccountParams(state, chat.receipient.account, [
          "name",
          "is-blocked",
          "is-available",
        ])!,
        isMember: chat.receipient.isMember,
        lastSeenAt: chat.receipient.lastSeenAt,
      },
    };
  }
);

type MessageSelectorParams = {
  id: string;
  author: AccountSelectorParams;
  uploadedAt: string;
  text?: string;
  reactions: { emoji: string; account: AccountSelectorParams }[];
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

    // const reactions: MessageResponseReactionParams[] = [];

    // const emojis = ["😍", "😀", "🤩", "🥳", "😂", "😎"];

    // if (Math.random() > 0.5) {
    //   for (let i = 0; i < getRandom(10, 1); i++) {
    //     reactions.push({
    //       account: generateAccount(["name"]),
    //       emoji: emojis[getRandom(emojis.length - 1)],
    //     });
    //   }
    // }

    return {
      id: targetMessage.id,
      author,
      uploadedAt: formatTime24Hour(targetMessage.uploadedAt),
      text: targetMessage.text,
      reactions: targetMessage.reactions.map((item) => ({
        emoji: item.emoji,
        account: selectAccountParams(state, item.account)!,
      })),
    };
  }
);
