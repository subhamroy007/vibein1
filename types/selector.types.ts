import { AccountResponseParams } from "./response.types";
import { ReplySectionStoreParams } from "./store.types";
import { CommentTemplateParams, ReplyTemplateParams } from "./utility.types";

/**
 * represents the parameters that is seleted to be returned to the comment selector
 */
export type CommentSelectorParams =
  CommentTemplateParams<AccountResponseParams> & {
    isClientAuthorOfComment: boolean;
  };

/**
 * represents the parameters that is seleted to be returned to the reply selector
 */
export type ReplySelectorParams = ReplyTemplateParams<AccountResponseParams> & {
  isClientAuthorOfReply: boolean;
};

export type ReplySectionSelectorParams = {
  noOfReplies: number;
} & ReplySectionStoreParams;
