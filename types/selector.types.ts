import {
  CommentItemIdentifier,
  CommentListItemIdentifier,
  MemorySectionParams,
  PageData,
  ReplySectionStoreParams,
} from "./store.types";
import { AccountParams, ItemKey, ThunkError } from "./utility.types";

export type AccountSelectorParams = {
  id: string;
  userId: string;
  profilePictureUri: string;
  isClient: boolean;
  name?: string;
  bio?: string;
  noOfPosts?: number;
  noOfTaggedPosts?: number;
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
  muteSettings?: {
    post: boolean;
    memory: boolean;
  };
  notificationSettings?: {
    memory: boolean;
    photo: boolean;
    moment: boolean;
  };
  memoryInfo?: {
    hasMemory: boolean;
    hasUnseenMemory: boolean;
    isMemoryAvailable: boolean;
  };
  postMeta?: {
    hasPhotos: boolean;
    hasMoments: boolean;
  };
};

export type AccountSectionSelectorParams =
  GeneralDataFetchSelectorParams<AccountSelectorParams>;

export type CommentSelectorParams = {
  id: string;
  postId: string;
  repliedTo?: string;
  text: string;
  author: AccountSelectorParams;
  isClientPostAuthor: boolean;
  createdAt: string;
  noOfLikes: number;
  isLiked: boolean;
  pinned: boolean;
  noOfHiddenReplies: number; //this number is a combination of loaded and unloaded replies
  hasLoadedReply: boolean;
};

export type CommentPlaceholderSelectorParams = {
  id: string;
  text: string;
  postId: string;
  repliedTo?: string;
  error: ThunkError | null;
  isUploading: boolean;
  noOfHiddenReplies: number; //this number is a combination of loaded and unloaded replies
  author: AccountParams;
};

export type LikeSectionSelectorParams = {
  createdAt: number;
  expiresAt: number;
  allLikes: PageData<ItemKey>;
  engagementSummary: { noOfLikes: number; noOfViews: number };
};

export type CommentSectionSelectorParams = {
  createdAt: number;
} & PageDataSelectorParams<CommentItemIdentifier>;

export type OneToOneChatSelectorParams = {
  type: "one-to-one";
  id: string;
  userId: string;
  name: string;
  profilePictureUri: string;
};

export type GroupChatSelectorParams = {
  type: "group";
  id: string;
  name: string;
  members: {
    name: string;
    profilePictureUri: string;
  }[];
};

export type ChatItemIdentifierParams = {
  type: "group" | "one-to-one";
  id: string;
};

export type ChatItemSelectorParams =
  | OneToOneChatSelectorParams
  | GroupChatSelectorParams;

export type SendSectionSelectorParams = {
  inboxAndSuggested: ChatItemSelectorParams[];
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
  userId: string;
  name: string;
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
