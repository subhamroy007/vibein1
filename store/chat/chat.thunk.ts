import { generateGroupChat, generateOneToOneChat } from "../../mocks/chat.mock";
import { ChatResponseParams } from "../../types/response.types";
import { createAppAsyncThunk, delay } from "../../utility";

export const fetchInboxChats = createAppAsyncThunk<{
  chats: ChatResponseParams[];
}>("chat/inbox", async (_, thunkApi) => {
  const chats: ChatResponseParams[] = [];

  for (let i = 0; i < 12; i++) {
    if (Math.random() > 0.5) {
      chats.push({ type: "one-to-one", ...generateOneToOneChat(1) });
      // chats.push({ type: "group", ...generateGroupChat(true) });
    } else {
      chats.push({ type: "group", ...generateGroupChat(true) });
    }
  }

  const output: { chats: ChatResponseParams[] } = {
    chats,
  };
  await delay(500);
  if (Math.random() > 1.3 || thunkApi.signal.aborted) {
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
