import { generateAccount, generateAccounts } from "../../mocks/accounts";
import { generateMemories } from "../../mocks/memory";
import {
  generateMomentPosts,
  generatePhotoPosts,
  generatePost,
} from "../../mocks/posts";
import {
  AccountMemoryFetchResponseParams,
  AccountPaginatedResponse,
  AccountSearchResponse,
  AccountSectionResponseParams,
  MomentPostPaginatedResponse,
  PhotoPostPaginatedResponse,
  PostPaginatedResponse,
} from "../../types/response.types";
import { AccountParams } from "../../types/utility.types";
import { createAppAsyncThunk, delay } from "../../utility";
import { setMemoryLike } from "./account.slice";

export const fetchAccountMemories = createAppAsyncThunk<
  AccountMemoryFetchResponseParams,
  { userId: string }
>("account/memories", async ({ userId }, thunkApi) => {
  const account = generateAccount();
  account.username = userId;

  const output: AccountMemoryFetchResponseParams = {
    account,
    memories: generateMemories(6),
  };
  await delay(3000);
  if (Math.random() > 0.3 || thunkApi.signal.aborted) {
    return thunkApi.rejectWithValue(
      { errorCode: 1000, message: "something went wrong" },
      {
        statusCode: 400,
        requestTimestamp: Date.now(),
      }
    );
  }

  return thunkApi.fulfillWithValue(output, {
    statusCode: 200,
    requestTimestamp: Date.now(),
  });
});

export const changeMemoryLikeRequest = createAppAsyncThunk<
  undefined,
  { memoryId: string; value: boolean }
>("account/memory-like-send", async ({ memoryId, value }, thunkApi) => {
  thunkApi.dispatch(setMemoryLike({ memoryId, value }));
  await delay(400);
  if (Math.random() > 1.8) {
    thunkApi.dispatch(setMemoryLike({ memoryId, value: !value }));
    return thunkApi.rejectWithValue(
      { errorCode: 1000, message: "something went wrong" },
      {
        statusCode: 400,
        requestTimestamp: Date.now(),
      }
    );
  } else if (thunkApi.signal.aborted) {
    return thunkApi.rejectWithValue(
      { errorCode: 1001, message: "request canceled" },
      {
        statusCode: 600,
        requestTimestamp: Date.now(),
      }
    );
  }
  return thunkApi.fulfillWithValue(undefined, {
    statusCode: 200,
    requestTimestamp: Date.now(),
  });
});

export const sendMemoryReplyRequest = createAppAsyncThunk<
  undefined,
  { memoryId: string; replyText: string }
>("account/memory-reply-send", async ({ memoryId, replyText }, thunkApi) => {
  console.log("reply sent : ", replyText);
  // await delay(400);
  if (Math.random() > 1.8) {
    return thunkApi.rejectWithValue(
      { errorCode: 1000, message: "something went wrong" },
      {
        statusCode: 400,
        requestTimestamp: Date.now(),
      }
    );
  }
  // else if (thunkApi.signal.aborted) {
  //   return thunkApi.rejectWithValue(
  //     { errorCode: 1001, message: "request canceled" },
  //     {
  //       statusCode: 600,
  //       requestTimestamp: Date.now(),
  //     }
  //   );
  // }
  return thunkApi.fulfillWithValue(undefined, {
    statusCode: 200,
    requestTimestamp: Date.now(),
  });
});

export const fetchAccountProfileDetails = createAppAsyncThunk<
  AccountSectionResponseParams,
  { userId: string }
