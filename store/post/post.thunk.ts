import { generateCommentObjects } from "../../mocks/comments";
import { CommentSectionResponseDataParams } from "../../types/response.types";
import { createAppAsyncThunk, delay } from "../../utility";

/**
 * thunk to fetch the intial data of the comment section (i.e total no of comments and the first batch of the recent comments)
 */
export const fetchComments = createAppAsyncThunk(
  "post/comments",
  async (postId: string, thunkApi) => {
    const comments = generateCommentObjects(10);

    const data = {
      comments,
    } as CommentSectionResponseDataParams;

    await delay(10000);

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
