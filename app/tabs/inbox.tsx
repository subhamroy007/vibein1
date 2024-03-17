import { Tabs } from "expo-router";
import AppScreen from "../../components/AppScreen";
import Header from "../../components/Header";
import { useInbox } from "../../hooks/client.hooks";
import { useCallback } from "react";
import { ListRenderItemInfo } from "react-native";

import Animated from "react-native-reanimated";
import { ChatItemIdentifierParams } from "../../types/store.types";
import { SIZE_70 } from "../../constants";
import ChatItem from "../../components/chat/ChatItem";

export default function Inbox() {
  // const { fetch, inboxParams } = useInbox();

  // const renderItemCallback = useCallback(
  //   ({ item }: ListRenderItemInfo<ChatItemIdentifierParams>) => {
  //     return <ChatItem chatId={item.chatId} />;
  //   },
  //   []
  // );

  // const getItemLayout = useCallback(
  //   (
  //     _: ArrayLike<ChatItemIdentifierParams> | null | undefined,
  //     index: number
  //   ) => {
  //     return {
  //       length: SIZE_70,
  //       offset: SIZE_70 * index,
  //       index,
  //     };
  //   },
  //   []
  // );

  return (
    <AppScreen>
      <Header hideBack title="Messages" />
      {/* <Animated.FlatList
        data={inboxParams.chats}
        showsVerticalScrollIndicator={false}
        overScrollMode={"never"}
        keyExtractor={(item) => item.chatId}
        renderItem={renderItemCallback}
        getItemLayout={getItemLayout}
      /> */}
    </AppScreen>
  );
}
