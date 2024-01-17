import { Dictionary, EntityState } from "@reduxjs/toolkit";
import { AccountResponseParams } from "./response.types";
import {
  CommentTemplateParams,
  PostTemplateParams,
  ReplyTemplateParams,
  ThunkError,
} from "./utility.types";

/**
 * represents different states of thunk processing
 */
export type ThunkState = "loading" | "failed" | "success" | "idle";

export type ThunkInfo = {
  state: ThunkState;
  lastRequestError: ThunkError | null;
  meta: {
    lastRequestStatusCode: number;
    lastRequestTimestamp: string;
  } | null;
};

/**
 * represents a reply of a comment
 */
export type ReplyAdapterParams = ReplyTemplateParams<string>;

/**
 * represents the reply section of a comment
 */
export type ReplySectionStoreParams = {
  replies: string[];
  replySectionThunkInfo: ThunkInfo;
};

/**
 * represents a comment of a post
 */
export type CommentAdapterParams = CommentTemplateParams<string> &
  ReplySectionStoreParams;

/**
 * represents the comment section of a post
 */
export type CommentSectionStoreParams = {
  comments: string[];
  commentSectionThunkInfo: ThunkInfo;
};

/**
 * represents the similar post section of a post
 */
export type SimilarPostSectionStoreParams = {
  similarPosts: PostFeedItemIdentfierParams[];
  similarPostSectionThunkInfo: ThunkInfo;
};

/**
 * represents a post and all the associated parameters
 */
export type PostAdapterParams = PostTemplateParams<string> &
  CommentSectionStoreParams &
  SimilarPostSectionStoreParams;

//-------------------------------------------------------------------------------------------------------------------

export type HashtagAdapterParams = {
  name: string;
  noOfPosts: number;
  previewUrl: string;
  isFollowing: boolean;
};

export type HashtagGeneralRouteStoreParams = {
  routeId: string;
  lastUpdatedAt: number;
  state: ThunkState;
  hashtag: string;
  data: {
    posts: string[];
    hasEndReached: boolean;
  } | null;
};

export type HashtagStoreParams = EntityState<HashtagAdapterParams> & {
  generalRoutes: Dictionary<HashtagGeneralRouteStoreParams>;
};
//-------------------------------------------------------------------------------------------------------------------

/**
 * represents an account and all the associated parameters
 */
export type AccountAdapterParams = {} & AccountResponseParams;

export type AccountHomeRouteStoreParams = {
  state: ThunkState;
  lastUpdatedAt: number;
  data: {
    suggestedAccounts: string[];
    allPosts: { posts: string[]; hasEndReached: boolean };
  };
};

export type AccountTagsRouteStoreParams = {
  state: ThunkState;
  lastUpdatedAt: number;
  data: {
    posts: string[];
    hasEndReached: boolean;
  };
};

export type AccountPhotosRouteStoreParams = {
  state: ThunkState;
  lastUpdatedAt: number;
  data: {
    posts: string[];
    hasEndReached: boolean;
  };
};

export type AccountMomentsRouteStoreParams = {
  state: ThunkState;
  lastUpdatedAt: number;
  data: {
    posts: string[];
    hasEndReached: boolean;
  };
};

export type AccountProfileRouteStoreParams = {
  routeId: string;
  username: string;
  home: AccountHomeRouteStoreParams;
  taggedPosts: AccountTagsRouteStoreParams;
  photos: AccountPhotosRouteStoreParams;
  moments: AccountMomentsRouteStoreParams;
};

export type AccountStoreParams = EntityState<AccountAdapterParams> & {
  profiles: Dictionary<AccountProfileRouteStoreParams>;
};

/**
 * represents the union of different kinds of chat identifiers
 */
export type ChatItemIdentifierParams =
  | {
      type: "one-to-one";
      username: string;
    }
  | {
      type: "group";
      groupId: string;
    };

/**
 * represents the data of the inbox page
 */
export type InboxStoreParams = {
  chats: ChatItemIdentifierParams[];
  thunkInfo: ThunkInfo;
};

/**
 * represents the union of different kinds of post feed item identifiers
 */
export type PostFeedItemIdentfierParams = {
  type: "post";
  postId: string;
};

/**
 * represents the data params of the home feed
 */
export type HomeFeedStoreParams = {
  state: ThunkState;
  lastUpdatedAt: number;
  data: {
    feed: PostFeedItemIdentfierParams[];
    hasEndReached: boolean;
  };
};

export type SuggestedPhotosFeedStoreParams = {
  state: ThunkState;
  lastUpdatedAt: number;
  data: {
    feed: PostFeedItemIdentfierParams[];
    hasEndReached: boolean;
  };
};

export type SuggestedMomentsFeedStoreParams = {
  state: ThunkState;
  lastUpdatedAt: number;
  data: {
    feed: PostFeedItemIdentfierParams[];
    hasEndReached: boolean;
  };
};

/**
 * represents the logged in account informations
 */
export type LoggedInAccountStoreParams = {
  _id: string;
  username: string;
  profilePictureUrl: string;
  noOfUnseenNotifications: number;
};

/**
 * represents the entire client store params
 */
export type ClientStoreParams = {
  loggedInAccount: LoggedInAccountStoreParams | null;
  theme: "light" | "dark" | "system";
  toasterMsg: { text: string; timestamp: number } | null;
  home: HomeFeedStoreParams;
  foryou: {
    moments: SuggestedMomentsFeedStoreParams;
    photos: SuggestedPhotosFeedStoreParams;
  };
  inbox?: InboxStoreParams;
  isFullScreenActive: boolean;
};
