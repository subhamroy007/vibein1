import { createSlice, Dictionary } from "@reduxjs/toolkit";
import { HashTagRouteParams } from "../../types/store.types";
import { fetchHashtagRoute, fetchHashtagTopPosts } from "./hashtag.thunk";
import { ItemKey } from "../../types/utility.types";

const initialState: { pages: Dictionary<HashTagRouteParams> } = {
  pages: {},
};

const hashtagSlice = createSlice({
  name: "hashtag",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchHashtagRoute.fulfilled,
      (
        state,
        {
          payload,
          meta: {
            arg: { name },
          },
        }
      ) => {
        const page = state.pages[name];
        const newItems = payload.topPosts
          ? payload.topPosts.items.map<ItemKey>((post) => ({ key: post.id }))
          : [];
        if (!page) {
          state.pages[name] = {
            createdAt: Date.now(),
            expiresAt: -1,
            name,
            noOfPosts: payload.noOfPosts,
            topPosts: payload.topPosts
              ? {
                  endCursor: payload.topPosts.endCursor,
                  hasEndReached: payload.topPosts.hasEndReached,
                  items: newItems,
                }
              : { endCursor: "", hasEndReached: true, items: [] },
          };
        } else {
          page.createdAt = Date.now();
          page.expiresAt = -1;
          page.noOfPosts = payload.noOfPosts;
          page.topPosts = payload.topPosts
            ? {
                endCursor: payload.topPosts.endCursor,
                hasEndReached: payload.topPosts.hasEndReached,
                items: newItems,
              }
            : { endCursor: "", hasEndReached: true, items: [] };
        }
      }
    );
    builder.addCase(
      fetchHashtagTopPosts.fulfilled,
      (
        state,
        {
          payload,
          meta: {
            arg: { name },
          },
        }
      ) => {
        const page = state.pages[name];
        if (page) {
          const newItems = payload.items.map<ItemKey>((post) => ({
            key: post.id,
          }));
          page.topPosts.endCursor = payload.endCursor;
          page.topPosts.hasEndReached = payload.hasEndReached;
          page.topPosts.items = [...page.topPosts.items, ...newItems];
        }
      }
    );
  },
});

const hashtagReducer = hashtagSlice.reducer;

export const {
  actions: {},
} = hashtagSlice;

export default hashtagReducer;
