import {
  CommentListItemIdentifier,
  MemorySectionParams,
  PageData,
  ReplySectionStoreParams,
} from "./store.types";
import {
  AccountParams,
  ItemKey,
  SendSectionItemIdentifier,
} from "./utility.types";

export type AccountSelectorParams = {
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
  memoryInfo?: {
    hasMemory: boolean;
    hasUnseenMemory: boolean;
    isMemoryAvailable: boolean;
  };
};

export type CommentSelectorParams = {
  id: string;
  postId: string;
  repliedTo?: string;
  text: string;
  author: AccountParams;
  createdAt: string;
  noOfLikes: number;
  isLiked: boolean;
  pinned: boolean;
  noOfUnloadedReplies: number;
  isAuthor: boolean;
  isPostAuthor: boolean;
  isReplyHidden: boolean;
  isReplyLoading: boolean;
  hasLoadedReply: boolean;
};

export type CommentPlaceholderSelectorParams = {
  id: string;
  text: string;
  postId: string;
  repliedTo?: string;
  error: any | null;
  isUploading: boolean;
  noOfUnloadedReplies: number;
  isReplyLoading: boolean;
  author: AccountParams;
};

export type LikeSectionSelectorParams = {
  isError: boolean;
  isLoading: boolean;
  data: {
    allLikes: PageData<ItemKey>;
    filteredAccounts?: ItemKey[];
    engagementSummary: {
      noOfLikes: number;
      noOfViews: number;
    };
  } | null;
};

export type CommentSectionSelectorParams = {
  isLoading: boolean;
  isError: boolean;
  comments: CommentListItemIdentifier[];
};

export type SendSectionItemSelectorParams = {
  secondaryText: string;
  pictureUri: string | [string, string];
} & SendSectionItemIdentifier;

export type SendSectionSelectorParams = {
  isLoading: boolean;
  isError: boolean;
  hasSearchResult: boolean;
  items: SendSectionItemSelectorParams[];
};

export type ReplySectionSelectorParams = {
  noOfReplies: number;
} & ReplySectionStoreParams;

export type GridPostGroupParams = {
  groupId: string;
  posts: string[];
};

export type InboxDirectChatInfoParams = {
  id: string;
  username: string;
  fullname: string;
  profilePictureUri: string;
  canSendMessage: boolean;
};

export type InboxGroupChatInfoParams = {
  id: string;
};

export type InboxChatInfoParams =
  | ({
      type: "direct";
    } & InboxDirectChatInfoParams)
  | ({ type: "group-solid" } & InboxGroupChatInfoParams);

export type MemorySectionSelectorParams = {
  account: AccountParams;
  memorySection?: MemorySectionParams;
};

export type GeneralDataFetchSelectorParams<T> = {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  isExpired: boolean;
};

export type PageDataSelectorParams<T> = {
  items: T[];
  hasEndReached: boolean;
};

export type PaginatedDataFetchSelectorParams<T> = {
  isPageLoading: boolean;
} & GeneralDataFetchSelectorParams<PageDataSelectorParams<T>>;
