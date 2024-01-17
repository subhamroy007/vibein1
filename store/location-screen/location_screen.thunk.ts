import { generatePostObjects } from "../../mocks/posts";
import {
  LocationScreenResponseParams,
  LocationScreenThunkParams,
} from "../../types/response.types";
import { createAppAsyncThunk, delay } from "../../utility";

export const getLocationScreenThunk = createAppAsyncThunk<
  LocationScreenResponseParams,
  LocationScreenThunkParams
>(
  "location-screen/request",
  async ({ locationId, screenId }, thunkApi) => {
    const posts = generatePostObjects(24);

    const data: LocationScreenResponseParams = {
      posts,
      fullAddress: "kandi harisagarpar murshidabad",
      id: locationId,
      name: "motijhil park",
      noOfPosts: 1243,
    };
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
  },
  {
    idGenerator: (arg) => {
      return arg.screenId;
    },
  }
);
