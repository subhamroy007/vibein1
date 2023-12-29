import { AppDispatch, RootState } from "../store";
import { AccountResponseParams } from "./response.types";

/**
 * represents a single photo of a post
 */
export type PostPhotoParams = {
  url: string;
  previewUrl: string;
};

export type PostMomentVideoParams = {
  url: string;
  thumbnail: {
    url: string;
    previewUrl: string;
  };
};

/**
 * represents the configurable settings of a post
 */
export type PostAdvancedOptionParams = {
  hideEngagementCount: boolean;
  commentSetting: "disabled" | "following" | "all";
  disableCirculation: boolean;
  disableSharing: boolean;
};

/**
 * represents all engagement counts of a post
 */
export type PostEngagementParams = {
  noOfLikes: number;
  noOfViews: number;
  noOfComments: number;
};

export type PostTemplateCommonParams<T = string | AccountResponseParams> = {
  _id: string;
  isPinned: boolean;
  createdAt: string;
  createdBy: T;
  isUpdated: boolean;
  caption?: string;
  taggedLocation?: {
    name: string;
    _id: string;
  };
  taggedAccounts?: T[];
  advancedOptions: PostAdvancedOptionParams;
  engagementSummary: PostEngagementParams;
  isViewed: boolean;
  isLiked: boolean;
  isSaved: boolean;
};

/**
 * represents a post template that can be used as adapter type and/or response type
 */
export type PostTemplateParams<T = string | AccountResponseParams> =
  PostTemplateCommonParams<T> &
    (
      | {
          postType: "photo";
          photos: PostPhotoParams[];
        }
      | {
          postType: "moment";
          video: PostMomentVideoParams;
        }
    );

/**
 * represents a reply template that can be used as adapter type and/or response type
 */
export type ReplyTemplateParams<T = string | AccountResponseParams> = {
  _id: string;
  content: string;
  createdAt: string;
  createdBy: T;
  noOfLikes: number;
  isLiked: boolean;
};

/**
 * represents a comment template that can be used as adapter type and/or response type
 */
export type CommentTemplateParams<T = string | AccountResponseParams> = {
  isPinned: boolean;
  noOfReplies: number;
} & ReplyTemplateParams<T>;

export type AccountField =
  | "no-of-followers"
  | "is-following"
  | "has-requested-to-follow"
  | "is-followed"
  | "fullname"
  | "is-private"
  | "is-favourite";

/**
 * represents the error object returned by the thunk in case of the promise is rejected
 */
export type ThunkError = {
  errorCode: number;
  message: string;
};

/**
 * represents the metadata returned by the thunk in case of the promise is rejected or resolved
 */
export type ThunkMeta = {
  statusCode: number;
  requestTimestamp: string;
};

export type AsyncThunkConfig = {
  /** return type for `thunkApi.getState` */
  state: RootState;
  /** type for `thunkApi.dispatch` */
  dispatch: AppDispatch;
  /** type of the `extra` argument for the thunk middleware, which will be passed in as `thunkApi.extra` */
  extra?: unknown;
  /** type to be passed into `rejectWithValue`'s first argument that will end up on `rejectedAction.payload` */
  rejectValue: ThunkError;
  /** return type of the `serializeError` option callback */
  serializedErrorType?: unknown;
  /** type to be returned from the `getPendingMeta` option callback & merged into `pendingAction.meta` */
  pendingMeta?: unknown;
  /** type to be passed into the second argument of `fulfillWithValue` to finally be merged into `fulfilledAction.meta` */
  fulfilledMeta: ThunkMeta;
  /** type to be passed into the second argument of `rejectWithValue` to finally be merged into `rejectedAction.meta` */
  rejectedMeta: ThunkMeta;
};
