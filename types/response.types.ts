import { PayloadAction } from "@reduxjs/toolkit";
import {
  AccountParams,
  CommentTemplateParams,
  PostGeneralParams,
  PostVideoParams,
  PhotoWithPreview,
  PostTemplateParams,
  ReplyTemplateParams,
  ThunkError,
  ThunkMeta,
  AudioWithTitle,
  AudioWithUri,
  SearchParams,
  AccountSearchParams,
  HashTagSearchParams,
} from "./utility.types";
import { HashtagAdapterParams, MessageAttachmentParams } from "./store.types";

/**
 * reprsents the abstract type of response params from a thnuk
 */
export type ThunkResponseParams<T = undefined> = {
  data: T;
  error?: ThunkError;
  meta: ThunkMeta;
};

export type PageResponseParams<T extends {}> = {
  data: T[];
  nextPageInfo: {
    hasEndReached: boolean;
    nextId?: string;
    nextTimestamp?: string;
  };
};

export type PageResponseParams2<T extends {}> = {
  data: T[];
  hasEndReached: boolean;
  endCursor: string;
  totalCount: number;
};

/**
 * represents the account response data structure
 * most of the fields are optional because other then username and profile picture, other fields
 * may or may not required in different queries
 */
export type AccountResponseParams = {
  id: string;
  username: string;
  profilePictureUri: string;
  fullname?: string;
  bio?: string | null;
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
export type OutDatedResponseParams2 = PostTemplateParams<AccountResponseParams>;

/**
 * represents all the data the is returned from the server as the initial response of home feed request
 */
export type HomeFeedResponseParams = {
  posts: OutDatedResponseParams2[];
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
  posts: OutDatedResponseParams2[];
};

export type SimilarPostResponseParams =
  ThunkResponseParams<SimilarPostResponseDataParams>;

export type HashtagGeneralRouteResponseParams = {
  hashtag: HashtagAdapterParams;
  topPosts: OutDatedResponseParams2[];
};

export type HashtagRouteThunkParams = {
  routeId: string;
  hashtag: string;
  refresh?: boolean;
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

export type ThunkArg<T> = {
  requestId: string;
} & T;

export type PostScreenResponseParams = {
  posts: OutDatedResponseParams2[];
};

export type PostScreenThunkParams = {
  url: string;
  screenId: string;
  queryParams?: { [key: string]: string };
};

export type LocationScreenResponseParams = {
  id: string;
  name: string;
  fullAddress: string;
  noOfPosts: number;
  posts: OutDatedResponseParams2[];
};

export type LocationScreenThunkParams = {
  locationId: string;
  screenId: string;
};

export type AccountRouteResponseParams = {
  account: AccountResponseParams;
  posts: OutDatedResponseParams2[];
};

export type AccountRouteThunkParams = {
  routeId: string;
  username: string;
  refresh?: boolean;
};

//---------------------------------------------------chat related response types------------------------------------------------

export type MessageResponseParams = {
  id: string;
  body: {
    text?: string;
    attachment?: MessageAttachmentParams;
  };
  createdAt: string;
  author: AccountResponseParams;
  reactions: {
    reactionEmoji: string;
    author: AccountResponseParams;
  }[];
  seenByReceipient: boolean;
};

export type MessagePageResponseParams =
  PageResponseParams2<MessageResponseParams>;

export type ChatResponseParams = {
  id: string;
  receipient: {
    account: AccountResponseParams;
    lastActiveAt?: string;
    isMember: boolean;
    isMessageRequestRestricted: boolean;
  };
  recentMessages?: MessagePageResponseParams;
  joinedAt?: string;
  muted: boolean;
  noOfUnseenMessages: number;
};

export type ChatPageResponseParams = PageResponseParams<ChatResponseParams>;

//--------------------------------------------------------------------------------------------------------------------------

//--------------------------------------------------post response params-----------------------------------------------------

export type PostResponseGeneralParams<T extends {}> = PostGeneralParams<
  {
    author: AccountParams;
  } & T
>;

export type PostPhotoAccountTagResponseParams = {
  account: AccountParams;
  position: [number, number];
};

export type PostPhotoResponseParams = {
  taggedAccounts?: PostPhotoAccountTagResponseParams[];
} & PhotoWithPreview;

export type PhotoPostResponseParams = PostResponseGeneralParams<{
  photos: PostPhotoResponseParams[];
  usedAudio?: AudioWithUri | null;
}>;

export type MomentPostResponseParams = PostResponseGeneralParams<{
  video: PostVideoParams;
  taggedAccounts?: AccountParams[];
  usedAudio?: AudioWithTitle | null;
}>;

export type PostResponseParams =
  | ({ type: "photo-post" } & PhotoPostResponseParams)
  | ({ type: "moment-post" } & MomentPostResponseParams);

export type PostPageResponse = {
  data: PostResponseParams[];
  hasEndReached: boolean;
  endCursor: string;
};

export type QuickSearchResponse = {
  result: SearchParams[];
};

export type AccountSearchResponse = {
  accounts: AccountSearchParams[];
};

export type HashtagSearchResponse = {
  hashtags: HashTagSearchParams[];
};
