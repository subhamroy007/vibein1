import { generateChatObjects } from "../../mocks/chat.mock";
import { generatePost, generatePostObjects } from "../../mocks/posts";
import {
  generateAccountsSearch,
  generateHashtags,
  generateSearchResult,
} from "../../mocks/search";
import {
  AccountSearchResponse,
  ChatPageResponseParams,
  HashtagSearchResponse,
  HomeFeedResponseParams,
  PostPageResponse,
  PostScreenResponseParams,
  QuickSearchResponse,
} from "../../types/response.types";
import { createAppAsyncThunk, delay } from "../../utility";

export const getInboxChatsThunk = createAppAsyncThunk<
  ChatPageResponseParams,
  { refresh?: boolean }
>("client/inbox-chats", async (_, thunkApi) => {
  const clientInfo = thunkApi.getState().client.loggedInAccount;

  const chats = generateChatObjects(18, { ...clientInfo! }, "dm");

  const data: ChatPageResponseParams = {
    nextPageInfo: { hasEndReached: true },
    data: chats,
  };
  await delay(3_000);
  if (Math.random() > 1.9) {
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

/**
 * thunk that fetches the data of the home feed for the client
 */
export const fetchHomeFeedPosts = createAppAsyncThunk<
  PostPageResponse,
  { refresh?: boolean }
>("client/homefeed", async (_, thunkApi) => {
  const posts = generatePost(6);

  const data: PostPageResponse = {
    data: posts,
    endCursor: "",
    hasEndReached: false,
  };
  await delay(2_000);
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

export const fetchMomentsFeed = createAppAsyncThunk<
  PostPageResponse,
  { refresh?: boolean }
>("client/foryou-moments", async (_, thunkApi) => {
  const posts = generatePost(3, "moments");

  const result: PostPageResponse = {
    data: posts,
    endCursor: posts[0].createdAt,
    hasEndReached: false,
  };
  await delay(3_000);
  if (Math.random() > 1.5) {
    return thunkApi.rejectWithValue(
      { errorCode: 1000, message: "something went wrong" },
      {
        statusCode: 400,
        requestTimestamp: Date.now(),
      }
    );
  }

  return thunkApi.fulfillWithValue(result, {
    statusCode: 200,
    requestTimestamp: Date.now(),
  });
});

export const fetchPhotosFeed = createAppAsyncThunk<
  PostPageResponse,
  { refresh?: boolean }
>("client/foryou-photos", async (_, thunkApi) => {
  const posts = generatePost(3, "photos");

  const result: PostPageResponse = {
    data: posts,
    endCursor: posts[0].createdAt,
    hasEndReached: false,
  };
  await delay(3_000);
  if (Math.random() > 1.5) {
    return thunkApi.rejectWithValue(
      { errorCode: 1000, message: "something went wrong" },
      {
        statusCode: 400,
        requestTimestamp: Date.now(),
      }
    );
  }

  return thunkApi.fulfillWithValue(result, {
    statusCode: 200,
    requestTimestamp: Date.now(),
  });
});

export const fetchExploreFeed = createAppAsyncThunk<
  PostPageResponse,
  { refresh?: boolean }
>("client/explore", async (_, thunkApi) => {
  const posts = generatePost(12);

  const result: PostPageResponse = {
    data: posts,
    endCursor: posts[0].createdAt,
    hasEndReached: false,
  };
  await delay(3_000);
  if (Math.random() > 1.5) {
    return thunkApi.rejectWithValue(
      { errorCode: 1000, message: "something went wrong" },
      {
        statusCode: 400,
        requestTimestamp: Date.now(),
      }
    );
  }

  return thunkApi.fulfillWithValue(result, {
    statusCode: 200,
    requestTimestamp: Date.now(),
  });
});

export const fetchPostSuggestions = createAppAsyncThunk<
  PostPageResponse,
  { postId: string }
>("client/post-suggestions", async (_, thunkApi) => {
  const posts = generatePost(4);

  const result: PostPageResponse = {
    data: posts,
    endCursor: posts[0].createdAt,
    hasEndReached: false,
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

  return thunkApi.fulfillWithValue(result, {
    statusCode: 200,
    requestTimestamp: Date.now(),
  });
});

export const fetchQuickSearchResult = createAppAsyncThunk<
  QuickSearchResponse,
  { searchPhase: string }
>("client/quick-search", async (_, thunkApi) => {
  const result = generateSearchResult(15);

  const output: QuickSearchResponse = {
    result,
  };
  await delay(1000);
  if (Math.random() > 1.5) {
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

export const fetchSearchedAccounts = createAppAsyncThunk<AccountSearchResponse>(
  "client/account-search",
  async (_, thunkApi) => {
    const accounts = generateAccountsSearch(15);

    const output: AccountSearchResponse = {
      accounts,
    };
    await delay(3000);
    if (Math.random() > 0.5) {
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
  }
);

export const fetchSearchedHashtags = createAppAsyncThunk<HashtagSearchResponse>(
  "client/hashtag-search",
  async (_, thunkApi) => {
    const hashtags = generateHashtags(15);

    const output: HashtagSearchResponse = {
      hashtags,
    };
    await delay(3000);
    if (Math.random() > 0.5) {
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
  }
);

export const fetchSearchedPosts = createAppAsyncThunk<PostPageResponse>(
  "client/post-search",
  async (_, thunkApi) => {
    const posts = generatePost(18);

    const result: PostPageResponse = {
      data: posts,
      endCursor: posts[0].createdAt,
      hasEndReached: false,
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

    return thunkApi.fulfillWithValue(result, {
      statusCode: 200,
      requestTimestamp: Date.now(),
    });
  }
);
