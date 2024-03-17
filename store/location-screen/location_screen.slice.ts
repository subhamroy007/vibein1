import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  getLocationScreenInitialState,
  removeOneLocationScreen,
  upsertOneLocationScreen,
} from "./location_screen.adapter";
import { getLocationScreenThunk } from "./location_screen.thunk";

const locationScreenSlice = createSlice({
  name: "location-screen",
  initialState: getLocationScreenInitialState(),
  reducers: {
    initLocationScreen(state, action: PayloadAction<{ screenId: string }>) {
      upsertOneLocationScreen(state, {
        data: null,
        screenId: action.payload.screenId,
        state: "idle",
      });
    },
    cleanLocationScreen(state, action: PayloadAction<{ screenId: string }>) {
      removeOneLocationScreen(state, action.payload.screenId);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getLocationScreenThunk.fulfilled,
      (
        state,
        {
          payload,
          meta: {
            arg: { screenId, locationId },
          },
        }
      ) => {
        const targetScreen = state.entities[screenId];
        if (targetScreen) {
          let previewUrl = "";
          const firstPost =
            payload.posts.length > 1 ? payload.posts[0] : undefined;

          if (firstPost) {
            if (firstPost.postType === "photo") {
              previewUrl = firstPost.photos[0].previewUrl;
            } else {
              previewUrl = firstPost.video.thumbnail.previewUrl;
            }
          }

          targetScreen.state = "success";
          targetScreen.data = {
            fullAddress: payload.fullAddress,
            id: payload.id,
            name: payload.name,
            noOfPosts: payload.noOfPosts,
            posts: payload.posts.map((post) => post.id),
            previewPhotoUrl: previewUrl,
          };
        }
      }
    );
    builder.addCase(
      getLocationScreenThunk.pending,
      (
        state,
        {
          meta: {
            arg: { screenId },
          },
        }
      ) => {
        const targetScreen = state.entities[screenId];
        if (targetScreen) {
          targetScreen.state = "loading";
        }
      }
    );
    builder.addCase(
      getLocationScreenThunk.rejected,
      (
        state,
        {
          meta: {
            arg: { screenId },
          },
        }
      ) => {
        const targetScreen = state.entities[screenId];
        if (targetScreen) {
          targetScreen.state = "failed";
        }
      }
    );
  },
});

const locationScreenReducer = locationScreenSlice.reducer;

export const {
  actions: { cleanLocationScreen, initLocationScreen },
} = locationScreenSlice;

export default locationScreenReducer;
