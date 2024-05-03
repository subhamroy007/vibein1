import {
  createSlice,
  Draft,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  addOneCommentPlaceholder,
  getCommentAdapterInitialState,
  getCommentPlaceholderAdapterInitialState,
  getPostAdapterInitialState,
  removeOneComment,
  removeOneCommentPlaceholder,
  upsertManyComments,
  upsertManyPosts,
} from "./post.adapter";
import {
  fetchExploreFeed,
  fetchHomeFeedPosts,
  fetchMomentsFeed,
  fetchPhotosFeed,
  fetchPostSuggestions,
  fetchSearchedPosts,
} from "../client/client.thunk";
import {
  CommentResponseParams,
  MomentPostResponseParams,
  PhotoPostResponseParams,
  PostResponseParams,
} from "../../types/response.types";
import {
  CommentAdapterParams,
  CommentPlaceholderParams,
  PostAdapterParams,
  PostPhotoAccountTagAdapterParams,
} from "../../types/store.types";
import {
  fetchComments,
  fetchFilteredLikes,
  fetchLikes,
  fetchReplies,
  uploadComment,
} from "./post.thunks";
import { ItemKey } from "../../types/utility.types";
import {
  fetchAccountAllPosts,
  fetchAccountMomentPosts,
  fetchAccountPhotoPosts,
  fetchAccountProfileDetails,
  fetchAccountTaggedPosts,
} from "../account-store/account.thunks";
import {
  fetchHashtagRoute,
  fetchHashtagTopPosts,
} from "../hashtag/hashtag.thunk";
import {
  fetchLocationRoute,
  fetchLocationTopPosts,
} from "../location/location.thunk";
import {
  fetchAudioMomentPosts,
  fetchAudioPhotoPosts,
  fetchAudioRoute,
} from "../audio-store/audio.thunk";

const initialState: {
  posts: EntityState<PostAdapterParams>;
  comments: EntityState<CommentAdapterParams>;
  comment_placeholders: EntityState<CommentPlaceholderParams>;
} = {
  posts: getPostAdapterInitialState(),
  comments: getCommentAdapterInitialState(),
  comment_placeholders: getCommentPlaceholderAdapterInitialState(),
};

export function isPhotoPost(post: any): post is PhotoPostResponseParams {
  return post.photos !== undefined;
}

export function isMomentPost(post: any): post is MomentPostResponseParams {
  return post.video !== undefined;
}

export function isPost(post: any): post is PostResponseParams {
  return post.type !== undefined;
}

const transformToPostAdapter = (
  post: PostResponseParams | PhotoPostResponseParams | MomentPostResponseParams
): PostAdapterParams => {
  if (isPhotoPost(post)) {
    return {
      ...post,
      author: post.author.username,
      photos: post.photos.map((photo) => ({
        ...photo,
        taggedAccounts: photo.taggedAccounts
          ? photo.taggedAccounts.map<PostPhotoAccountTagAdapterParams>(
              (tag) => ({
                account: tag.account.username,
                position: tag.position,
              })
            )
          : undefined,
      })),
      commentSection: null,
      likeSection: null,
      type: "photo-post",
    };
  }
  return {
    ...post,
    author: post.author.username,
    taggedAccounts: post.taggedAccounts
      ? post.taggedAccounts.map((account) => account.username)
      : undefined,
    commentSection: null,
    likeSection: null,
    type: "moment-post",
  };
};

const transformToCommentAdapter = (
  comment: CommentResponseParams
): CommentAdapterParams => {
  return {
    ...comment,
    author: comment.author.username,
    isReplyHidden: true,
    replySection: null,
  };
};

const addPostsToStore = (
  state: Draft<EntityState<PostAdapterParams>>,
  posts:
    | PostResponseParams[]
    | PhotoPostResponseParams[]
    | MomentPostResponseParams[]
) => {
  const newPosts: PostAdapterParams[] = [];
  posts.forEach((post) => {
    newPosts.push(transformToPostAdapter(post));
  });
  upsertManyPosts(state, newPosts);
};

const addCommentsToStore = (
  state: Draft<EntityState<CommentAdapterParams>>,
  comments: CommentResponseParams[]
) => {
  const newComments: CommentAdapterParams[] = [];
  comments.forEach((comment) => {
    newComments.push(transformToCommentAdapter(comment));
  });
  upsertManyComments(state, newComments);
};

