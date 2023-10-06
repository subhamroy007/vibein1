/**
 * represents a single photo of a post
 */
export type PostPhotoParams = {
  url: string;
  width: number;
  height: number;
  aspectRatio: string;
  previewUrl: string;
};

/**
 * represents the configurable settings of a post
 */
export type PostAdvancedOptionParams = {
  hideEngagementCount: boolean;
  commentSetting: "disabled" | "following" | "all";
  disableCirculation: boolean;
  disableSharing: boolean;
};

/**
 * represents all engagement counts of a post
 */
export type PostEngagementParams = {
  noOfLikes: number;
  noOfViews: number;
  noOfComments: number;
};

/**
 * represents a post template that can be used as adapter type and/or response type
 */
export type PostTemplateParams<T> = {
  _id: string;
  isPinned: boolean;
  createdBy: T;
  createdAt: string;
  isUpdated: boolean;
  caption?: string;
  postType: "photo";
  photos: PostPhotoParams[];
  taggedLocation?: {
    name: string;
    _id: string;
  };
  taggedAccounts?: T[];
  advancedOptions: PostAdvancedOptionParams;
  engagementSummary: PostEngagementParams;
  isViewed: boolean;
  isLiked: boolean;
  isSaved: boolean;
};

/**
 * represents a reply template that can be used as adapter type and/or response type
 */
export type ReplyTemplateParams<T> = {
  _id: string;
  content: string;
  createdBy: T;
  createdAt: string;
  noOfLikes: number;
  isLiked: boolean;
};

/**
 * represents a comment template that can be used as adapter type and/or response type
 */
export type CommentTemplateParams<T> = {
  isPinned: boolean;
  noOfReplies: number;
} & ReplyTemplateParams<T>;

export type AccountField =
  | "no-of-followers"
  | "is-following"
  | "has-requested-to-follow"
  | "is-followed"
  | "fullname"
  | "is-private"
  | "is-favourite";
