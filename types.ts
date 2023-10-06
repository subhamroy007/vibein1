import { AppDispatch, RootState } from "./store";

type AccountAssociatedLink = {
  title: string;
  url: string;
};

export interface AccountAdapterParams {
  _id: string;
  username: string;
  fullname?: string;
  profilePictureUrl: string;
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
  memeoryStatus?: "unseen" | "seen" | "none";
}

export type AccountResponseParams = {
  _id: string;
  username: string;
  fullname?: string;
  profilePictureUrl: string;
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
  memeoryStatus?: "unseen" | "seen" | "none";
};

export interface PostSelectorParams {
  createdBy: AccountAdapterParams;
  _id: string;
  isPinned: boolean;
  createdAt: string;
  isUpdated: boolean;
  caption?: string;
  postType: "photo";
  photos: PostPhotoParams[];
  taggedLocation?: {
    name: string;
    _id: string;
  };
  taggedAccounts?: string[];
  advancedOptions: {
    hideEngagementCount: boolean;
    commentSetting: "disabled" | "following" | "all";
    disableCirculation: boolean;
    disableSharing: boolean;
  };
  engagementSummary: {
    noOfLikes: number;
    noOfViews: number;
    noOfComments: number;
  };
  isViewed: boolean;
  isLiked: boolean;
  isSaved: boolean;
}

export type AccountField =
  | "no-of-followers"
  | "is-following"
  | "has-requested-to-follow"
  | "is-followed"
  | "fullname"
  | "is-private"
  | "is-favourite";

export type PostPhotoParams = {
  url: string;
  width: number;
  height: number;
  aspectRatio: string;
  previewUrl: string;
};

export type PostResponseParams = {
  _id: string;
  isPinned: boolean;
  createdBy: AccountResponseParams;
  createdAt: string;
  isUpdated: boolean;
  caption?: string;
  postType: "photo";
  photos: PostPhotoParams[];
  taggedLocation?: {
    name: string;
    _id: string;
  };
  taggedAccounts?: AccountResponseParams[];
  advancedOptions: {
    hideEngagementCount: boolean;
    commentSetting: "disabled" | "following" | "all";
    disableCirculation: boolean;
    disableSharing: boolean;
  };
  engagementSummary: {
    noOfLikes: number;
    noOfViews: number;
    noOfComments: number;
  };
  isViewed: boolean;
  isLiked: boolean;
  isSaved: boolean;
};

export type PostAdapterParams = {
  _id: string;
  isPinned: boolean;
  createdBy: string;
  createdAt: string;
  isUpdated: boolean;
  caption?: string;
  postType: "photo";
  photos: PostPhotoParams[];
  taggedLocation?: {
    name: string;
    _id: string;
  };
  taggedAccounts?: string[];
  advancedOptions: {
    hideEngagementCount: boolean;
    commentSetting: "disabled" | "following" | "all";
    disableCirculation: boolean;
    disableSharing: boolean;
  };
  engagementSummary: {
    noOfLikes: number;
    noOfViews: number;
    noOfComments: number;
  };
  isViewed: boolean;
  isLiked: boolean;
  isSaved: boolean;
  commentSection?: CommentSectionParams;
};

export type CommentAdapterParams = {
  _id: string;
  content: string;
  createdBy: string;
  createdAt: string;
  noOfLikes: number;
  isLiked: boolean;
  isPinned: boolean;
  noOfReplies: number;
  replySection: ReplySectionParams;
};

export type CommentResponseParams = {
  _id: string;
  content: string;
  createdBy: AccountResponseParams;
  createdAt: string;
  noOfLikes: number;
  noOfReplies: number;
  isLiked: boolean;
  isPinned: boolean;
};

export type CommentSelectorParams = {
  _id: string;
  content: string;
  createdBy: AccountAdapterParams;
  createdAt: string;
  noOfLikes: number;
  isLiked: boolean;
  isPinned: boolean;
  isClientAuthorOfComment: boolean;
};

export type ReplySectionSelectorParams = {
  noOfReplies: number;
} & ReplySectionParams;

export type IconName =
  | "home-outline"
  | "home-solid"
  | "heart-outline"
  | "heart-solid"
  | "search-regular"
  | "search-bold"
  | "bookmark-outline"
  | "bookmark-solid"
  | "comment"
  | "more-horiz"
  | "more-vert"
  | "send-outline"
  | "send-solid"
  | "star-outline"
  | "star-solid"
  | "tag-outline"
  | "tag-solid"
  | "close"
  | "hashtag"
  | "mention"
  | "retry"
  | "tick"
  | "add"
  | "remove"
  | "tick-circle-outline"
  | "tick-circle-solid"
  | "add-circle-outline"
  | "add-circle-solid"
  | "close-circle-outline"
  | "close-circle-solid"
  | "arrow-up"
  | "arrow-down"
  | "arrow-left"
  | "arrow-right"
  | "radio-unchecked"
  | "explore"
  | "report"
  | "delete"
  | "pin-solid"
  | "pin-outline"
  | "edit"
  | "link"
  | "share"
  | "circulate";

export type HashtagResponseParams = {
  name: string;
  noOfPosts: number;
};

export type LoggedInAccountStoreParams = {
  id: string;
  noOfUnseenNotifications: number;
};

export type FeedItemParams = {
  type: "post";
  postId: string;
};

export type FetchState = "idle" | "loading" | "failed" | "success";

export type ChatListItemParams = {
  type: "one-to-one";
  accountId: string;
};

export type InboxStoreDataParams = {
  chats: ChatListItemParams[];
};

export type InboxStoreParams = {
  data: InboxStoreDataParams;
  state: FetchState;
};

export type PageData<T = undefined> = {
  state: FetchState;
  data: T;
  meta: {
    requestTimestamp: string | null;
  };
  lastError: ThunkError | null;
};

export type HomeFeedStoreParams = PageData<{ feedItems: FeedItemParams[] }>;

export type ClientStoreParams = {
  loggedInAccount: LoggedInAccountStoreParams;
  theme: "light" | "dark" | "system";
  homeFeed: HomeFeedStoreParams;
  inbox: InboxStoreParams;
};

export type RepyListItemParams = {
  type: "reply";
  replyId: string;
};

export type ReplySectionParams = PageData<{
  replies: RepyListItemParams[];
}>;

export type CommentListItemParams = {
  type: "comment";
  commentId: string;
};

export type CommentSectionParams = PageData<{
  comments: CommentListItemParams[];
}>;

export type ThunkError = {
  errorCode: number;
  message: string;
};

export type AsyncThunkConfig = {
  /** return type for `thunkApi.getState` */
  state: RootState;
  /** type for `thunkApi.dispatch` */
  dispatch: AppDispatch;
  /** type of the `extra` argument for the thunk middleware, which will be passed in as `thunkApi.extra` */
  extra?: unknown;
  /** type to be passed into `rejectWithValue`'s first argument that will end up on `rejectedAction.payload` */
  rejectValue: ThunkError;
  /** return type of the `serializeError` option callback */
  serializedErrorType?: unknown;
  /** type to be returned from the `getPendingMeta` option callback & merged into `pendingAction.meta` */
  pendingMeta?: unknown;
  /** type to be passed into the second argument of `fulfillWithValue` to finally be merged into `fulfilledAction.meta` */
  fulfilledMeta?: unknown;
  /** type to be passed into the second argument of `rejectWithValue` to finally be merged into `rejectedAction.meta` */
  rejectedMeta?: unknown;
};

export type HomeFeedResponseParams = {
  posts: PostResponseParams[];
};

export type CommentSectionResponseParams = {
  comments: CommentResponseParams[];
};