const postSlice = createSlice({
  name: "post-store",
  initialState,
  reducers: {
    setCommentLike: {
      prepare(commentId: string, value: boolean) {
        return { payload: { commentId, value } };
      },
      reducer(
        state,
        {
          payload: { commentId, value },
        }: PayloadAction<{ value: boolean; commentId: string }>
      ) {
        const comment = state.comments.entities[commentId];
        if (comment) {
          comment.isLiked = value;
          comment.noOfLikes = value
            ? comment.noOfLikes + 1
            : comment.noOfLikes - 1;
        }
      },
    },
    setCommentPin: {
      prepare(commentId: string, value: boolean) {
        return {
          payload: { commentId, value },
        };
      },
      reducer(
        state,
        {
          payload: { commentId, value },
        }: PayloadAction<{ commentId: string; value: boolean }>
      ) {
        const comment = state.comments.entities[commentId];
        if (comment) {
          comment.pinned = value;
        }
      },
    },
    deleteComment: {
      prepare(commentId: string) {
        return { payload: { commentId } };
      },
      reducer(
        state,
        { payload: { commentId } }: PayloadAction<{ commentId: string }>
      ) {
        removeOneComment(state.comments, commentId);
      },
    },
    swithReplyHiddenState: {
      prepare(commentId: string) {
        return { payload: { commentId } };
      },
      reducer(
        state,
        { payload: { commentId } }: PayloadAction<{ commentId: string }>
      ) {
        const targetComment = state.comments.entities[commentId];
        if (targetComment) {
          targetComment.isReplyHidden = !targetComment.isReplyHidden;
        }
      },
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchHomeFeedPosts.fulfilled, (state, { payload }) => {
      addPostsToStore(state.posts, payload.items);
    });
    builder.addCase(fetchExploreFeed.fulfilled, (state, { payload }) => {
      addPostsToStore(state.posts, payload.data);
    });
    builder.addCase(fetchMomentsFeed.fulfilled, (state, { payload }) => {
      addPostsToStore(state.posts, payload.data);
    });
    builder.addCase(fetchPhotosFeed.fulfilled, (state, { payload }) => {
      addPostsToStore(state.posts, payload.data);
    });
    builder.addCase(fetchPostSuggestions.fulfilled, (state, { payload }) => {
      addPostsToStore(state.posts, payload.data);
    });
    builder.addCase(fetchSearchedPosts.fulfilled, (state, { payload }) => {
      addPostsToStore(state.posts, payload.data);
    });
    builder.addCase(
      fetchComments.fulfilled,
      (
        state,
        {
          payload,
          meta: {
            arg: { postId },
          },
        }
      ) => {
        addCommentsToStore(state.comments, payload.items);
        const newItems = payload.items.map<ItemKey>((item) => ({
          key: item.id,
        }));
        const commentSection = state.posts.entities[postId]?.commentSection;
        if (commentSection) {
          commentSection.fetched.isLoading = false;
          if (commentSection.fetched.data) {
            commentSection.fetched.data.endCursor = payload.endCursor;
            commentSection.fetched.data.hasEndReached = payload.hasEndReached;
            commentSection.fetched.data.items = [
              ...commentSection.fetched.data.items,
              ...newItems,
            ];
          } else {
            commentSection.fetched.data = {
              endCursor: payload.endCursor,
              hasEndReached: payload.hasEndReached,
              items: newItems,
            };
          }
        }
      }
    );
    builder.addCase(
      fetchComments.rejected,
      (
        state,
        {
          meta: {
            arg: { postId },
          },
          payload,
        }
      ) => {
        const commentSection = state.posts.entities[postId]?.commentSection;
        if (commentSection) {
          commentSection.fetched.error = payload;
          commentSection.fetched.isLoading = false;
        }
      }
    );
    builder.addCase(
      fetchComments.pending,
      (
        state,
        {
          meta: {
            arg: { postId },
          },
        }
      ) => {
        const targetPost = state.posts.entities[postId];
        if (!targetPost) return;
        if (!targetPost.commentSection) {
          targetPost.commentSection = {
            pending: [],
            uploaded: [],
            fetched: { data: null, error: null, isLoading: true },
          };
        } else {
          const commentSection = targetPost.commentSection;
          commentSection.fetched.error = null;
          commentSection.fetched.isLoading = true;
        }
      }
    );
    builder.addCase(
      fetchReplies.fulfilled,
      (
        state,
        {
          payload,
          meta: {
            arg: { commentId },
          },
        }
      ) => {
        addCommentsToStore(state.comments, payload.items);
        const newItems = payload.items.map<ItemKey>((item) => ({
          key: item.id,
        }));
        const reply = state.comments.entities[commentId];
        if (reply) {
          const replySection = reply.replySection;
          if (replySection) {
            replySection.fetched.isLoading = false;
            if (replySection.fetched.data) {
              replySection.fetched.data.endCursor = payload.endCursor;
              replySection.fetched.data.hasEndReached = payload.hasEndReached;
              replySection.fetched.data.items = [
                ...replySection.fetched.data.items,
                ...newItems,
              ];
            } else {
              replySection.fetched.data = {
                endCursor: payload.endCursor,
                hasEndReached: payload.hasEndReached,
                items: newItems,
              };
              reply.isReplyHidden = false;
            }
          }
        }
      }
    );
    builder.addCase(
      fetchReplies.rejected,
      (
        state,
        {
          meta: {
            arg: { commentId },
          },
          payload,
        }
      ) => {
        const replySection = state.comments.entities[commentId]?.replySection;
        if (replySection) {
          replySection.fetched.error = payload;
          replySection.fetched.isLoading = false;
        }
      }
    );
    builder.addCase(
      fetchReplies.pending,
      (
        state,
        {
          meta: {
            arg: { commentId },
          },
        }
      ) => {
        const reply = state.comments.entities[commentId];
        if (!reply) return;
        if (!reply.replySection) {
          reply.replySection = {
            pending: [],
            uploaded: [],
            fetched: { data: null, error: null, isLoading: true },
          };
        } else {
          const replySection = reply.replySection;
          replySection.fetched.error = null;
          replySection.fetched.isLoading = true;
        }
      }
    );
    builder.addCase(
      uploadComment.pending,
      (
        state,
        {
          meta: {
            arg: { postId, text, id },
          },
        }
      ) => {
        addOneCommentPlaceholder(state.comment_placeholders, {
          id,
          text,
          postId: postId,
          error: null,
          isUploading: true,
        });
        const commentSection = state.posts.entities[postId]?.commentSection;
        if (commentSection) {
          commentSection.pending = [{ key: id }, ...commentSection.pending];
        }
      }
    );
    builder.addCase(
      uploadComment.fulfilled,
      (
        state,
        {
          meta: {
            arg: { id, postId },
          },
          payload,
        }
      ) => {
        addCommentsToStore(state.comments, [payload]);
        removeOneCommentPlaceholder(state.comment_placeholders, id);
        const commentSection = state.posts.entities[postId]?.commentSection;
        if (commentSection) {
          commentSection.uploaded = [
            { key: payload.id },
            ...commentSection.uploaded,
          ];
          commentSection.pending = commentSection.pending.filter(
            (item) => item.key !== id
          );
        }
      }
    );
    builder.addCase(
      uploadComment.rejected,
      (
        state,
        {
          meta: {
            arg: { id },
          },
          payload,
        }
      ) => {
        const placeholder = state.comment_placeholders.entities[id];
        if (placeholder) {
          placeholder.error = payload;
          placeholder.isUploading = false;
        }
      }
    );
    builder.addCase(
      fetchLikes.pending,
      (
        state,
        {
          meta: {
            arg: { postId },
          },
        }
      ) => {
        const targetPost = state.posts.entities[postId];
        if (!targetPost) return;
        if (!targetPost.likeSection) {
          targetPost.likeSection = {
            searchedLikes: {
              isLoading: false,
              error: null,
              data: {},
              searchPhase: null,
            },
            allLikes: {
              isLoading: true,
              error: null,
              data: null,
            },
          };
        } else {
          const likedSection = targetPost.likeSection;
          likedSection.allLikes.isLoading = true;
          likedSection.allLikes.error = null;
        }
      }
    );
    builder.addCase(
      fetchLikes.rejected,
      (
        state,
        {
          meta: {
            arg: { postId },
          },
          payload,
        }
      ) => {
        const targetPost = state.posts.entities[postId];
        if (!targetPost) return;
        const likedSection = targetPost.likeSection;
        if (!likedSection) return;
        likedSection.allLikes.error = payload;
        likedSection.allLikes.isLoading = false;
      }
    );
    builder.addCase(
      fetchLikes.fulfilled,
      (
        state,
        {
          meta: {
            arg: { postId, refresh },
          },
          payload,
        }
      ) => {
        const targetPost = state.posts.entities[postId];
        if (!targetPost) return;
        if (payload.engagementSummary) {
          targetPost.engagementSummary.noOfLikes =
            payload.engagementSummary.noOfLikes;
          targetPost.engagementSummary.noOfViews =
            payload.engagementSummary.noOfViews;
        }
        const likedSection = targetPost.likeSection;
        if (!likedSection) return;
        const newItems = payload.likes.items.map<ItemKey>((item) => ({
          key: item.username,
        }));
        likedSection.allLikes.isLoading = false;
        if (refresh || !likedSection.allLikes.data) {
          likedSection.allLikes.data = {
            endCursor: payload.likes.endCursor,
            hasEndReached: payload.likes.hasEndReached,
            items: newItems,
          };
        } else {
          likedSection.allLikes.data.hasEndReached =
            payload.likes.hasEndReached;
          likedSection.allLikes.data.endCursor = payload.likes.endCursor;
          likedSection.allLikes.data.items = [
            ...likedSection.allLikes.data.items,
            ...newItems,
          ];
        }
      }
    );
    builder.addCase(
      fetchFilteredLikes.pending,
      (
        state,
        {
          meta: {
            arg: { postId, searchPhase },
          },
        }
      ) => {
        const targetPost = state.posts.entities[postId];
        if (!targetPost) return;
        const likedSection = targetPost.likeSection;
        if (!likedSection) return;
        likedSection.searchedLikes.isLoading = true;
        likedSection.searchedLikes.searchPhase = searchPhase;
        likedSection.searchedLikes.error = null;
      }
    );
    builder.addCase(
      fetchFilteredLikes.rejected,
      (
        state,
        {
          meta: {
            arg: { postId, searchPhase },
          },
          payload,
        }
      ) => {
        const targetPost = state.posts.entities[postId];
        if (!targetPost) return;
        const likedSection = targetPost.likeSection;
        if (!likedSection) return;
        if (likedSection.searchedLikes.searchPhase === searchPhase) {
          likedSection.searchedLikes.isLoading = false;
          likedSection.searchedLikes.error = payload;
        }
      }
    );
    builder.addCase(
      fetchFilteredLikes.fulfilled,
      (
        state,
        {
          meta: {
            arg: { postId, searchPhase },
          },
          payload,
        }
      ) => {
        const targetPost = state.posts.entities[postId];
        if (!targetPost) return;
        const likedSection = targetPost.likeSection;
        if (!likedSection) return;
        if (likedSection.searchedLikes.searchPhase === searchPhase) {
          likedSection.searchedLikes.isLoading = false;
          likedSection.searchedLikes.data[searchPhase] =
            payload.accounts.map<ItemKey>((item) => ({ key: item.username }));
        }
      }
    );
    builder.addCase(
      fetchAccountProfileDetails.fulfilled,
      (state, { payload: { recentPosts } }) => {
        if (recentPosts) {
          addPostsToStore(state.posts, recentPosts.items);
        }
      }
    );
    builder.addCase(fetchAccountAllPosts.fulfilled, (state, { payload }) => {
      addPostsToStore(state.posts, payload.items);
    });
    builder.addCase(fetchAccountTaggedPosts.fulfilled, (state, { payload }) => {
      addPostsToStore(state.posts, payload.items);
    });
    builder.addCase(fetchAccountPhotoPosts.fulfilled, (state, { payload }) => {
      addPostsToStore(state.posts, payload.items);
    });
    builder.addCase(fetchAccountMomentPosts.fulfilled, (state, { payload }) => {
      addPostsToStore(state.posts, payload.items);
    });
    builder.addCase(fetchHashtagRoute.fulfilled, (state, { payload }) => {
      if (payload.topPosts) {
        addPostsToStore(state.posts, payload.topPosts.items);
      }
    });
    builder.addCase(fetchHashtagTopPosts.fulfilled, (state, { payload }) => {
      addPostsToStore(state.posts, payload.items);
    });
    builder.addCase(fetchLocationRoute.fulfilled, (state, { payload }) => {
      if (payload.topPosts) {
        addPostsToStore(state.posts, payload.topPosts.items);
      }
    });
    builder.addCase(fetchLocationTopPosts.fulfilled, (state, { payload }) => {
      addPostsToStore(state.posts, payload.items);
    });
    builder.addCase(fetchAudioRoute.fulfilled, (state, { payload }) => {
      if (payload.moments) {
        addPostsToStore(state.posts, payload.moments.items);
      }
    });
    builder.addCase(fetchAudioMomentPosts.fulfilled, (state, { payload }) => {
      addPostsToStore(state.posts, payload.items);
    });
    builder.addCase(fetchAudioPhotoPosts.fulfilled, (state, { payload }) => {
      addPostsToStore(state.posts, payload.items);
    });
  },
});

const postStoreReducer = postSlice.reducer;

export default postStoreReducer;

export const {
  actions: {
    setCommentLike,
    deleteComment,
    setCommentPin,
    swithReplyHiddenState,
  },
} = postSlice;