>("account/profile", async ({ userId }, thunkApi) => {
  const account = generateAccount([
    "fullname",
    "bio",
    "has-followed-client",
    "has-requeste-to-follow-client",
    "is-blocked",
    "is-favourite",
    "is-followed",
    "is-memory-hidden",
    "is-private",
    "is-requested-to-follow",
    "memory-info",
    "no-of-followers",
    "no-of-followings",
    "no-of-posts",
    "no-of-tagged-posts",
    "mute-settings",
    "notification-settings",
    "post-meta",
  ]);

  account.username = userId;
  const output: AccountSectionResponseParams = {
    account,
    recentPosts:
      account.isBlocked === true || (account.isPrivate && !account.isFollowed)
        ? undefined
        : {
            endCursor: "",
            hasEndReached: Math.random() > 0.7,
            items: generatePost(Math.min(6, account.noOfPosts!), "photos"),
          },
  };
  await delay(500);
  if (Math.random() > 1.8 || thunkApi.signal.aborted) {
    return thunkApi.rejectWithValue(
      { errorCode: 1000, message: "something went wrong" },
      {
        statusCode: 400,
        requestTimestamp: Date.now(),
      }
    );
  }

  return thunkApi.fulfillWithValue(output, {
    statusCode: 200,
    requestTimestamp: Date.now(),
  });
});

export const addRandomAccount = createAppAsyncThunk<
  AccountParams,
  { userId: string }
>("account/random", async ({ userId }, thunkApi) => {
  const account = generateAccount();
  account.username = userId;

  return thunkApi.fulfillWithValue(account, {
    statusCode: 200,
    requestTimestamp: Date.now(),
  });
});

export const fetchAccountAllPosts = createAppAsyncThunk<
  PostPaginatedResponse,
  { userId: string }
>("account/all-posts", async ({ userId }, thunkApi) => {
  const posts = generatePost(6, "photos");

  const data: PostPaginatedResponse = {
    endCursor: posts[0].createdAt,
    hasEndReached: Math.random() > 0.6,
    items: posts,
  };
  await delay(3_000);
  if (Math.random() > 0.7) {
    return thunkApi.rejectWithValue(
      { errorCode: 1000, message: "something went wrong" },
      {
        statusCode: 400,
        requestTimestamp: Date.now(),
      }
    );
  }
  return thunkApi.fulfillWithValue(data, {
    statusCode: 200,
    requestTimestamp: Date.now(),
  });
});

export const fetchAccountTaggedPosts = createAppAsyncThunk<
  PostPaginatedResponse,
  { userId: string }
>("account/tagged-posts", async ({ userId }, thunkApi) => {
  const posts = generatePost(24);

  const data: PostPaginatedResponse = {
    endCursor: posts[0].createdAt,
    hasEndReached: Math.random() > 0.6,
    items: posts,
  };
  await delay(3_000);
  if (Math.random() > 0.7) {
    return thunkApi.rejectWithValue(
      { errorCode: 1000, message: "something went wrong" },
      {
        statusCode: 400,
        requestTimestamp: Date.now(),
      }
    );
  }
  return thunkApi.fulfillWithValue(data, {
    statusCode: 200,
    requestTimestamp: Date.now(),
  });
});

export const fetchAccountPhotoPosts = createAppAsyncThunk<
  PhotoPostPaginatedResponse,
  { userId: string }
>("account/photo-posts", async ({ userId }, thunkApi) => {
  const posts = generatePhotoPosts(24);

  const data: PhotoPostPaginatedResponse = {
    endCursor: posts[0].createdAt,
    hasEndReached: Math.random() > 0.6,
    items: posts,
  };
  await delay(3_000);
  if (Math.random() > 0.7) {
    return thunkApi.rejectWithValue(
      { errorCode: 1000, message: "something went wrong" },
      {
        statusCode: 400,
        requestTimestamp: Date.now(),
      }
    );
  }
  return thunkApi.fulfillWithValue(data, {
    statusCode: 200,
    requestTimestamp: Date.now(),
  });
});

export const fetchAccountMomentPosts = createAppAsyncThunk<
  MomentPostPaginatedResponse,
  { userId: string }
>("account/moment-posts", async ({ userId }, thunkApi) => {
  const posts = generateMomentPosts(24);

  const data: MomentPostPaginatedResponse = {
    endCursor: posts[0].createdAt,
    hasEndReached: Math.random() > 0.6,
    items: posts,
  };
  await delay(3_000);
  if (Math.random() > 0.7) {
    return thunkApi.rejectWithValue(
      { errorCode: 1000, message: "something went wrong" },
      {
        statusCode: 400,
        requestTimestamp: Date.now(),
      }
    );
  }
  return thunkApi.fulfillWithValue(data, {
    statusCode: 200,
    requestTimestamp: Date.now(),
  });
});

