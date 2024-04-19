import { MOMENT_POSTER_BLURHASH, POST_PHOTO_BLURHASH } from "./blurHash";
import { nanoid } from "@reduxjs/toolkit";
import {
  MemoryContentParams,
  MemoryResponseParams,
} from "../types/response.types";
import { getDate, getRandom2 } from ".";
import {
  getMomentVideoPosterUri,
  getPostMomentVideoUrl,
  getPostPhotoPreviewUrl,
  getPostPhotoUrl,
} from "./data";

export const generateMemory = (
  mediaRank: number,
  type: "photo" | "video"
): MemoryResponseParams => {
  const content = {
    type,
  } as MemoryContentParams;

  if (content.type === "photo") {
    content.blurhash = POST_PHOTO_BLURHASH[mediaRank - 1];
    content.uri = getPostPhotoUrl(mediaRank);
    content.previewUri = getPostPhotoPreviewUrl(mediaRank);
  } else {
    content.uri = getPostMomentVideoUrl(mediaRank);
    content.poster = {
      blurhash: MOMENT_POSTER_BLURHASH[mediaRank - 1],
      uri: getMomentVideoPosterUri(mediaRank),
    };
  }

  return {
    id: nanoid(),
    createdAt: getDate(),
    audio: undefined,
    metadata: {
      isLiked: false,
      isSeen: false,
    },
    content,
  };
};

export const generateMemories = (length: number): MemoryResponseParams[] => {
  const memories: MemoryResponseParams[] = [];

  const photoExcludes: number[] = [];
  const videoExcludes: number[] = [];

  for (let i = 0; i < length; i++) {
    const mediaType = Math.random() > -1 ? "photo" : "video";
    const mediaRank = getRandom2(
      mediaType === "photo" ? photoExcludes : videoExcludes,
      27,
      1
    );
    memories.push(generateMemory(mediaRank, mediaType));
    if (mediaType === "photo") {
      photoExcludes.push(mediaRank);
    } else {
      videoExcludes.push(mediaRank);
    }
  }

  return memories;
};
