import {
  createSlice,
  Dictionary,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";
import { AudioRouteParams } from "../../types/store.types";
import { AudioParams, ItemKey } from "../../types/utility.types";
import { getAudioAdapterInitialState, upsertOneAudio } from "./audio.adapter";
import {
  fetchAudioMomentPosts,
  fetchAudioPhotoPosts,
  fetchAudioRoute,
} from "./audio.thunk";

const initialState: {
  pages: Dictionary<AudioRouteParams>;
  audios: EntityState<AudioParams>;
} = {
  pages: {},
  audios: getAudioAdapterInitialState(),
};

const audioSlice = createSlice({
  name: "audio",
  initialState,
  reducers: {
    setSaveState(
      state,
      {
        payload: { audioId, value },
      }: PayloadAction<{ audioId: string; value: boolean }>
    ) {
      const audio = state.audios.entities[audioId];
      if (!audio) return;
      audio.isSaved = value;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchAudioRoute.fulfilled,
      (
        state,
        {
          meta: {
            arg: { audioId },
          },
          payload,
        }
      ) => {
        const newItems = payload.moments
          ? payload.moments.items.map<ItemKey>((post) => ({ key: post.id }))
          : [];
        if (!state.pages[audioId]) {
          state.pages[audioId] = {
            createdAt: Date.now(),
            expiresAt: -1,
            id: audioId,
            photos: payload.audio.noOfPhotos
              ? null
              : { endCursor: "", hasEndReached: true, items: [] },
            moments: payload.moments
              ? {
                  endCursor: payload.moments.endCursor,
                  hasEndReached: payload.moments.hasEndReached,
                  items: newItems,
                }
              : { endCursor: "", hasEndReached: true, items: [] },
          };
        } else {
          const page = state.pages[audioId]!;
          const targetAudio = state.audios.entities[audioId]!;
          page.createdAt = Date.now();
          if (targetAudio.noOfPhotos !== payload.audio.noOfPhotos) {
            if (payload.audio.noOfPhotos) {
              page.photos = null;
            } else {
              page.photos = { items: [], hasEndReached: true, endCursor: "" };
            }
          }
          if (payload.moments) {
            page.moments.endCursor = payload.moments.endCursor;
            page.moments.hasEndReached = payload.moments.hasEndReached;
            page.moments.items = newItems;
          } else {
            page.moments = { endCursor: "", hasEndReached: true, items: [] };
          }
        }
        upsertOneAudio(state.audios, payload.audio);
      }
    );
    builder.addCase(
      fetchAudioMomentPosts.fulfilled,
      (
        state,
        {
          payload,
          meta: {
            arg: { audioId },
          },
        }
      ) => {
        const page = state.pages[audioId];
        if (!page) return;
        const newItems = payload.items.map<ItemKey>((post) => ({
          key: post.id,
        }));
        page.moments.endCursor = payload.endCursor;
        page.moments.hasEndReached = payload.hasEndReached;
        page.moments.items = [...page.moments.items, ...newItems];
      }
    );
    builder.addCase(
      fetchAudioPhotoPosts.fulfilled,
      (
        state,
        {
          payload,
          meta: {
            arg: { audioId },
          },
        }
      ) => {
        const page = state.pages[audioId];
        if (!page) return;
        const newItems = payload.items.map<ItemKey>((post) => ({
          key: post.id,
        }));
        if (page.photos) {
          page.photos.endCursor = payload.endCursor;
          page.photos.hasEndReached = payload.hasEndReached;
          page.photos.items = [...page.photos.items, ...newItems];
        } else {
          page.photos = {
            endCursor: payload.endCursor,
            hasEndReached: payload.hasEndReached,
            items: newItems,
          };
        }
      }
    );
  },
});

const audioReducer = audioSlice.reducer;

export const {
  actions: { setSaveState: setAudioSaveState },
} = audioSlice;

export default audioReducer;