export const fetchAccountFollowings = createAppAsyncThunk<
  AccountPaginatedResponse,
  { userId: string }
>("account/followings", async ({ userId }, thunkApi) => {
  const accounts = generateAccounts(24, [
    "fullname",
    "is-private",
    "has-followed-client",
    "is-followed",
    "is-requested-to-follow",
  ]);

  const data: AccountPaginatedResponse = {
    endCursor: "",
    hasEndReached: false,
    items: accounts,
  };
  await delay(3_000);
  if (Math.random() > 0.7) {
    return thunkApi.rejectWithValue(
      { errorCode: 1000, message: "something went wrong" },
      {
        statusCode: 400,
        requestTimestamp: Date.now(),
      }
    );
  }
  return thunkApi.fulfillWithValue(data, {
    statusCode: 200,
    requestTimestamp: Date.now(),
  });
});

export const fetchAccountFollowers = createAppAsyncThunk<
  AccountPaginatedResponse,
  { userId: string }
>("account/followers", async ({ userId }, thunkApi) => {
  const accounts = generateAccounts(24, [
    "fullname",
    "is-private",
    "has-followed-client",
    "is-followed",
    "is-requested-to-follow",
  ]);

  const data: AccountPaginatedResponse = {
    endCursor: "",
    hasEndReached: false,
    items: accounts,
  };
  await delay(3_000);
  if (Math.random() > 0.5) {
    return thunkApi.rejectWithValue(
      { errorCode: 1000, message: "something went wrong" },
      {
        statusCode: 400,
        requestTimestamp: Date.now(),
      }
    );
  }
  return thunkApi.fulfillWithValue(data, {
    statusCode: 200,
    requestTimestamp: Date.now(),
  });
});

export const fetchAccountSearchedFollowers = createAppAsyncThunk<
  AccountSearchResponse,
  { userId: string; searchedPhase: string }
>("account/search-followers", async ({ userId, searchedPhase }, thunkApi) => {
  const accounts = generateAccounts(24, [
    "fullname",
    "is-private",
    "has-followed-client",
    "is-followed",
    "is-requested-to-follow",
  ]);

  const data: AccountSearchResponse = {
    accounts,
  };
  await delay(3_000);
  if (Math.random() > 0.7) {
    return thunkApi.rejectWithValue(
      { errorCode: 1000, message: "something went wrong" },
      {
        statusCode: 400,
        requestTimestamp: Date.now(),
      }
    );
  } else if (thunkApi.signal.aborted) {
    return thunkApi.rejectWithValue(
      {
        errorCode: 1001,
        message: "request aborted for phase " + searchedPhase,
      },
      {
        statusCode: 600,
        requestTimestamp: Date.now(),
      }
    );
  }

  return thunkApi.fulfillWithValue(data, {
    statusCode: 200,
    requestTimestamp: Date.now(),
  });
});

export const fetchAccountSuggestions = createAppAsyncThunk<
  AccountPaginatedResponse,
  { userId: string }
>("account/suggestions", async ({ userId }, thunkApi) => {
  const accounts = generateAccounts(24, [
    "fullname",
    "is-private",
    "has-followed-client",
  ]);

  const data: AccountPaginatedResponse = {
    endCursor: "",
    hasEndReached: false,
    items: accounts,
  };
  await delay(3_000);
  if (Math.random() > 0.7) {
    return thunkApi.rejectWithValue(
      { errorCode: 1000, message: "something went wrong" },
      {
        statusCode: 400,
        requestTimestamp: Date.now(),
      }
    );
  }
  return thunkApi.fulfillWithValue(data, {
    statusCode: 200,
    requestTimestamp: Date.now(),
  });
});
