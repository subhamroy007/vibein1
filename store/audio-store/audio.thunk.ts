import { generateAudio } from "../../mocks/audio.mock";
import { generatePost } from "../../mocks/posts";
import {
  AudioRouteResponseParams,
  PostPaginatedResponse,
} from "../../types/response.types";
import { createAppAsyncThunk, delay } from "../../utility";

export const fetchAudioRoute = createAppAsyncThunk<
  AudioRouteResponseParams,
  { audioId: string }
>("audio/route", async ({ audioId }, thunkApi) => {
  const posts = generatePost(12, "moments");

  const audio = generateAudio();
  audio.id = audioId;
  const data: AudioRouteResponseParams = {
    audio,
    moments: { items: posts, endCursor: "", hasEndReached: false },
  };
  await delay(400);
  if (Math.random() > 0.6) {
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

export const fetchAudioMomentPosts = createAppAsyncThunk<
  PostPaginatedResponse,
  { audioId: string }
>("audio/moments", async ({ audioId }, thunkApi) => {
  const requestTimestamp = Date.now();

  const posts = generatePost(12, "moments");

  const data: PostPaginatedResponse = {
    endCursor: "",
    hasEndReached: false,
    items: posts,
  };
  await delay(400);
  if (Math.random() > 1.9) {
    return thunkApi.rejectWithValue(
      { errorCode: 1000, message: "something went wrong" },
      {
        statusCode: 400,
        requestTimestamp,
      }
    );
  }

  return thunkApi.fulfillWithValue(data, {
    statusCode: 200,
    requestTimestamp,
  });
});

export const fetchAudioPhotoPosts = createAppAsyncThunk<
  PostPaginatedResponse,
  { audioId: string }
>("audio/photos", async ({ audioId }, thunkApi) => {
  const requestTimestamp = Date.now();

  const posts = generatePost(12, "photos");

  const data: PostPaginatedResponse = {
    endCursor: "",
    hasEndReached: false,
    items: posts,
  };
  await delay(400);
  if (Math.random() > 1.9) {
    return thunkApi.rejectWithValue(
      { errorCode: 1000, message: "something went wrong" },
      {
        statusCode: 400,
        requestTimestamp,
      }
    );
  }

  return thunkApi.fulfillWithValue(data, {
    statusCode: 200,
    requestTimestamp,
  });
});
