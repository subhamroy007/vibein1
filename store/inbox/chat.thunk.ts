import { AccountResponseParams } from "./../../types/response.types";
import {
  generateChatObject,
  generateMessageObjects,
} from "../../mocks/chat.mock";
import {
  ChatResponseParams,
  MessagePageResponseParams,
} from "../../types/response.types";
import { createAppAsyncThunk, delay } from "../../utility";
import { getRandom } from "../../mocks";

export const getChatMessagesThunk = createAppAsyncThunk<
  MessagePageResponseParams,
  { refresh?: boolean; chatId: string }
>("chat/message_page", async ({ chatId }, thunkApi) => {
  const clientInfo = thunkApi.getState().client.loggedInAccount!;
  const chatInfo = thunkApi.getState().chat.chats.entities[chatId]!;
  const receipientInfo =
    thunkApi.getState().account.entities[chatInfo.receipient.userId]!;

  const receipients: AccountResponseParams[] = [];
  if (chatInfo.joinedAt) {
    receipients.push(clientInfo);
  }
  if (chatInfo.receipient.isMember) {
    receipients.push(receipientInfo);
  }

  const messages = generateMessageObjects(18, receipients);

  const data: MessagePageResponseParams = {
    data: messages,
    hasEndReached: Math.random() > 0.6,
    endCursor: "",
    totalCount: 10000,
  };
  await delay(3_000);
  if (Math.random() > 1.9) {
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

export const getChatInfoThunk = createAppAsyncThunk<
  ChatResponseParams,
  { refresh?: boolean; chatId: string }
>("chat/info", async ({ chatId }, thunkApi) => {
  const clientInfo = thunkApi.getState().client.loggedInAccount!;
  const chatInfo = thunkApi.getState().chat.chats.entities[chatId]!;
  const receipientInfo =
    thunkApi.getState().account.entities[chatInfo.receipient.userId]!;
  const randomNumber = getRandom(100);
  let chatType: "active" | "inactive" | "pending" | "requested" = "inactive";
  if (randomNumber <= 25) {
    chatType = "inactive";
  } else if (randomNumber <= 50) {
    chatType = "requested";
  } else if (randomNumber <= 75) {
    chatType = "pending";
  } else {
    chatType = "active";
  }

  const chat = generateChatObject(
    clientInfo,
    receipientInfo,
    chatType,
    chatType === "inactive" || Math.random() > 0.5 ? 0 : getRandom(18, 1)
  );
  chat.receipient.isMessageRequestRestricted = true;
  await delay(5_000);
  if (Math.random() > 1.5) {
    return thunkApi.rejectWithValue(
      { errorCode: 1000, message: "something went wrong" },
      {
        statusCode: 400,
        requestTimestamp: Date.now(),
      }
    );
  }

  return thunkApi.fulfillWithValue(chat, {
    statusCode: 200,
    requestTimestamp: Date.now(),
  });
});
