import {
  GroupChatResponseParams,
  GroupChatResponseReceipientParams,
  MessageResponseParams,
  OneToOneChatResponseParams,
} from "./../types/response.types";
import { nanoid } from "@reduxjs/toolkit";
import { AccountParams } from "../types/utility.types";
import { CLIENT_ACCOUNT } from "../constants";
import { DAY_GAP_MS, getDate, getRandom } from ".";
import { generateAccount, generateAccounts } from "./accounts";

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

const GROUP_NAMES = [
  "backbencher",
  "Dream-11 dscussions",
  "Latest MOview Download LINKS",
  "coding community",
  "Top study meterial",
  "robotics group",
  "Ipl fan page",
  "mumbai indians fanpage",
  "rcb fan page",
  "chennei super kings (CSK) fan page",
  "kkr fanpage",
];

const reaction_emojis = ["😀", "🤯", "😍", "🥶", "🥵", "😭"];

export function generateOneToOneChatMessage(
  receipient: AccountParams,
  type: 1 | 2 | 3 | 4,
  timeLimit: number
): MessageResponseParams {
  const bound = getRandom(12);
  const now = Date.now();
  let uploadedAt = 0;
  if (bound >= 0 && bound < 4) {
    uploadedAt = getRandom(now, now - DAY_GAP_MS);
  } else if (bound >= 4 && bound < 8) {
    uploadedAt = getRandom(now - DAY_GAP_MS, now - 2 * DAY_GAP_MS);
  } else {
    uploadedAt = getRandom(now - 2 * DAY_GAP_MS, timeLimit);
  }

  const isClientAuthor = (type === 1 || type === 2) && Math.random() > 0.5;
  return {
    id: nanoid(10),
    author: isClientAuthor ? CLIENT_ACCOUNT : receipient,
    reactions: [],
    seenBy: [],
    sentTo: isClientAuthor ? receipient.id : CLIENT_ACCOUNT.id,
    uploadedAt,
    text: MSG_TEXTS[getRandom(MSG_TEXTS.length - 1)],
  };
}

export function generateGroupChatMessage(
  receipients: AccountParams[],
  groupId: string,
  isMember: boolean,
  timeLimit: number
): MessageResponseParams {
  const bound = getRandom(12);
  const now = Date.now();
  let uploadedAt = 0;
  if (bound >= 0 && bound < 4) {
    uploadedAt = getRandom(now, now - DAY_GAP_MS);
  } else if (bound >= 4 && bound < 8) {
    uploadedAt = getRandom(now - DAY_GAP_MS, now - 2 * DAY_GAP_MS);
  } else {
    uploadedAt = getRandom(now - 2 * DAY_GAP_MS, timeLimit);
  }

  const isClientAuthor = isMember && Math.random() > 0.5;
  return {
    id: nanoid(10),
    author: isClientAuthor
      ? CLIENT_ACCOUNT
      : receipients[getRandom(receipients.length - 1)],
    reactions: [],
    seenBy: [],
    sentTo: groupId,
    uploadedAt,
    text: MSG_TEXTS[getRandom(MSG_TEXTS.length - 1)],
  };
}

export function generateGroupChatMessages(
  length: number,
  groupId: string,
  receipients: AccountParams[],
  isMember: boolean,
  timeLimit: number
): MessageResponseParams[] {
  const messages: MessageResponseParams[] = [];

  for (let i = 0; i < length; i++) {
    messages.push(
      generateGroupChatMessage(receipients, groupId, isMember, timeLimit)
    );
  }

  return messages;
}

export function generateOneToOneChatMessages(
  length: number,
  receipient: AccountParams,
  type: 1 | 2 | 3 | 4,
  timeLimit: number
): MessageResponseParams[] {
  const messages: MessageResponseParams[] = [];

  for (let i = 0; i < length; i++) {
    messages.push(generateOneToOneChatMessage(receipient, type, timeLimit));
  }

  return messages;
}

export function generateOneToOneChat(
  type: 1 | 2 | 3 | 4
): OneToOneChatResponseParams {
  const receipientAccount = generateAccount(["name"]);

  let joinedAt =
    type === 4 ? Date.now() : Date.UTC(2023, getRandom(11), getRandom(27, 1));

  return {
    id: receipientAccount.id,
    isMember: type === 1 || type === 2,
    isMuted: (type === 1 || type === 2) && Math.random() > 0.5,
    receipient: {
      account: receipientAccount,
      isMember: type === 1 || type === 3,
      lastSeenAt: type === 1 ? getDate() : undefined,
    },
    joinedAt,
    noOfUnseenMessages:
      type === 4 || type === 2 || Math.random() > 0.5 ? 0 : getRandom(1, 30),
    recentMessages:
      type === 4
        ? undefined
        : {
            endCursor: "",
            hasEndReached: true,
            items: generateOneToOneChatMessages(
              12,
              receipientAccount,
              type,
              joinedAt
            ),
          },
  };
}

export function generateGroupChat(isMember: boolean): GroupChatResponseParams {
  let joinedAt = Date.UTC(2023, getRandom(11), getRandom(27, 1));

  const receipients = generateAccounts(getRandom(10, 3), [
    "name",
  ]).map<GroupChatResponseReceipientParams>((account) => ({
    account,
    isAdmin: Math.random() > 0.5,
    isMember: true,
    joinedAt,
  }));
  const groupId = nanoid(10);

  return {
    id: groupId,
    isMember,
    isMuted: isMember && Math.random() > 0.5,
    name: GROUP_NAMES[getRandom(GROUP_NAMES.length - 1)],
    receipients: receipients,
    invitedBy: receipients.filter((item) => item.isAdmin)[0].account.userId,
    joinedAt: getDate(),
    noOfUnseenMessages: Math.random() > 0.5 ? 0 : getRandom(1, 30),
    recentMessages: {
      endCursor: "",
      hasEndReached: true,
      items: generateGroupChatMessages(
        12,
        groupId,
        receipients.map((item) => item.account),
        isMember,
        joinedAt
      ),
    },
  };
}
