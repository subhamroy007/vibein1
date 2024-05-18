import Header from "../../components/Header";
import { layoutStyle } from "../../styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { selectInbox } from "../../store/client/client.selector";
import { FlatList } from "react-native";
import ChatListItem from "../../components/chat-section/ChatListItem";
import { useEffect } from "react";
import { fetchInboxChats } from "../../store/chat/chat.thunk";

export default function Inbox() {
  const data = useAppSelector(selectInbox);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!data) {
      dispatch(fetchInboxChats());
    }
  }, [data]);

  return (
    <SafeAreaView style={layoutStyle.flex_1}>
      <Header hideBack title="Messages" />
      <FlatList
        style={layoutStyle.flex_1}
        data={data?.chats}
        renderItem={({ item }) => {
          return <ChatListItem chatId={item.key} />;
        }}
        overScrollMode={"never"}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
