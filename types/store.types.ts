import { Dictionary, EntityState } from "@reduxjs/toolkit";
import { AccountResponseParams, MemoryResponseParams } from "./response.types";
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
  HashTagSearchParams,
  ItemKey,
  AccountParams,
  MessageMediaAttachmentParams,
} from "./utility.types";
import { ChatItemIdentifierParams } from "./selector.types";

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
export type Datal = ReplyTemplateParams<string>;

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
export type Comment1 = CommentTemplateParams<string> & ReplySectionStoreParams;

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

export type CommentItemIdentifier = {
  isPlaceHolder: boolean;
  isFirstLoadedReply: boolean;
  isLastReplyItem: boolean;
} & ItemKey;

export type CommentSectionParams = {
  createdAt: number;
  pending: ItemKey[];
  uploaded: ItemKey[];
  fetched: PageData<ItemKey>;
};

export type PostPhotoAccountTagAdapterParams = {
  account: string;
  position: [number, number];
};

export type PostPhotoAdapterParams = {
  taggedAccounts?: PostPhotoAccountTagAdapterParams[];
} & PhotoWithPreview;

export type LikeSectionParams = {
  createdAt: number;
  expiresAt: number;
  allLikes: PageData<ItemKey>;
};

export type PostAdapterGeneralParams<T extends {}> = PostGeneralParams<
  {
    author: string;
    commentSection: CommentSectionParams | null;
    likeSection: LikeSectionParams | null;
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

export type CommentAdapterParams = {
  id: string;
  postId: string;
  repliedTo?: string;
  text: string;
  author: string;
  createdAt: string;
  noOfLikes: number;
  isLiked: boolean;
  noOfReplies: number;
  pinned: boolean;
  replySection: CommentSectionParams | null;
};

export type CommentPlaceholderParams = {
  id: string;
  text: string;
  postId: string;
  repliedTo?: string;
  error: ThunkError | null;
  isUploading: boolean;
};

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
  userId: string;
  home: AccountHomeRouteStoreParams;
  taggedPosts: AccountTagsRouteStoreParams;
  photos: AccountPhotosRouteStoreParams;
  moments: AccountMomentsRouteStoreParams;
};

