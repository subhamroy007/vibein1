import { generateMessageObjects } from "../../mocks/posts";
import { ChatWindowResponseParams } from "../../types/response.types";
import { createAppAsyncThunk, delay } from "../../utility";

export const getChatMessagesThunk = createAppAsyncThunk<
  ChatWindowResponseParams,
  { routeId: string; refresh?: boolean }
>("chat/messages", async (_, thunkApi) => {
  const messages = generateMessageObjects(18);

  const data: ChatWindowResponseParams = { messages };
  await delay(3_000);
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
});
