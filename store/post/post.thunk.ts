import { getRandom } from "../../mocks";
import { generateCommentObjects } from "../../mocks/comments";
import { CommentSectionResponseDataParams } from "../../types/response.types";
import { createAppAsyncThunk } from "../../utility";

/**
 * thunk to fetch the intial data of the comment section (i.e total no of comments and the first batch of the recent comments)
 */
export const fetchComments = createAppAsyncThunk(
  "post/comments",
  async (postId: string, thunkApi) => {
    const comments = generateCommentObjects(5);

    const data = {
      comments,
    } as CommentSectionResponseDataParams;

    return thunkApi.fulfillWithValue(data, {
      statusCode: 200,
      requestTimestamp: new Date().toUTCString(),
    });
  }
);
