import { generatePostObjects } from "../../mocks/posts";
import { HomeFeedResponseParams } from "../../types/response.types";
import { createAppAsyncThunk } from "../../utility";

/**
 * thunk that fetches the data of the home feed for the client
 */
export const getHomeFeedData = createAppAsyncThunk(
  "client/homefeed",
  async () => {
    const posts = generatePostObjects(10);

    const result: HomeFeedResponseParams = { posts };

    return result;
  }
);
