import { AccountResponseParams } from "./response.types";
import {
  CommentTemplateParams,
  PostTemplateParams,
  ReplyTemplateParams,
} from "./utility.types";

/**
 * represents different states of thunk processing
 */
export type ThunkState = "idle" | "loading" | "failed" | "success";

/**
 * represents the error object returned by the thunk in case of the promise is rejected
 */
export type ThunkError = {
  errorCode: number;
  message: string;
};

/**
 * represents the type of a general thunk data structure
 */
export type ThunkData<T = undefined> = {
  state: ThunkState;
  data: T;
  meta: {
    requestTimestamp: string | null;
  };
  lastError: ThunkError | null;
};

/**
 * represents a reply of a comment
 */
export type ReplyAdapterParams = ReplyTemplateParams<string>;

/**
 * represents the reply section of a comment
 */
export type ReplySectionStoreParams = ThunkData<{
  replies: string[];
}>;

/**
 * represents a comment of a post
 */
export type CommentAdapterParams = CommentTemplateParams<string> & {
  replySection: ReplySectionStoreParams;
};

/**
 * represents the comment section of a post
 */
export type CommentSectionStoreParams = ThunkData<{
  comments: string[];
}>;

/**
 * represents a post and all the associated parameters
 */
export type PostAdapterParams = {
  commentSection?: CommentSectionStoreParams;
} & PostTemplateParams<string>;

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
      accountId: string;
    }
  | {
      type: "group";
      groupId: string;
    };

/**
 * represents the data of the inbox page
 */
export type InboxStoreDataParams = {
  chats: ChatItemIdentifierParams[];
};

/**
 * represents the inbox page store params
 */
export type InboxStoreParams = ThunkData<InboxStoreDataParams>;

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
export type HomeFeedStoreDataParams = {
  feed: PostFeedItemIdentfierParams[];
};

/**
 * represents the store params of the home feed
 */
export type HomeFeedStoreParams = ThunkData<HomeFeedStoreDataParams>;

/**
 * represents the logged in account informations
 */
export type LoggedInAccountStoreParams = {
  id: string;
  noOfUnseenNotifications: number;
};

/**
 * represents the entire client store params
 */
export type ClientStoreParams = {
  loggedInAccount: LoggedInAccountStoreParams;
  theme: "light" | "dark" | "system";
  toasterMsg: { text: string; timestamp: number } | null;
  homeFeed: HomeFeedStoreParams;
  inbox: InboxStoreParams;
};
