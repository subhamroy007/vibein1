import { createEntityAdapter } from "@reduxjs/toolkit";
import { ReplyAdapterParams } from "../../types/store.types";

const replyAdapter = createEntityAdapter<ReplyAdapterParams>({
  selectId: (model) => model.id,
  sortComparer: (reply1, reply2) => reply1.id.localeCompare(reply2.id),
});

export const { selectById: selectReplyById } = replyAdapter.getSelectors();
export const {
  addMany: addManyReplies,
  addOne: addOneReply,
  removeOne: removeOneReply,
  removeMany: removeMayReply,
  removeAll: removeAllReply,
  updateOne: updateOneReply,
  updateMany: updateManyReply,
  upsertOne: upsertOneReply,
  upsertMany: upsertManyReply,
  getInitialState: getReplyInitialState,
} = replyAdapter;
