import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getHashtagInitialState, upsertOneHashtag } from "./hashtag.adapter";
import { getHashtagPageThunk } from "./hashtag.thunk";
import {
  FulFilledActionParams,
  HashTagPageResponseParams,
  HashtagPageRequestParams,
} from "../../types/response.types";

const hashtagSlice = createSlice({
  name: "hashtag",
  initialState: getHashtagInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getHashtagPageThunk.fulfilled, (state, { payload }) => {
      let previewUrl = "";
      const firstPost = payload.posts.length > 1 ? payload.posts[0] : undefined;

      if (firstPost) {
        if (firstPost.postType === "photo") {
          previewUrl = firstPost.photos[0].previewUrl;
        } else {
          previewUrl = firstPost.video.thumbnail.previewUrl;
        }
      }

      upsertOneHashtag(state, {
        name: payload.hashtag,
        noOfPosts: payload.noOfPosts,
        posts: payload.posts.map((post) => post._id),
        previewUrl,
      });
    });
  },
});

const hashtagReducer = hashtagSlice.reducer;

export default hashtagReducer;
