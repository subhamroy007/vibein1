import { PayloadAction } from "@reduxjs/toolkit";
import {
  CommentTemplateParams,
  PostTemplateParams,
  ReplyTemplateParams,
  ThunkError,
  ThunkMeta,
} from "./utility.types";

/**
 * reprsents the abstract type of response params from a thnuk
 */
export type ThunkResponseParams<T = undefined> = {
  data: T;
  error?: ThunkError;
  meta: ThunkMeta;
};

/**
 * represents the account response data structure
 * most of the fields are optional because other then username and profile picture, other fields
 * may or may not required in different queries
 */
export type AccountResponseParams = {
  _id: string;
  username: string;
  profilePictureUrl: string;
  fullname?: string;
  noOfFollowers?: number;
  isAvailable?: boolean;
  isActive?: boolean;
  isBlocked?: boolean;
  isMemoryHidden?: boolean;
  isFollowing?: boolean;
  hasRequestedToFollow?: boolean;
  isPrivate?: boolean;
  isFollowed?: boolean;
  isFollowRequestPending?: boolean;
  isFavourite?: boolean;
};

/**
 * represents a single reply object that is fetched from the server
 */
export type ReplyResponseParams = ReplyTemplateParams<AccountResponseParams>;

/**
 * represents a single comment object that is fetched from the server
 * along with other informations, a comment may or may not have some replies sent with it
 */
export type CommentResponseParams = {
  replies?: ReplyResponseParams[];
} & CommentTemplateParams<AccountResponseParams>;

/**
 * represents a single post object that is returned from the server as a post response
 */
export type PostResponseParams = PostTemplateParams<AccountResponseParams>;

/**
 * represents all the data the is returned from the server as the initial response of home feed request
 */
export type HomeFeedResponseParams = {
  posts: PostResponseParams[];
};

/**
 * reprsents the data params of the intial request of a post comment section
 */
export type CommentSectionResponseDataParams = {
  comments: CommentResponseParams[];
};

export type CommentSectionResponseParams =
  ThunkResponseParams<CommentSectionResponseDataParams>;

/**
 * reprsents the data params of the request of a comment replies section
 */
export type ReplySectionResponseDataParams = {
  replies: ReplyResponseParams[];
};

export type ReplySectionResponseParams =
  ThunkResponseParams<ReplySectionResponseDataParams>;

/**
 * reprsents the data params of the similar posts requests
 */
export type SimilarPostResponseDataParams = {
  posts: PostResponseParams[];
};

export type SimilarPostResponseParams =
  ThunkResponseParams<SimilarPostResponseDataParams>;

export type HashTagPageResponseParams = {
  hashtag: string;
  noOfPosts: number;
  posts: PostResponseParams[];
};

export type FulFilledActionParams<T, U = void | {}> = PayloadAction<
  T,
  string,
  {
    arg: ThunkArg<U>;
    requestId: string;
    requestStatus: "fulfilled";
  } & ThunkMeta,
  never
>;

export type HashtagPageRequestParams = {
  hashtag: string;
};

export type ThunkArg<T> = {
  requestId: string;
} & T;
