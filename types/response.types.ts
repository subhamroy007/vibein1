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
  HashTagSearchParams,
  AudioParams,
  MessageMediaAttachmentParams,
} from "./utility.types";

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
 * most of the fields are optional because other then userId and profile picture, other fields
 * may or may not required in different queries
 */
export type AccountResponseParams = {
  id: string;
  userId: string;
  profilePictureUri: string;
  name?: string;
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
export type Comment2 = {
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
  comments: Comment2[];
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
  userId: string;
  refresh?: boolean;
};

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

export type CommentResponseParams = {
  id: string;
  postId: string;
  repliedTo?: string;
  text: string;
  author: AccountParams;
  createdAt: string;
  noOfLikes: number;
  isLiked: boolean;
  noOfReplies: number;
  pinned: boolean;
};

export type MemoryAccountResponseParams = {
  poster: string;
  account: AccountParams;
};

export type GeneralPaginatedResponse<T> = {
  items: T[];
  hasEndReached: boolean;
  endCursor: string;
};

export type PostPaginatedResponse =
  GeneralPaginatedResponse<PostResponseParams>;

export type PhotoPostPaginatedResponse =
  GeneralPaginatedResponse<PhotoPostResponseParams>;

export type MomentPostPaginatedResponse =
  GeneralPaginatedResponse<MomentPostResponseParams>;

export type AccountPaginatedResponse = GeneralPaginatedResponse<AccountParams>;

export type MemoryAccountPaginatedResponse =
  GeneralPaginatedResponse<MemoryAccountResponseParams>;

export type PostPageResponse = {
  data: PostResponseParams[];
  hasEndReached: boolean;
  endCursor: string;
};

export type AccountPageResponse = PageResponse<AccountParams>;

export type PostLikeAuthor = { likedAt: string } & AccountParams;

export type PageResponse<T> = {
  items: T[];
  hasEndReached: boolean;
  endCursor: string;
};

export type PostLikeAuthorPageResponse = PageResponse<PostLikeAuthor>;

export type PostLikeSectionResponseParams = {
  engagementSummary?: {
    noOfLikes: number;
    noOfViews: number;
  };
  likes: PostLikeAuthorPageResponse;
};

export type CommentPageResponse = {
  items: CommentResponseParams[];
  hasEndReached: boolean;
  endCursor: string;
};

export type QuickSearchResponse = {
  result: SearchParams[];
};

export type HashtagSearchResponse = {
  hashtags: HashTagSearchParams[];
};

export type AccountSearchResponse = {
  accounts: AccountParams[];
};

//---------------------------------------memory related types----------------------------------------

export type MemoryCaptionParams = {
  text: string;
  color: string;
  style: string;
  scale: number;
  rotation: number;
  position: [number, number];
};

export type MemoryContentParams =
  | {
      type: "photo";
      uri: string;
      previewUri: string;
      blurhash: string;
    }
  | { type: "video"; uri: string; poster: { uri: string; blurhash: string } };

export type MemoryResponseParams = {
  id: string;
  createdAt: string;
  content: MemoryContentParams;
  metadata: {
    isLiked: boolean;
    isSeen: boolean;
  };
  audio?: AudioWithTitle | null;
};

export type AccountMemoryFetchResponseParams = {
  memories: MemoryResponseParams[];
  account: AccountParams;
};

export type AccountSectionResponseParams = {
  account: AccountParams;
  recentPosts?: PostPaginatedResponse;
};

export type HashtagRouteResponseParams = {
  name: string;
  noOfPosts: number;
  topPosts?: PostPaginatedResponse;
};

export type LocationRouteResponseParams = {
  name: string;
  noOfPosts: number;
  topPosts?: PostPaginatedResponse;
};

export type AudioRouteResponseParams = {
  audio: AudioParams;
  moments?: PostPaginatedResponse;
};

//---------------------------------------------------chat related response types------------------------------------------------

export type MessageResponseAttachmentParams =
  | { type: "post"; post: PostResponseParams }
  | { type: "media"; media: MessageMediaAttachmentParams[] };

export type MessageResponseReactionParams = {
  account: AccountParams;
  emoji: string;
};

export type MessageResponseParams = {
  id: string;
  author: AccountParams;
  sentTo: string;
  uploadedAt: number;
  reactions: MessageResponseReactionParams[];
  seenBy: AccountParams[];
  text?: string;
  attachment?: MessageResponseAttachmentParams;
};

export type MessagePaginatedResponse = PageResponse<MessageResponseParams>;

export type OneToOneChatResponseReceipientParams = {
  account: AccountParams;
  lastSeenAt?: number;
  isMember: boolean;
};

export type OneToOneChatResponseParams = {
  id: string;
  joinedAt: number;
  isMember: boolean;
  isMuted: boolean;
  receipient: OneToOneChatResponseReceipientParams;
  recentMessages?: MessagePaginatedResponse;
  noOfUnseenMessages: number;
};

export type GroupChatResponseReceipientParams = {
  account: AccountParams;
  isMember: boolean;
  isAdmin: boolean;
  joinedAt: number;
};

export type GroupChatResponseParams = {
  id: string;
  joinedAt: number;
  invitedBy?: string;
  isMember: boolean;
  isMuted: boolean;
  name: string;
  posterUri?: string;
  receipients: GroupChatResponseReceipientParams[];
  recentMessages?: MessagePaginatedResponse;
  noOfUnseenMessages: number;
};

export type ChatResponseParams =
  | ({ type: "one-to-one" } & OneToOneChatResponseParams)
  | ({ type: "group" } & GroupChatResponseParams);
