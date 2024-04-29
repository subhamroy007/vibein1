import { generateReplyObjects } from "../../mocks/reply";
import { ReplySectionResponseDataParams } from "../../types/response.types";
import { createAppAsyncThunk, delay } from "../../utility";

/**
 * thunk to fetch the intial data of the comment section (i.e total no of comments and the first batch of the recent comments)
 */
export const fetchReplies = createAppAsyncThunk(
  "comment/replies",
  async (commentId: string, thunkApi) => {
    const replies = generateReplyObjects(10);

    const data: ReplySectionResponseDataParams = {
      replies,
    };

    await delay(3000);

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
