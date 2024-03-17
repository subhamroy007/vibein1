import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { ReplySelectorParams } from "../../types/selector.types";
import { selectReplyById } from "./reply.adapter";
import { selectAccountParams } from "../account/account.selectors";
import { selectClientAccountParams } from "../client/client.selector";

export const selectReplyParams = createSelector(
  [(state: RootState) => state, (state: RootState, id: string) => id],
  (state, replyId): ReplySelectorParams | undefined => {
    const reply = selectReplyById(state.reply, replyId);

    if (!reply) {
      return undefined;
    }

    const author = selectAccountParams(state, reply.createdBy);

    if (!author) {
      return undefined;
    }

    const client = selectClientAccountParams(state);

    if (!client) {
      return undefined;
    }
    const result: ReplySelectorParams = {
      ...reply,
      createdBy: author,
      isClientAuthorOfReply: author.id === client.id,
    };
    return result;
  }
);
