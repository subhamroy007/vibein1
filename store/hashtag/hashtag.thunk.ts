import { getRandom } from "../../mocks";
import { generatePost } from "../../mocks/posts";
import {
  HashtagRouteResponseParams,
  PostPaginatedResponse,
} from "../../types/response.types";
import { createAppAsyncThunk, delay } from "../../utility";

export const fetchHashtagRoute = createAppAsyncThunk<
  HashtagRouteResponseParams,
  { name: string }
>("hashtag/route", async ({ name }, thunkApi) => {
  const posts = generatePost(12);

  const data: HashtagRouteResponseParams = {
    name,
    noOfPosts: getRandom(1000000, 1000),
    topPosts: { endCursor: "", hasEndReached: false, items: posts },
  };
  await delay(400);
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

export const fetchHashtagTopPosts = createAppAsyncThunk<
  PostPaginatedResponse,
  { name: string }
>("hashtag/top-posts", async ({ name }, thunkApi) => {
  const requestTimestamp = Date.now();

  const posts = generatePost(8);

  const data: PostPaginatedResponse = {
    endCursor: "",
    hasEndReached: false,
    items: posts,
  };
  await delay(400);
  if (Math.random() > 1.9) {
    return thunkApi.rejectWithValue(
      { errorCode: 1000, message: "something went wrong" },
      {
        statusCode: 400,
        requestTimestamp,
      }
    );
  }

  return thunkApi.fulfillWithValue(data, {
    statusCode: 200,
    requestTimestamp,
  });
});
