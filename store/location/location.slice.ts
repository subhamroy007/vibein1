import { createSlice, Dictionary } from "@reduxjs/toolkit";
import {
  HashTagRouteParams,
  LocationRouteParams,
} from "../../types/store.types";
import { ItemKey } from "../../types/utility.types";
import { fetchLocationRoute, fetchLocationTopPosts } from "./location.thunk";

const initialState: { pages: Dictionary<LocationRouteParams> } = {
  pages: {},
};

const locationSlice = createSlice({
  name: "hashtag",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchLocationRoute.fulfilled,
      (
        state,
        {
          payload,
          meta: {
            arg: { location_id },
          },
        }
      ) => {
        const page = state.pages[location_id];
        const newItems = payload.topPosts
          ? payload.topPosts.items.map<ItemKey>((post) => ({ key: post.id }))
          : [];
        if (!page) {
          state.pages[location_id] = {
            createdAt: Date.now(),
            expiresAt: -1,
            name: payload.name,
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
      fetchLocationTopPosts.fulfilled,
      (
        state,
        {
          payload,
          meta: {
            arg: { location_id },
          },
        }
      ) => {
        const page = state.pages[location_id];
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

const locationReducer = locationSlice.reducer;

export const {
  actions: {},
} = locationSlice;

export default locationReducer;
