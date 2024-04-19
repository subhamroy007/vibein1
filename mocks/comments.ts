import { generateReplyObject, generateReplyObjects } from "./reply";
import { Comment2 } from "../types/response.types";
import { getDate, getRandom } from ".";

const comment_contents = [
  "nice pic",
  "great",
  "nicely done",
  "wow",
  "this is so beatiful",
  "i like you",
  "check out my telegram channel",
];

export const generateCommentObject = (): Comment2 => {
  const noOfReplies = Math.random() > 0.5 ? getRandom(100, 10) : 0;

  return {
    ...generateReplyObject(),
    noOfReplies,
    createdAt: getDate(),
    content: comment_contents[getRandom(comment_contents.length - 1)],
    isPinned: Math.random() < 0.5 ? false : true,
    replies:
      noOfReplies > 0 && Math.random() > 0.5
        ? generateReplyObjects(Math.min(noOfReplies, 3))
        : undefined,
  };
};

export const generateCommentObjects = (size: number) => {
  const comments: Comment2[] = [];
  for (let i = 0; i < size; i++) {
    comments.push(generateCommentObject());
  }
  return comments;
};
