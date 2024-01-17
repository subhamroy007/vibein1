import { generatePostObjects } from "../../mocks/posts";
import {
  HomeFeedResponseParams,
  PostScreenResponseParams,
} from "../../types/response.types";
import { createAppAsyncThunk, delay } from "../../utility";

/**
 * thunk that fetches the data of the home feed for the client
 */
export const getHomeFeedThunk = createAppAsyncThunk(
  "client/homefeed",
  async (_, thunkApi) => {
    const posts = generatePostObjects(12);

    const data: HomeFeedResponseParams = { posts };
    await delay(3_000);
    if (Math.random() > 0.9) {
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
  }
);

export const getForYouMomentFeedThunk = createAppAsyncThunk<
  PostScreenResponseParams,
  { refresh?: boolean }
>("client/foryou-moments", async (_, thunkApi) => {
  const posts = generatePostObjects(12, "moment");

  const data: PostScreenResponseParams = { posts };
  await delay(4_000);
  if (Math.random() > 0.9) {
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

export const getForYouPhotosFeedThunk = createAppAsyncThunk<
  PostScreenResponseParams,
  { refresh?: boolean }
>("client/foryou-photos", async (_, thunkApi) => {
  const posts = generatePostObjects(12, "photo");

  const data: PostScreenResponseParams = { posts };
  await delay(3_000);
  if (Math.random() > 0.9) {
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
