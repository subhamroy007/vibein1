import { generateAccount } from "../../mocks/accounts";
import { generateMemories } from "../../mocks/memory";
import { AccountMemoryFetchResponseParams } from "../../types/response.types";
import { AccountParams } from "../../types/utility.types";
import { createAppAsyncThunk, delay } from "../../utility";
import { setMemoryLike } from "./account.slice";

export const fetchAccountMemories = createAppAsyncThunk<
  AccountMemoryFetchResponseParams,
  { userId: string }
>("account/memories", async ({ userId }, thunkApi) => {
  const account = generateAccount();
  account.username = userId;

  const output: AccountMemoryFetchResponseParams = {
    account,
    memories: generateMemories(6),
  };
  await delay(3000);
  if (Math.random() > 0.3 || thunkApi.signal.aborted) {
    return thunkApi.rejectWithValue(
      { errorCode: 1000, message: "something went wrong" },
      {
        statusCode: 400,
        requestTimestamp: Date.now(),
      }
    );
  }

  return thunkApi.fulfillWithValue(output, {
    statusCode: 200,
    requestTimestamp: Date.now(),
  });
});

export const changeMemoryLikeRequest = createAppAsyncThunk<
  undefined,
  { memoryId: string; value: boolean }
>("account/memory-like-send", async ({ memoryId, value }, thunkApi) => {
  thunkApi.dispatch(setMemoryLike({ memoryId, value }));
  await delay(400);
  if (Math.random() > 1.8) {
    thunkApi.dispatch(setMemoryLike({ memoryId, value: !value }));
    return thunkApi.rejectWithValue(
      { errorCode: 1000, message: "something went wrong" },
      {
        statusCode: 400,
        requestTimestamp: Date.now(),
      }
    );
  } else if (thunkApi.signal.aborted) {
    return thunkApi.rejectWithValue(
      { errorCode: 1001, message: "request canceled" },
      {
        statusCode: 600,
        requestTimestamp: Date.now(),
      }
    );
  }
  return thunkApi.fulfillWithValue(undefined, {
    statusCode: 200,
    requestTimestamp: Date.now(),
  });
});

export const sendMemoryReplyRequest = createAppAsyncThunk<
  undefined,
  { memoryId: string; replyText: string }
>("account/memory-reply-send", async ({ memoryId, replyText }, thunkApi) => {
  console.log("reply sent : ", replyText);
  // await delay(400);
  if (Math.random() > 1.8) {
    return thunkApi.rejectWithValue(
      { errorCode: 1000, message: "something went wrong" },
      {
        statusCode: 400,
        requestTimestamp: Date.now(),
      }
    );
  }
  // else if (thunkApi.signal.aborted) {
  //   return thunkApi.rejectWithValue(
  //     { errorCode: 1001, message: "request canceled" },
  //     {
  //       statusCode: 600,
  //       requestTimestamp: Date.now(),
  //     }
  //   );
  // }
  return thunkApi.fulfillWithValue(undefined, {
    statusCode: 200,
    requestTimestamp: Date.now(),
  });
});

export const addRandomAccount = createAppAsyncThunk<
  AccountParams,
  { userId: string }
>("account/random", async ({ userId }, thunkApi) => {
  const account = generateAccount();
  account.username = userId;

  return thunkApi.fulfillWithValue(account, {
    statusCode: 200,
    requestTimestamp: Date.now(),
  });
});
