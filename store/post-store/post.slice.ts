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
  CommentItemIdentifier,
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
import { fetchInboxChats } from "../chat/chat.thunk";

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
      author: post.author.userId,
      photos: post.photos.map((photo) => ({
        ...photo,
        taggedAccounts: photo.taggedAccounts
          ? photo.taggedAccounts.map<PostPhotoAccountTagAdapterParams>(
              (tag) => ({
                account: tag.account.userId,
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
    author: post.author.userId,
    taggedAccounts: post.taggedAccounts
      ? post.taggedAccounts.map((account) => account.userId)
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
    author: comment.author.userId,
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
        const post = state.posts.entities[postId];
        if (post) {
          if (post.commentSection) {
            const commentSection = post.commentSection.fetched;
            commentSection.endCursor = payload.endCursor;
            commentSection.hasEndReached = payload.hasEndReached;
            commentSection.items = [...commentSection.items, ...newItems];
          } else {
            post.commentSection = {
              createdAt: Date.now(),
              fetched: {
                endCursor: payload.endCursor,
                hasEndReached: payload.hasEndReached,
                items: newItems,
              },
              pending: [],
              uploaded: [],
            };
          }
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
        const targetComment = state.comments.entities[commentId];
        if (targetComment) {
          if (targetComment.replySection) {
            const replySection = targetComment.replySection.fetched;
            replySection.endCursor = payload.endCursor;
            replySection.hasEndReached = payload.hasEndReached;
            replySection.items = [...replySection.items, ...newItems];
          } else {
            targetComment.replySection = {
              createdAt: Date.now(),
              fetched: {
                endCursor: payload.endCursor,
                hasEndReached: payload.hasEndReached,
                items: newItems,
              },
              pending: [],
              uploaded: [],
            };
          }
        }
      }
    );
    // builder.addCase(
    //   uploadComment.pending,
    //   (
    //     state,
    //     {
    //       meta: {
    //         arg: { postId, text, id },
    //       },
    //     }
    //   ) => {
    //     addOneCommentPlaceholder(state.comment_placeholders, {
    //       id,
    //       text,
    //       postId: postId,
    //       error: null,
    //       isUploading: true,
    //     });
    //     const commentSection = state.posts.entities[postId]?.commentSection;
    //     if (commentSection) {
    //       commentSection.pending = [{ key: id }, ...commentSection.pending];
    //     }
    //   }
    // );
    // builder.addCase(
    //   uploadComment.fulfilled,
    //   (
    //     state,
    //     {
    //       meta: {
    //         arg: { id, postId },
    //       },
    //       payload,
    //     }
    //   ) => {
    //     addCommentsToStore(state.comments, [payload]);
    //     removeOneCommentPlaceholder(state.comment_placeholders, id);
    //     const commentSection = state.posts.entities[postId]?.commentSection;
    //     if (commentSection) {
    //       commentSection.uploaded = [
    //         { key: payload.id },
    //         ...commentSection.uploaded,
    //       ];
    //       commentSection.pending = commentSection.pending.filter(
    //         (item) => item.key !== id
    //       );
    //     }
    //   }
    // );
    // builder.addCase(
    //   uploadComment.rejected,
    //   (
    //     state,
    //     {
    //       meta: {
    //         arg: { id },
    //       },
    //       payload,
    //     }
    //   ) => {
    //     const placeholder = state.comment_placeholders.entities[id];
    //     if (placeholder) {
    //       placeholder.error = payload;
    //       placeholder.isUploading = false;
    //     }
    //   }
    // );
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
        const newItems = payload.likes.items.map<ItemKey>((item) => ({
          key: item.userId,
        }));
        if (targetPost.likeSection && !refresh) {
          targetPost.likeSection.allLikes.endCursor = payload.likes.endCursor;
          targetPost.likeSection.allLikes.hasEndReached =
            payload.likes.hasEndReached;
          targetPost.likeSection.allLikes.items = [
            ...targetPost.likeSection.allLikes.items,
            ...newItems,
          ];
        } else {
          targetPost.likeSection = {
            createdAt: Date.now(),
            expiresAt: -1,
            allLikes: {
              endCursor: payload.likes.endCursor,
              hasEndReached: payload.likes.hasEndReached,
              items: newItems,
            },
          };
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
    builder.addCase(fetchInboxChats.fulfilled, (state, { payload }) => {
      const posts: PostResponseParams[] = [];
      payload.chats.forEach((chat) => {
        if (chat.recentMessages) {
          chat.recentMessages.items.forEach((message) => {
            if (message.attachment && message.attachment.type === "post") {
              posts.push(message.attachment.post);
            }
          });
        }
      });
      upsertManyPosts(
        state.posts,
        posts.map((post) => transformToPostAdapter(post))
      );
    });
  },
});

const postStoreReducer = postSlice.reducer;

export default postStoreReducer;

export const {
  actions: { setCommentLike, deleteComment, setCommentPin },
} = postSlice;
