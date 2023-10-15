import { generatePostObjects } from "../../mocks/posts";
import { HomeFeedResponseParams } from "../../types/response.types";
import { createAppAsyncThunk, delay } from "../../utility";

/**
 * thunk that fetches the data of the home feed for the client
 */
export const getHomeFeedData = createAppAsyncThunk(
  "client/homefeed",
  async (_, thunkApi) => {
    const posts = generatePostObjects(1);

    const data: HomeFeedResponseParams = { posts };
    await delay(10_000);
    if (Math.random() > 0.8) {
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
