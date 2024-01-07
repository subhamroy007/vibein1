import { getRandom } from "../../mocks";
import { generatePostObjects } from "../../mocks/posts";
import {
  HashTagPageResponseParams,
  HomeFeedResponseParams,
  PostResponseParams,
} from "../../types/response.types";
import { createAppAsyncThunk, delay } from "../../utility";

/**
 * thunk that fetches the data of the home feed for the client
 */
export const getHomeFeedThunk = createAppAsyncThunk(
  "client/homefeed",
  async (_, thunkApi) => {
    const posts = generatePostObjects(6, "moment");

    const data: HomeFeedResponseParams = { posts };
    await delay(3_000);
    if (Math.random() > 0.9) {
      return thunkApi.rejectWithValue(
        { errorCode: 1000, message: "something went wrong" },
        {
          statusCode: 400,
          requestTimestamp: new Date().toUTCString(),
        }
      );
    }

    return thunkApi.fulfillWithValue(data, {
      statusCode: 200,
      requestTimestamp: new Date().toUTCString(),
    });
  }
);

export const getForYouMomentFeedThunk = createAppAsyncThunk(
  "client/foryoufeed/moments",
  async (_, thunkApi) => {
    const posts = generatePostObjects(6, "moment");

    const data: HomeFeedResponseParams = { posts };
    await delay(4_000);
    if (Math.random() > 0.9) {
      return thunkApi.rejectWithValue(
        { errorCode: 1000, message: "something went wrong" },
        {
          statusCode: 400,
          requestTimestamp: new Date().toUTCString(),
        }
      );
    }

    return thunkApi.fulfillWithValue(data, {
      statusCode: 200,
      requestTimestamp: new Date().toUTCString(),
    });
  }
);

export const getForYouPhotosFeedThunk = createAppAsyncThunk(
  "client/foryoufeed/photos",
  async (_, thunkApi) => {
    const posts = generatePostObjects(6, "photo");

    const data: HomeFeedResponseParams = { posts };
    await delay(3_000);
    if (Math.random() > 0.9) {
      return thunkApi.rejectWithValue(
        { errorCode: 1000, message: "something went wrong" },
        {
          statusCode: 400,
          requestTimestamp: new Date().toUTCString(),
        }
      );
    }

    return thunkApi.fulfillWithValue(data, {
      statusCode: 200,
      requestTimestamp: new Date().toUTCString(),
    });
  }
);
