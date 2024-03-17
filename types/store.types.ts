import { Dictionary, EntityState } from "@reduxjs/toolkit";
import { AccountResponseParams } from "./response.types";
import {
  CommentTemplateParams,
  PostGeneralParams,
  PostVideoParams,
  PhotoWithPreview,
  PostTemplateParams,
  ReplyTemplateParams,
  ThunkError,
  AudioWithTitle,
  AudioWithUri,
  SearchParams,
  AccountSearchParams,
  HashTagSearchParams,
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
export type OutdatedParam23 = PostTemplateParams<string> &
  CommentSectionStoreParams &
  SimilarPostSectionStoreParams;

export type PostPhotoAccountTagAdapterParams = {
  account: string;
  position: [number, number];
};

export type PostPhotoAdapterParams = {
  taggedAccounts?: PostPhotoAccountTagAdapterParams[];
} & PhotoWithPreview;

export type PostAdapterGeneralParams<T extends {}> = PostGeneralParams<
  {
    author: string;
  } & T
>;

export type PhotoPostAdapterParams = PostAdapterGeneralParams<{
  photos: PostPhotoAdapterParams[];
  usedAudio?: AudioWithUri | null;
}>;

export type MomentPostAdapterParams = PostAdapterGeneralParams<{
  video: PostVideoParams;
  taggedAccounts?: string[];
  usedAudio?: AudioWithTitle | null;
}>;

export type PostAdapterParams =
  | ({ type: "photo-post" } & PhotoPostAdapterParams)
  | ({ type: "moment-post" } & MomentPostAdapterParams);

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
export type ChatItemIdentifierParams = {
  type: "group-solid" | "direct";
  chatId: string;
};

/**
 * represents the data of the inbox page
 */
export type InboxStoreParams = {
  state: ThunkState;
  lastUpdatedAt: number;
  chats: ChatItemIdentifierParams[];
  nextPageInfo: {
    hasEndReached: boolean;
    nextId?: string;
    nextTimestamp?: string;
  };
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
  id: string;
  username: string;
  profilePictureUri: string;
  noOfUnseenNotifications: number;
};

export type PageDataRouteParams<T> = {
  data: {
    items: T[];
    hasEndReached: boolean;
    endCursor: string;
  };
  isLoading: boolean;
  createdAt: number;
  failedToRefresh: boolean;
  error: any | null;
};

export type PostPageDataRouteParams = PageDataRouteParams<PostItemIdentifier>;

export type PostSuggestionsDataRouteParams = {
  seed: PostItemIdentifier;
} & PostPageDataRouteParams;

/**
 * represents the entire client store params
 */
export type ClientStoreParams = {
  loggedInAccount: LoggedInAccountStoreParams | null;
  theme: "light" | "dark" | "system";
  notification: { msg: string; dispatchedAt: number };
  home: RefreshablePostDataRouteParams;
  foryou: {
    moments: RefreshablePostDataRouteParams;
    photos: RefreshablePostDataRouteParams;
  };
  inbox: InboxStoreParams;
  isDarkScreenFocused: boolean;
  isMediaMuted: boolean;
  explore: {
    feed: RefreshablePostDataRouteParams;
    post_suggestions: Dictionary<PostSuggestionsDataRouteParams>;
  };
  searchSection: {
    quickSearch: BasicDataRouteParams<Dictionary<SearchParams[]>>;
    fullSearch: {
      searchPhase: string;
      accountSearchResults: BasicDataRouteParams<SearchParams[] | null>;
      hashtagSearchResults: BasicDataRouteParams<SearchParams[] | null>;
      postSearchResults: PostDataRouteParams;
    } | null;
    searchHistory: SearchParams[];
  };
};

export type PageData<T> = {
  items: T[];
  hasEndReached: boolean;
  endCursor: string;
};

export type BasicDataRouteParams<T> = {
  data: T;
  error: any | null;
  isLoading: boolean;
};

export type RefreshablePostDataRouteParams =
  RefreshableDataRouteParams<PageData<PostItemIdentifier> | null>;

export type PostDataRouteParams =
  BasicDataRouteParams<PageData<PostItemIdentifier> | null>;

export type RefreshableDataRouteParams<T> = {
  failedToRefresh: boolean;
} & BasicDataRouteParams<T>;

export type PostItemIdentifier = {
  type: "photo-post" | "moment-post";
  id: string;
};

//-----------------------------------------------------inbox store types------------------------------------------------------------

export type ChatAdapterParams = {
  id: string;
  receipient: {
    username: string;
    lastActiveAt?: string;
    typing: boolean;
    isMember: boolean;
    isMessageRequestRestricted: boolean;
  };
  messages: {
    data: string[];
    state: ThunkState;
    hasEndReached: boolean;
    endCursor: string;
    totalCount: number;
  };
  joinedAt?: string;
  muted: boolean;
  noOfUnseenMessages: number;
  state: ThunkState;
};

export type MessageMediaAttachmentParams = {
  url: string;
  width: number;
  height: number;
} & ({ type: "photo" } | { type: "video"; duration: number; poster: string });

export type MessageAttachmentParams = {
  type: "media";
  media: MessageMediaAttachmentParams[];
};

export type MessageAdapterParams = {
  id: string;
  body: {
    text?: string;
    attachment?: MessageAttachmentParams;
  };
  createdAt: string;
  author: string;
  reactions: { reactionEmoji: string; author: string }[];
  seenByReceipient: boolean;
  state: ThunkState;
};

export type ChatStoreParams = {
  chats: EntityState<ChatAdapterParams>;
  messages: EntityState<MessageAdapterParams>;
};
