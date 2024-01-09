import { generatePostObjects } from "../../mocks/posts";
import {
  PostScreenResponseParams,
  PostScreenThunkParams,
} from "../../types/response.types";
import { createAppAsyncThunk, delay } from "../../utility";

export const getPostScreenThunk = createAppAsyncThunk<
  PostScreenResponseParams,
  PostScreenThunkParams
>(
  "post-screen/request",
  async ({ url }, thunkApi) => {
    const posts = generatePostObjects(24);

    const data: PostScreenResponseParams = {
      posts,
    };
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
  },
  {
    idGenerator: (arg) => {
      return arg.screenId;
    },
  }
);
