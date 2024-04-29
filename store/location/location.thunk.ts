import { getRandom } from "../../mocks";
import { generatePost } from "../../mocks/posts";
import {
  LocationRouteResponseParams,
  PostPaginatedResponse,
} from "../../types/response.types";
import { createAppAsyncThunk, delay } from "../../utility";

export const fetchLocationRoute = createAppAsyncThunk<
  LocationRouteResponseParams,
  { location_id: string }
>("location/route", async ({ location_id }, thunkApi) => {
  const posts = generatePost(12);

  const data: LocationRouteResponseParams = {
    name: "Kolkata-city of joy",
    noOfPosts: getRandom(1000000, 1000),
    topPosts: { endCursor: "", hasEndReached: false, items: posts },
  };
  await delay(400);
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

export const fetchLocationTopPosts = createAppAsyncThunk<
  PostPaginatedResponse,
  { location_id: string }
>("location/top-posts", async ({ location_id }, thunkApi) => {
  const requestTimestamp = Date.now();

  const posts = generatePost(8);

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
