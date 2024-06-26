import { configureStore } from "@reduxjs/toolkit";
import clientReducer from "./client/client.slice";
import hashtagReducer from "./hashtag/hashtag.slice";
import postStoreReducer from "./post-store/post.slice";
import accountStoreReducer from "./account-store/account.slice";
import locationReducer from "./location/location.slice";
import audioReducer from "./audio-store/audio.slice";
import chatReducer from "./chat/chat.slice";

const appDataStore = configureStore({
  reducer: {
    client: clientReducer,
    hashtag: hashtagReducer,
    chat: chatReducer,
    post_store: postStoreReducer,
    account_store: accountStoreReducer,
    location: locationReducer,
    audio_store: audioReducer,
  },
});

export default appDataStore;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof appDataStore.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof appDataStore.dispatch;
