import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getHashtagInitialState, upsertOneHashtag } from "./hashtag.adapter";
import { HashtagStoreParams } from "../../types/store.types";
import {
  getHashtagGeneralRouteThunk,
  getHashtagTopPostsRouteThunk,
} from "./hashtag.thunk";

const getInitialState = (): HashtagStoreParams => {
  return { ...getHashtagInitialState(), generalRoutes: {} };
};

const hashtagSlice = createSlice({
  name: "hashtag",
  initialState: getInitialState(),
  reducers: {
    initTopPostsRoute: (
      state,
      {
        payload: { routeId, hashtag },
      }: PayloadAction<{ routeId: string; hashtag: string }>
    ) => {
      state.generalRoutes[routeId] = {
        data: null,
        routeId,
        state: "idle",
        lastUpdatedAt: Date.now(),
        hashtag,
      };
    },
    removeTopPostsRoute: (
      state,
      { payload: { routeId } }: PayloadAction<{ routeId: string }>
    ) => {
      state.generalRoutes[routeId] = undefined;
    },
    toggleFollowState: (
      state,
      { payload: { hashtag } }: PayloadAction<{ hashtag: string }>
    ) => {
      const targetEntity = state.entities[hashtag];
      if (targetEntity) {
        targetEntity.isFollowing = !targetEntity.isFollowing;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getHashtagGeneralRouteThunk.fulfilled,
      (
        state,
        {
          payload,
          meta: {
            arg: { hashtag, routeId },
          },
        }
      ) => {
        upsertOneHashtag(state, payload.hashtag);
        const targetRoute = state.generalRoutes[routeId];
        if (targetRoute) {
          targetRoute.state = "success";
          targetRoute.lastUpdatedAt = Date.now();
          const newPostIds = payload.topPosts.map((post) => post._id);
          targetRoute.data = {
            posts: newPostIds,
            hasEndReached: false,
          };
        }
      }
    );
    builder.addCase(
      getHashtagGeneralRouteThunk.pending,
      (
        state,
        {
          meta: {
            arg: { hashtag, routeId },
          },
        }
      ) => {
        const targetRoute = state.generalRoutes[routeId];
        if (targetRoute) {
          targetRoute.state = "loading";
        }
      }
    );
    builder.addCase(
      getHashtagGeneralRouteThunk.rejected,
      (
        state,
        {
          meta: {
            arg: { hashtag, routeId },
          },
        }
      ) => {
        const targetRoute = state.generalRoutes[routeId];
        if (targetRoute) {
          targetRoute.state = "failed";
        }
      }
    );
    builder.addCase(
      getHashtagTopPostsRouteThunk.fulfilled,
      (
        state,
        {
          payload,
          meta: {
            arg: { routeId },
            requestTimestamp,
          },
        }
      ) => {
        const targetRoute = state.generalRoutes[routeId];
        if (
          targetRoute &&
          targetRoute.data &&
          requestTimestamp > targetRoute.lastUpdatedAt
        ) {
          targetRoute.state = "success";
          const newPostIds = payload.posts.map((post) => post._id);
          targetRoute.data.hasEndReached = Math.random() > 0.8;
          targetRoute.data.posts = [
            ...targetRoute.data.posts,
            ...(targetRoute.data.hasEndReached ? [] : newPostIds),
          ];
        }
      }
    );
    builder.addCase(
      getHashtagTopPostsRouteThunk.pending,
      (
        state,
        {
          meta: {
            arg: { hashtag, routeId },
          },
        }
      ) => {
        const targetRoute = state.generalRoutes[routeId];
        if (targetRoute) {
          targetRoute.state = "loading";
        }
      }
    );
    builder.addCase(
      getHashtagTopPostsRouteThunk.rejected,
      (
        state,
        {
          meta: {
            arg: { hashtag, routeId },
          },
        }
      ) => {
        const targetRoute = state.generalRoutes[routeId];
        if (targetRoute) {
          targetRoute.state = "failed";
        }
      }
    );
  },
});

const hashtagReducer = hashtagSlice.reducer;

export const {
  actions: {
    initTopPostsRoute: initHashtagGeneralRoute,
    removeTopPostsRoute: removeHashtagGeneralRoute,
    toggleFollowState: toggleHashtagFollowState,
  },
} = hashtagSlice;

export default hashtagReducer;
