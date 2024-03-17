import { generateAccountObject } from "../../mocks/accounts";
import { generatePostObjects } from "../../mocks/posts";
import {
  AccountRouteResponseParams,
  AccountRouteThunkParams,
  PostScreenResponseParams,
} from "../../types/response.types";
import { createAppAsyncThunk, delay } from "../../utility";

export const getAccountHomeRouteThunk = createAppAsyncThunk<
  AccountRouteResponseParams,
  AccountRouteThunkParams
>(
  "account-route/home",
  async ({ routeId, username }, thunkApi) => {
    const posts = generatePostObjects(24);

    const data: AccountRouteResponseParams = {
      posts,
      account: {
        ...generateAccountObject([
          "bio",
          "fullname",
          "has-followed-client",
          "has-requeste-to-follow-client",
          "is-blocked",
          "is-favourite",
          "is-followed",
          "is-memory-hidden",
          "is-private",
          "is-requested-to-follow",
          "no-of-followers",
          "no-of-posts",
          "no-of-followings",
          "is-available",
        ]),
        username,
      },
    };
    await delay(3_000);
    if (Math.random() > 0.98) {
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
    idGenerator(arg) {
      return arg.routeId;
    },
  }
);

export const getAccountAllPostThunk = createAppAsyncThunk<
  PostScreenResponseParams,
  AccountRouteThunkParams
>(
  "account-route/all-posts",
  async ({ routeId, username }, thunkApi) => {
    const posts = generatePostObjects(24);

    const data: PostScreenResponseParams = {
      posts,
    };
    await delay(3_000);
    if (Math.random() > 0.5) {
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
    idGenerator(arg) {
      return arg.routeId;
    },
  }
);

export const getAccountTaggedPostThunk = createAppAsyncThunk<
  PostScreenResponseParams,
  AccountRouteThunkParams
>(
  "account-route/tagged-posts",
  async ({ routeId, username }, thunkApi) => {
    const posts = generatePostObjects(24);

    const data: PostScreenResponseParams = {
      posts,
    };
    await delay(3_000);
    if (Math.random() > 0.5) {
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
    idGenerator(arg) {
      return arg.routeId + "tags";
    },
  }
);

export const getAccountPhotosThunk = createAppAsyncThunk<
  PostScreenResponseParams,
  AccountRouteThunkParams
>(
  "account-route/photos",
  async ({ routeId, username }, thunkApi) => {
    const posts = generatePostObjects(24, "photo");

    const data: PostScreenResponseParams = {
      posts,
    };
    await delay(3_000);
    if (Math.random() > 0.7) {
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
    idGenerator(arg) {
      return arg.routeId + "photos";
    },
  }
);

export const getAccountMomentsThunk = createAppAsyncThunk<
  PostScreenResponseParams,
  AccountRouteThunkParams
>(
  "account-route/moments",
  async ({ routeId, username }, thunkApi) => {
    const posts = generatePostObjects(24, "moment");

    const data: PostScreenResponseParams = {
      posts,
    };
    await delay(3_000);
    if (Math.random() > 0.5) {
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
    idGenerator(arg) {
      return arg.routeId + "moments";
    },
  }
);
