import { useLocalSearchParams } from "expo-router";
import Header from "../components/Header";
import StackContainer from "../components/StackContainer";
import { useAppSelector } from "../hooks/storeHooks";
import { selectChatDetails } from "../store/chat/chat.selector";
import { FlatList, ListRenderItemInfo, View } from "react-native";
import { useCallback } from "react";
import { MessageItemIdentitfier } from "../types/store.types";
import { marginStyle } from "../styles";
import MessageListItem from "../components/chat-section/MessageListItem";

export default function ChatWindow() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();

  const data = useAppSelector((state) => selectChatDetails(state, chatId!));

  const renderMessage = useCallback(
    ({ item }: ListRenderItemInfo<MessageItemIdentitfier>) => {
      if (item.isPlaceHolder) {
        return null;
      }
      return <MessageListItem messageId={item.key} />;
    },
    []
  );

  return (
    <StackContainer>
      <Header title="chat" />
      <FlatList
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        data={data?.messages.items}
        renderItem={renderMessage}
        ItemSeparatorComponent={() => (
          <View style={marginStyle.margin_top_24} />
        )}
        inverted
      />
    </StackContainer>
  );
}
