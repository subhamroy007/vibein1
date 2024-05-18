import { getRandom } from "../../mocks";
import { generateAccounts } from "../../mocks/accounts";
import { generateComments, generateNewComment } from "../../mocks/posts";
import {
  AccountSearchResponse,
  CommentPageResponse,
  CommentResponseParams,
  PostLikeAuthor,
  PostLikeSectionResponseParams,
} from "../../types/response.types";
import { createAppAsyncThunk, delay } from "../../utility";
import { selectCommentById } from "./post.adapter";

export const fetchComments = createAppAsyncThunk<
  CommentPageResponse,
  { postId: string }
>("post/comments", async ({ postId }, thunkApi) => {
  const comments = generateComments(12, postId);
  const result: CommentPageResponse = {
    items: comments,
    endCursor: comments[0].createdAt,
    hasEndReached: false,
  };
  await delay(500);
  if (Math.random() > 1.5) {
    return thunkApi.rejectWithValue(
      { errorCode: 1000, message: "something went wrong" },
      {
        statusCode: 400,
        requestTimestamp: Date.now(),
      }
    );
  }

  return thunkApi.fulfillWithValue(result, {
    statusCode: 200,
    requestTimestamp: Date.now(),
  });
});

export const fetchReplies = createAppAsyncThunk<
  CommentPageResponse,
  { commentId: string }
>(
  "comment/replies",
  async ({ commentId }, { getState, rejectWithValue, fulfillWithValue }) => {
    const targetComment = selectCommentById(
      getState().post_store.comments,
      commentId
    );
    if (!targetComment)
      return rejectWithValue(
        { errorCode: 1000, message: "something went wrong" },
        {
          statusCode: 400,
          requestTimestamp: Date.now(),
        }
      );
    const comments = generateComments(6, targetComment.postId, commentId);

    const result: CommentPageResponse = {
      items: comments,
      endCursor: comments[0].createdAt,
      hasEndReached: false,
    };
    await delay(500);
    if (Math.random() > 0.7) {
      return rejectWithValue(
        { errorCode: 1000, message: "something went wrong" },
        {
          statusCode: 400,
          requestTimestamp: Date.now(),
        }
      );
    }

    return fulfillWithValue(result, {
      statusCode: 200,
      requestTimestamp: Date.now(),
    });
  }
);

export const uploadComment = createAppAsyncThunk<
  CommentResponseParams,
  { postId: string; text: string; id: string }
>("post/upload-comment", async ({ postId, text }, thunkApi) => {
  const comment = generateNewComment(postId, text);

  await delay(2000);
  if (Math.random() > 1.7) {
    return thunkApi.rejectWithValue(
      { errorCode: 1000, message: "something went wrong" },
      {
        statusCode: 400,
        requestTimestamp: Date.now(),
      }
    );
  }

  return thunkApi.fulfillWithValue(comment, {
    statusCode: 200,
    requestTimestamp: Date.now(),
  });
});

export const fetchLikes = createAppAsyncThunk<
  PostLikeSectionResponseParams,
  { postId: string; refresh?: boolean }
>("post/likes", async ({ postId }, thunkApi) => {
  const accounts = generateAccounts(20, [
    "name",
    "has-followed-client",
    "is-followed",
    "is-requested-to-follow",
  ]).map<PostLikeAuthor>((account) => ({
    likedAt: new Date().toUTCString(),
    ...account,
  }));

  const result: PostLikeSectionResponseParams = {
    likes: {
      items: accounts,
      endCursor: accounts[0].id,
      hasEndReached: Math.random() > 0.7,
    },
    engagementSummary: {
      noOfLikes: getRandom(47827473, 20),
      noOfViews: getRandom(47827473, 20),
    },
  };

  await delay(1000);
  if (Math.random() > 0.7 || thunkApi.signal.aborted) {
    return thunkApi.rejectWithValue(
      { errorCode: 1000, message: "something went wrong" },
      {
        statusCode: 400,
        requestTimestamp: Date.now(),
      }
    );
  }

  return thunkApi.fulfillWithValue(result, {
    statusCode: 200,
    requestTimestamp: Date.now(),
  });
});

export const fetchFilteredLikes = createAppAsyncThunk<
  AccountSearchResponse,
  { postId: string; searchPhase: string }
>("post/filtered-likes", async ({ postId, searchPhase }, thunkApi) => {
  const accounts = generateAccounts(20, [
    "name",
    "has-followed-client",
    "is-followed",
    "is-requested-to-follow",
  ]);

  const result: AccountSearchResponse = {
    accounts,
  };

  await delay(1400);
  if (Math.random() > 0.3 || thunkApi.signal.aborted) {
    return thunkApi.rejectWithValue(
      { errorCode: 1000, message: "something went wrong" },
      {
        statusCode: 400,
        requestTimestamp: Date.now(),
      }
    );
  }

  return thunkApi.fulfillWithValue(result, {
    statusCode: 200,
    requestTimestamp: Date.now(),
  });
});