export type AccountStoreParams = EntityState<AccountAdapterParams> & {
  profiles: Dictionary<AccountProfileRouteStoreParams>;
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

export type InboxParams = { chats: ItemKey[]; noOfMessageRequests: number };

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
  userId: string;
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

export type SendSectionSearchResultParams = {
  lastSearchPhase: string | null;
} & BasicDataRouteParams<Dictionary<AccountParams[]>>;

/**
 * represents the entire client store params
 */
export type ClientStoreParams = {
  loggedInAccount: LoggedInAccountStoreParams | null;
  accountAndHashtagSearchSection: BasicDataRouteParams<{
    accountSection: Dictionary<AccountParams[]>;
    hashtagSection: Dictionary<HashTagSearchParams[]>;
  }> & { lastSearchedPhase: string | null };
  theme: "light" | "dark" | "system";
  notification: { msg: string; dispatchedAt: number } | null;
  home: HomeFeedParams;
  foryou: {
    moments: RefreshablePostDataRouteParams;
    photos: RefreshablePostDataRouteParams;
  };
  suggestedAccounts?: AccountParams[];
  sendSectionSearchResult: SendSectionSearchResultParams;
  inbox: InboxParams | null;
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

export type GeneralDataFetchParams<T> = {
  data: T | null;
  error: any | null;
  isLoading: boolean;
  createdAt: number;
  expiresAt: number;
};

export type PaginatedDataFetchParams<T> = {
  isPageLoading: boolean;
} & GeneralDataFetchParams<PageData<T>>;

export type MemoryAccountStoreParams = {
  poster: string;
} & ItemKey;

export type HomeFeedParams = {
  memoryAccounts: PaginatedDataFetchParams<MemoryAccountStoreParams>;
  posts: PaginatedDataFetchParams<ItemKey>;
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

export type CommentListItemIdentifier = {
  type: "comment" | "placeholder";
  isLastReply: boolean;
} & ItemKey;

export type ReplyDataParams =
  BasicDataRouteParams<PageData<CommentListItemIdentifier> | null> & {
    commentId: string;
    isReplyHidden: boolean;
    noOfPendingReplies: number;
  };

export type TopLevelCommentParams =
  | ({ type: "comment" } & ReplyDataParams)
  | { type: "placeholder"; id: string };

export type CommentDataParams =
  BasicDataRouteParams<PageData<TopLevelCommentParams> | null> & {
    postId: string;
  };

export type CommentRouteParams = Dictionary<CommentDataParams>;

//-----------------------------------------------------chat store types------------------------------------------------------------

export type MessageItemIdentitfier = {
  isPlaceHolder: boolean;
} & ItemKey;

export type MessageAdapterAttachmentParams =
  | { type: "post"; post: string }
  | { type: "media"; media: MessageMediaAttachmentParams[] };

export type MessageAdapterReactionParams = {
  account: string;
  emoji: string;
};

export type MessageAdapterParams = {
  id: string;
  author: string;
  sentTo: string;
  uploadedAt: number;
  reactions: MessageAdapterReactionParams[];
  seenBy: string[];
  text?: string;
  attachment?: MessageAdapterAttachmentParams;
};

export type MessagePlaceHolderParams = {
  id: string;
  sentTo: string;
  createdAt: number;
  text?: string;
  attachment?: MessageAdapterAttachmentParams;
  error: ThunkError | null;
  isSending: boolean;
};

export type OneToOneChatAdapterReceipientParams = {
  account: string;
  lastSeenAt?: number;
  isMember: boolean;
};

export type OneToOneChatAdapterParams = {
  id: string;
  joinedAt: number;
  isMember: boolean;
  isMuted: boolean;
  receipient: OneToOneChatAdapterReceipientParams;
  messages: PageData<MessageItemIdentitfier>;
  noOfUnseenMessages: number;
};

export type GroupChatAdapterReceipientParams = {
  account: string;
  isMember: boolean;
  isAdmin: boolean;
  joinedAt: number;
};

export type GroupChatAdapterParams = {
  id: string;
  joinedAt: number;
  invitedBy?: string;
  isMember: boolean;
  isMuted: boolean;
  name: string;
  posterUri?: string;
  receipients: GroupChatAdapterReceipientParams[];
  messages: PageData<MessageItemIdentitfier>;
  noOfUnseenMessages: number;
};

export type ChatAdapterParams =
  | ({ type: "one-to-one" } & OneToOneChatAdapterParams)
  | ({ type: "group" } & GroupChatAdapterParams);

//---------------------------------------memory related store types-----------------------------------------------------

export type MemoryAdapterParams = {
  views: null;
  replies: null;
} & MemoryResponseParams;

//---------------------------------------account related store types---------------------------------------------------

export type MemorySectionParams = BasicDataRouteParams<ItemKey[] | null>;

export type AccountAdapeterParams = {
  memorySection?: MemorySectionParams;
} & AccountParams;

export type AccountProfileSectionParams = {
  userId: string;
  createdAt: number;
  expiresAt: number;
  allPosts: PageData<ItemKey> | null;
  taggedPosts: PageData<ItemKey> | null;
  photos: PageData<ItemKey> | null;
  moments: PageData<ItemKey> | null;
  relatedAccounts: {
    followings: PageData<ItemKey> | null;
    followers: {
      allAccounts: PageData<ItemKey>;
      searchedAccounts: Dictionary<ItemKey[]>;
    } | null;
    suggested: PageData<ItemKey> | null;
  };
};

export type HashTagRouteParams = {
  name: string;
  noOfPosts: number;
  createdAt: number;
  expiresAt: number;
  topPosts: PageData<ItemKey>;
};

export type LocationRouteParams = {
  name: string;
  noOfPosts: number;
  createdAt: number;
  expiresAt: number;
  topPosts: PageData<ItemKey>;
};

export type AudioRouteParams = {
  createdAt: number;
  expiresAt: number;
  id: string;
  photos: PageData<ItemKey> | null;
  moments: PageData<ItemKey>;
};
