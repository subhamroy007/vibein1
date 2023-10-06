import { generateCommentObjects } from "../../mocks/comments";
import { CommentSectionResponseParams } from "../../types/response.types";
import { createAppAsyncThunk } from "../../utility";

export const fetchComments = createAppAsyncThunk(
  "post/comments",
  (postId: string) => {
    const comments = generateCommentObjects(20);

    const result: CommentSectionResponseParams = { comments };

    return result;
  }
);
