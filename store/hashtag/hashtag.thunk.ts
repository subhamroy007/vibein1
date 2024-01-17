import { getRandom } from "../../mocks";
import { getPostPhotoPreviewUrl } from "../../mocks/data";
import { generatePostObjects } from "../../mocks/posts";
import {
  HashtagGeneralRouteResponseParams,
  HashtagRouteThunkParams,
  PostScreenResponseParams,
} from "../../types/response.types";
import { createAppAsyncThunk, delay } from "../../utility";

export const getHashtagGeneralRouteThunk = createAppAsyncThunk<
  HashtagGeneralRouteResponseParams,
  HashtagRouteThunkParams
>(
  "hashtag/general",
  async ({ hashtag }, thunkApi) => {
    const posts = generatePostObjects(24);

    const data: HashtagGeneralRouteResponseParams = {
      hashtag: {
        name: hashtag,
        isFollowing: false,
        noOfPosts: getRandom(10000, 100),
        previewUrl: getPostPhotoPreviewUrl(3),
      },
      topPosts: posts,
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
      return arg.routeId;
    },
  }
);

export const getHashtagTopPostsRouteThunk = createAppAsyncThunk<
  PostScreenResponseParams,
  HashtagRouteThunkParams
>(
  "hashtag/top-posts",
  async ({ hashtag }, thunkApi) => {
    const requestTimestamp = Date.now();

    const posts = generatePostObjects(24);

    const data: PostScreenResponseParams = {
      posts,
    };
    await delay(7_000);
    if (Math.random() > 0.9) {
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
  },
  {
    idGenerator: (arg) => {
      return arg.routeId;
    },
  }
);
