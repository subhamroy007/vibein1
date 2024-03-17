import { nanoid } from "@reduxjs/toolkit";
import { getRandom } from ".";
import {
  AccountResponseParams,
  ChatResponseParams,
  MessageResponseParams,
} from "../types/response.types";
import { MessageMediaAttachmentParams } from "../types/store.types";
import {
  getPostMomentVideoThumbnailUrl,
  getPostMomentVideoUrl,
  getPostPhotoUrl,
} from "./data";
import { generateAccountObject } from "./accounts";

const MSG_TEXTS = [
  "jeet jayega",
  "bola tha nah 🤩",
  "About this one....eder kono trademarks registration pelm na",
  "🎉🎊🎉🎊🎉🎊🎉🎊🎉🎊",
  "Wild Foreplay 😈😈",
  "bhai kolay biyer video eta",
  "..eta dekhli?",
  "🤣🤣🤣🤣🤣",
  "Vai tor aisob video open Kori r amar recommendation kharap hoye jai",
  "Dekh bhai...cholbe😂",
  "Koi ni... zyada aisa nhi rahega",
  "Loner hu na, isliye",
  "Ree aise kaise",
  "i am happy enough",
  "Pehle tu apni khushi dhund😏",
  "Gal dichis kno vai, I was only kidding, u will be a very strict father",
  "https://www.instagram.com/reel/C2347zcSE8c/?igsh=empldmFpNXcza2Z1\n@Swarnendu and his son",
  "https://youtube.com/shorts/27LvXCiuC_U?si=Ib_Gw0IZk57za1L9",
  "Re bangad billa j",
  "Bard can generate images now, I made a cat riding a bicycle",
  "https://www.instagram.com/reel/C200kS-hHSr/?igsh=MXFheWYwZmVkNTZy",
  "https://www.instagram.com/reel/C00laGNrf75/?igsh=MW9qdHE5b2lrN255aQ==\nI am laughing forever 😂😂😂🤣",
];

const reaction_emojis = ["😀", "🤯", "😍", "🥶", "🥵", "😭"];

export const generateMessageMediaAttachments = (noOfFiles: number) => {
  const attachments: MessageMediaAttachmentParams[] = [];

  for (let i = 0; i < noOfFiles; i++) {
    const isPhoto = Math.random() < 0.7;
    const mediaIndex = getRandom(20, 1);
    if (isPhoto) {
      attachments.push({
        type: "photo",
        url: getPostPhotoUrl(mediaIndex),
        width: 1080,
        height: 1920,
      });
    } else {
      attachments.push({
        type: "video",
        url: getPostMomentVideoUrl(mediaIndex),
        duration: 40,
        width: 1080,
        height: 1920,
        poster: getPostMomentVideoThumbnailUrl(mediaIndex),
      });
    }
  }

  return attachments;
};

export const generateMessageObject = (
  receipients: AccountResponseParams[]
): MessageResponseParams => {
  const hasAttachment = Math.random() > 0.6;

  let author =
    receipients.length === 1
      ? receipients[0]
      : receipients[getRandom(receipients.length - 1)];

  const reactions: MessageResponseParams["reactions"] =
    Math.random() > 0.5
      ? receipients.length === 1
        ? [
            {
              author: receipients[0],
              reactionEmoji:
                reaction_emojis[getRandom(0, reaction_emojis.length - 1)],
            },
          ]
        : receipients
            .slice(0, getRandom(2, receipients.length))
            .map((item) => ({
              author: item,
              reactionEmoji:
                reaction_emojis[getRandom(0, reaction_emojis.length - 1)],
            }))
      : [];

  return {
    id: nanoid(),
    reactions,
    createdAt: new Date().toUTCString(),
    author,
    body: {
      text: !hasAttachment
        ? MSG_TEXTS[getRandom(MSG_TEXTS.length - 1)]
        : undefined,
      attachment: hasAttachment
        ? {
            type: "media",
            media: generateMessageMediaAttachments(
              Math.random() > 0.5 ? 1 : getRandom(10, 4)
            ),
          }
        : undefined,
    },
    seenByReceipient: Math.random() > 0.6,
  };
};

