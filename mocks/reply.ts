import { nanoid } from "@reduxjs/toolkit";
import { generateAccountObject } from "./accounts";
import { ReplyResponseParams } from "../types/response.types";
import { getDate, getRandom } from ".";

const reply_contents = [
  "nice pic",
  "great",
  "nicely done",
  "wow",
  "this is so beatiful",
  "i like you",
  "check out my telegram channel",
];

export const generateReplyObject = (): ReplyResponseParams => {
  return {
    id: nanoid(),
    author: generateAccountObject(),
    isLiked: Math.random() < 0.5 ? false : true,
    noOfLikes: getRandom(10000),
    createdAt: getDate(),
    content: reply_contents[getRandom(reply_contents.length - 1)],
  };
};

export const generateReplyObjects = (size: number) => {
  const replies: ReplyResponseParams[] = [];
  for (let i = 0; i < size; i++) {
    replies.push(generateReplyObject());
  }
  return replies;
};
