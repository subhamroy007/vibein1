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
  replySectionThunkInfo: ThunkInfo | null;
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
  commentSectionThunkInfo: ThunkInfo | null;
};

/**
 * represents a post and all the associated parameters
 */
export type PostAdapterParams = PostTemplateParams<string> &
  CommentSectionStoreParams;

/**
 * represents an account and all the associated parameters
 */
export type AccountAdapterParams = AccountResponseParams;

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
  thunkInfo: ThunkInfo | null;
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
  memoryAuthors: string[];
  posts: PostFeedItemIdentfierParams[];
  thunkInfo: ThunkInfo;
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
  loggedInAccount?: LoggedInAccountStoreParams;
  theme?: "light" | "dark" | "system";
  toasterMsg?: { text: string; timestamp: number };
  homeFeed?: HomeFeedStoreParams;
  inbox?: InboxStoreParams;
};