export const generateMessageObjects = (
  noOfMessages: number,
  receipients: AccountResponseParams[]
) => {
  const messages: MessageResponseParams[] = [];

  for (let i = 0; i < noOfMessages; i++) {
    messages.push(generateMessageObject(receipients));
  }
  return messages;
};

export const generateChatObject = (
  clientAccount: AccountResponseParams,
  recepientAccount: AccountResponseParams,
  type: "active" | "inactive" | "pending" | "requested",
  noOfMessages: number
): ChatResponseParams => {
  clientAccount = {
    ...clientAccount,
    fullname: clientAccount.username,
  } as AccountResponseParams;
  if (type === "inactive") {
    return {
      id: recepientAccount.id,
      muted: false,
      noOfUnseenMessages: 0,
      receipient: {
        account: recepientAccount,
        isMember: false,
        isMessageRequestRestricted: Math.random() > 0.6,
      },
    };
  }
  if (type === "active") {
    return {
      id: recepientAccount.id,
      muted: Math.random() > 0.6,
      noOfUnseenMessages:
        Math.random() > 0.5 && noOfMessages ? getRandom(1, noOfMessages) : 0,
      receipient: {
        account: recepientAccount,
        isMember: true,
        isMessageRequestRestricted: Math.random() > 0.6,
        lastActiveAt: new Date().toUTCString(),
      },
      joinedAt: new Date().toUTCString(),
      recentMessages: noOfMessages
        ? {
            data: generateMessageObjects(noOfMessages, [
              clientAccount,
              recepientAccount,
            ]),
            hasEndReached: Math.random() > 0.7,
            endCursor: "",
            totalCount: 10000,
          }
        : undefined,
    };
  }

  if (type === "requested") {
    return {
      id: recepientAccount.id,
      muted: false,
      noOfUnseenMessages:
        Math.random() > 0.5 && noOfMessages ? getRandom(1, noOfMessages) : 0,
      receipient: {
        account: recepientAccount,
        isMember: true,
        isMessageRequestRestricted: false,
      },
      recentMessages: noOfMessages
        ? {
            data: generateMessageObjects(noOfMessages, [
              clientAccount,
              recepientAccount,
            ]),
            hasEndReached: Math.random() > 0.7,
            endCursor: "",
            totalCount: 10000,
          }
        : undefined,
    };
  }

  return {
    id: recepientAccount.id,
    muted: Math.random() > 0.7,
    noOfUnseenMessages: 0,
    receipient: {
      account: recepientAccount,
      isMember: false,
      isMessageRequestRestricted: Math.random() > 0.6,
    },
    joinedAt: new Date().toUTCString(),
    recentMessages: noOfMessages
      ? {
          data: generateMessageObjects(noOfMessages, [
            clientAccount,
            recepientAccount,
          ]),
          hasEndReached: Math.random() > 0.7,
          endCursor: "",
          totalCount: 10000,
        }
      : undefined,
  };
};

export const generateChatObjects = (
  noOfChats: number,
  clientAccount: AccountResponseParams,
  type: "dm" | "mr"
) => {
  const chats: ChatResponseParams[] = [];

  for (let i = 0; i < noOfChats; i++) {
    const receipientAccount = generateAccountObject([
      "fullname",
      "is-available",
      "is-blocked",
    ]);

    if (type === "mr") {
      chats.push(
        generateChatObject(
          clientAccount,
          receipientAccount,
          "requested",
          getRandom(12, 1)
        )
      );
    } else {
      const status = Math.random() > 0.6 ? "pending" : "active";
      chats.push(
        generateChatObject(
          clientAccount,
          receipientAccount,
          status,
          status === "pending" ? 1 : Math.random() > 0.7 ? 0 : getRandom(12, 1)
        )
      );
    }
  }

  return chats;
};
