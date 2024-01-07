import { getRandom } from "../../mocks";
import { generatePostObjects } from "../../mocks/posts";
import {
  HashTagPageResponseParams,
  HashtagPageRequestParams,
  ThunkArg,
} from "../../types/response.types";
import { createAppAsyncThunk, delay } from "../../utility";

export const getHashtagPageThunk = createAppAsyncThunk<
  HashTagPageResponseParams,
  ThunkArg<HashtagPageRequestParams>
>(
  "hashtag/pageinfo",
  async ({ hashtag }, thunkApi) => {
    const posts = generatePostObjects(24);

    const data: HashTagPageResponseParams = {
      posts,
      hashtag,
      noOfPosts: getRandom(10000, 100),
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
      return arg.requestId;
    },
  }
);
