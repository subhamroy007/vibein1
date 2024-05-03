import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { selectAudioById } from "./audio.adapter";

export const selectAudioRouteParams = createSelector(
  [(state: RootState) => state, (_: RootState, audioId: string) => audioId],
  (state, audioId) => {
    const page = state.audio_store.pages[audioId];
    if (!page) return undefined;
    const audio = selectAudioById(state.audio_store.audios, audioId);
    if (!audio) return undefined;
    return {
      createdAt: page.createdAt,
      expiresAt: page.expiresAt,
      audio,
    };
  }
);

export const selectAudioMomentPosts = createSelector(
  [(state: RootState) => state, (_: RootState, audioId: string) => audioId],
  (state, audioId) => {
    const page = state.audio_store.pages[audioId];

    return page?.moments;
  }
);

export const selectAudioPhotoPosts = createSelector(
  [(state: RootState) => state, (_: RootState, audioId: string) => audioId],
  (state, audioId) => {
    const page = state.audio_store.pages[audioId];

    return page?.photos;
  }
);
