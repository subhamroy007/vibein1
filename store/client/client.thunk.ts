import { getRandom } from "../../mocks";
import { generateAccount, generateAccounts } from "../../mocks/accounts";
import { generateChatObjects } from "../../mocks/chat.mock";
import { getPostPhotoPreviewUrl } from "../../mocks/data";
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
  MemoryAccountPaginatedResponse,
  MemoryAccountResponseParams,
  PostPageResponse,
  PostPaginatedResponse,
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
 * sends request to fetch the home feed posts
 */
export const fetchHomeFeedPosts = createAppAsyncThunk<
  PostPaginatedResponse,
  { refresh?: boolean }
>("client/homefeed-posts", async (_, thunkApi) => {
  const posts = generatePost(6, "photos");

  const data: PostPaginatedResponse = {
    items: posts,
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

/**
 * sends request to fetch the home feed memory accounts
 */
export const fetchHomeFeedMemoryAccounts = createAppAsyncThunk<
  MemoryAccountPaginatedResponse,
  { refresh?: boolean }
>("client/homefeed-memories", async (_, thunkApi) => {
  const memoryAccounts: MemoryAccountResponseParams[] = [];

  for (let i = 0; i < 10; i++) {
    memoryAccounts.push({
      poster: getPostPhotoPreviewUrl(getRandom(30, 1)),
      account: generateAccount(["memory-info"]),
    });
  }

  const data: MemoryAccountPaginatedResponse = {
    items: memoryAccounts,
    endCursor: "",
    hasEndReached: Math.random() > 0.5,
  };
  await delay(2_000);
  if (Math.random() > 1.7) {
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

export const fetchAccountMentions = createAppAsyncThunk<
  AccountSearchResponse,
  { searchPhase: string }
>("client/account-mentions", async (_, thunkApi) => {
  const accounts = generateAccounts(30, ["name"]);

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
});

export const fetchHashtags = createAppAsyncThunk<
  HashtagSearchResponse,
  { searchPhase: string }
>("client/hashtag", async (_, thunkApi) => {
  const hashtags = generateHashtags(30);

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
});

export const fetchSendSectionAccounts = createAppAsyncThunk<
  AccountSearchResponse,
  { searchPhase: string }
>("client/send-section-accounts", async (_, thunkApi) => {
  const accounts = generateAccounts(10, ["name"]);

  const output: AccountSearchResponse = {
    accounts,
  };
  await delay(1400);
  if (Math.random() > 0.6 || thunkApi.signal.aborted) {
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
