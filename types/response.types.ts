import {
  CommentTemplateParams,
  PostTemplateParams,
  ReplyTemplateParams,
} from "./utility.types";

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
 * reprsents the fields of the comment section of a post sent by the server
 */
export type CommentSectionResponseParams = {
  comments: CommentResponseParams[];
};
