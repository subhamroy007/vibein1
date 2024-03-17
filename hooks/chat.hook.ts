import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./storeHooks";
import {
  getChatInfoThunk,
  getChatMessagesThunk,
} from "../store/inbox/chat.thunk";
import { selectChat } from "../store/inbox/chat.selector";
import { initChat, removeChatMessages } from "../store/inbox/chat.slice";

export function useChat(chatId: string, username: string) {
  const dispatch = useAppDispatch();

  const chatParams = useAppSelector((state) => selectChat(state, chatId));

  const removeMessages = useCallback(() => {
    dispatch(removeChatMessages({ chatId }));
  }, [chatId]);

  useEffect(() => {
    if (!chatParams) {
      dispatch(initChat({ chatId, receipient: username }));
    }
  }, [chatId, username, chatParams]);

  const fetchChatDetails = useCallback(() => {
    dispatch(getChatInfoThunk({ chatId }));
  }, [chatId]);

  const fetchMoreMessages = useCallback(() => {
    dispatch(getChatMessagesThunk({ chatId }));
  }, [chatId]);

  return {
    fetchChatDetails,
    fetchMoreMessages,
    removeMessages,
    chatParams,
  };
}
