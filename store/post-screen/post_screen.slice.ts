import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  getPostScreenInitialState,
  removeOnePostScreen,
  upsertOnePostScreen,
} from "./post_screen.adapter";
import { getPostScreenThunk } from "./post_screen.thunk";

const postScreenSlice = createSlice({
  name: "post-screen",
  initialState: getPostScreenInitialState(),
  reducers: {
    initPostScreen(
      state,
      action: PayloadAction<{ initPosts: string[]; screenId: string }>
    ) {
      upsertOnePostScreen(state, {
        id: action.payload.screenId,
        posts: action.payload.initPosts,
        state: "idle",
      });
    },
    cleanPostScreen(state, action: PayloadAction<{ screenId: string }>) {
      removeOnePostScreen(state, action.payload.screenId);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getPostScreenThunk.fulfilled,
      (
        state,
        {
          payload: { posts },
          meta: {
            arg: { screenId },
          },
        }
      ) => {
        const targetScreen = state.entities[screenId];
        if (targetScreen) {
          targetScreen.state = "success";
          targetScreen.posts = posts.map((item) => item.id);
        }
      }
    );
    builder.addCase(
      getPostScreenThunk.pending,
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
      getPostScreenThunk.rejected,
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

const postScreenReducer = postScreenSlice.reducer;

export const {
  actions: { cleanPostScreen, initPostScreen },
} = postScreenSlice;

export default postScreenReducer;
