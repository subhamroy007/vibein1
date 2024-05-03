import { nanoid } from "@reduxjs/toolkit";
import { getRandom } from ".";
import { AudioParams } from "../types/utility.types";
import { generateAccount } from "./accounts";
import { getAudioUri, getMomentVideoPosterUri } from "./data";

const audioDuration = [
  23000, 39000, 399000, 302000, 368000, 191000, 293000, 19000, 26000, 29000,
  280000, 13000, 39000, 307000, 28000, 351000, 310000, 263000, 29000, 33000,
  315000, 30000, 199000, 31000, 35000, 234000, 281000, 286000, 300000, 33000,
  36000,
];

export function generateAudio(): AudioParams {
  const index = getRandom(30);

  const duration = audioDuration[index];

  const startTime = getRandom(Math.max(duration - 30000, 0));
  const endTime = Math.min(startTime + 30000, duration);

  const isOriginal = Math.random() > 0.5;

  return {
    audioUri: getAudioUri(index + 1),
    bestSection: [startTime, endTime],
    duration,
    id: nanoid(),
    isOriginal,
    isSaved: Math.random() > 0.5,
    noOfMoments: getRandom(10000000),
    noOfPhotos: getRandom(10000000),
    author: isOriginal ? generateAccount() : undefined,
    posterUri: isOriginal ? undefined : getMomentVideoPosterUri(index + 1),
    artists: isOriginal ? undefined : "Arijit singh",
    title: isOriginal ? undefined : "khariyat pucho bonus track",
  };
}
