import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./account/account.slice";
import postReducer from "./post/post.slice";
import commentReducer from "./comment/comment.slice";
import clientReducer from "./client/client.slice";
import replyReducer from "./reply/reply.slice";
import hashtagReducer from "./hashtag/hashtag.slice";
import requestReducer from "./request/request.slice";
import postScreenReducer from "./post-screen/post_screen.slice";
import locationScreenReducer from "./location-screen/location_screen.slice";

const appDataStore = configureStore({
  reducer: {
    account: accountReducer,
    post: postReducer,
    comment: commentReducer,
    client: clientReducer,
    reply: replyReducer,
    hashtag: hashtagReducer,
    request: requestReducer,
    postScreen: postScreenReducer,
    locationScreen: locationScreenReducer,
  },
});

export default appDataStore;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof appDataStore.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof appDataStore.dispatch;
