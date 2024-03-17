import { getProfilePictureUrl } from "./../mocks/data";
import { AppDispatch, RootState } from "../store";
import { AccountResponseParams } from "./response.types";

/**
 * represents a single photo of a post
 */
export type OutdatedPhotoParams1 = {
  url: string;
  previewUrl: string;
};

export type OutdatedVideoParams = {
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
  id: string;
  isPinned: boolean;
  createdAt: string;
  createdBy: T;
  isUpdated: boolean;
  caption?: string;
  taggedLocation?: {
    name: string;
    id: string;
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
          photos: OutdatedPhotoParams1[];
        }
      | {
          postType: "moment";
          video: OutdatedVideoParams;
        }
    );

/**
 * represents a reply template that can be used as adapter type and/or response type
 */
export type ReplyTemplateParams<T = string | AccountResponseParams> = {
  id: string;
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
  | "has-followed-client"
  | "has-requeste-to-follow-client"
  | "no-of-followers"
  | "no-of-followings"
  | "no-of-posts"
  | "is-available"
  | "is-memory-hidden"
  | "is-followed"
  | "is-requested-to-follow"
  | "fullname"
  | "is-private"
  | "is-favourite"
  | "is-blocked"
  | "bio";

export type ChatType = "direct" | "group-solid";

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
  requestTimestamp: number;
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

export type PostGeneralParams<T extends {} = {}> = {
  id: string;
  createdAt: string;
  caption?: string;
  taggedLocation?: LocationWithName;
  engagementSummary: {
    noOfLikes: number;
    noOfComments: number;
    noOfViews: number;
  };
  advancedSettings: {
    commentDisabled: boolean;
    hideLikesAndViewsCount: boolean;
  };
  metadata: {
    href: string;
    isLiked: boolean;
    isSaved: boolean;
    isPinned: boolean;
    isViewed: boolean;
  };
} & T;

export type LocationWithName = {
  id: string;
  name: string;
};

export type PhotoWithHash = {
  uri: string;
  blurhash: string;
};

export type PhotoWithPreview = {
  preview: string;
} & PhotoWithHash;

export type PostVideoParams = {
  uri: string;
  poster: PhotoWithHash;
  preview: string;
  duration: number;
  muted: boolean;
};

export type AudioWithTitle = {
  id: string;
  title: string;
};

export type AudioWithUri = {
  uri: string;
  usedSection: [number, number];
} & AudioWithTitle;

export type AccountParams = {
  id: string;
  username: string;
  profilePictureUri: string;
  fullname?: string;
  bio?: string;
  noOfPosts?: number;
  noOfFollowings?: number;
  noOfFollowers?: number;
  hasFollowedClient?: boolean;
  hasRequestedToFollowClient?: boolean;
  isAvailable?: boolean;
  isMemoryHidden?: boolean;
  isPrivate?: boolean;
  isBlocked?: boolean;
  isFollowed?: boolean;
  isRequestedToFollow?: boolean;
  isFavourite?: boolean;
};

export type TextSearchParams = {
  text: string;
};

export type HashTagSearchParams = {
  name: string;
  noOfPosts: number;
};

export type AccountSearchParams = {
  category: string;
} & AccountParams;

export type SearchParams =
  | ({ type: "text" } & TextSearchParams)
  | ({ type: "hashtag" } & HashTagSearchParams)
  | ({ type: "account" } & AccountSearchParams);
