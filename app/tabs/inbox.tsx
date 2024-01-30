import { Tabs, useRouter } from "expo-router";
import AppScreen from "../../components/AppScreen";
import Header from "../../components/Header";
import { useInbox } from "../../hooks/client.hooks";
import { useCallback, useEffect } from "react";
import { ListRenderItemInfo, Pressable, View } from "react-native";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../../styles";
import { useAppSelector } from "../../hooks/storeHooks";
import { selectChatParams } from "../../store/chat/chat.selector";
import Avatar from "../../components/Avatar";
import { SIZE_12, SIZE_15, SIZE_48, SIZE_70 } from "../../constants";
import AppText from "../../components/AppText";
import Animated from "react-native-reanimated";
import { ChatItemIdentifierParams } from "../../types/store.types";
import { formatDate } from "../../utility";

const ChatItem = ({ chatId }: { chatId: string }) => {
  const chatParams = useAppSelector((state) => selectChatParams(state, chatId));

  const router = useRouter();

  const pressCallback = useCallback(() => {
    router.push({ params: { chatId }, pathname: "/chat/[chatid]" });
  }, [router]);

  if (!chatParams || !chatParams.receipient.account) {
    return null;
  }
  const {
    lastMessage,
    noOfUnseenMessages,
    receipient: { account },
  } = chatParams;

  return (
    <Pressable
      disabled
      onPress={pressCallback}
      style={[
        paddingStyle.padding_horizontal_12,
        { height: SIZE_70 },
        layoutStyle.flex_direction_row,
        layoutStyle.align_item_center,
      ]}
    >
      <Avatar size={SIZE_48} url={account!.profilePictureUrl} />
      <View
        style={[
          layoutStyle.flex_1,
          marginStyle.margin_left_12,
          layoutStyle.align_self_stretch,
        ]}
      >
        <View
          style={[
            { height: "50%" },
            layoutStyle.flex_direction_row,
            layoutStyle.justify_content_space_between,
            layoutStyle.align_item_flex_end,
          ]}
        >
          <AppText weight="bold" size={SIZE_15} style={{ width: "80%" }}>
            {account!.fullname}
          </AppText>
          {lastMessage && (
            <AppText weight="semi-bold" size={SIZE_12}>
              {formatDate(lastMessage.createdAt)}
            </AppText>
          )}
        </View>
        <View
          style={[
            layoutStyle.flex_direction_row,
            layoutStyle.justify_content_space_between,
            layoutStyle.align_item_center,
            { height: "50%" },
          ]}
        >
          {chatParams.lastMessage ? (
            <AppText
              weight="semi-bold"
              color={"grey"}
              style={[{ width: "80%" }, layoutStyle.align_self_start]}
            >
              {"seen: "}
              {chatParams.lastMessage.body.text}
            </AppText>
          ) : undefined}
          {noOfUnseenMessages > 0 ? (
            <View
              style={[
                borderStyle.border_radius_12,
                backgroundStyle.background_color_5,
                paddingStyle.padding_horizontal_8,
                paddingStyle.padding_vertical_3,
              ]}
            >
              <AppText color="white" weight="semi-bold">
                {noOfUnseenMessages}
              </AppText>
            </View>
          ) : undefined}
        </View>
      </View>
    </Pressable>
  );
};

export default function Inbox() {
  const { fetch, inboxParams } = useInbox();

  useEffect(() => {
    fetch(true);
  }, []);

  const renderItemCallback = useCallback(
    ({ item }: ListRenderItemInfo<ChatItemIdentifierParams>) => {
      return <ChatItem chatId={item.chatId} />;
    },
    []
  );

  return (
    <AppScreen>
      <Tabs.Screen
        options={{
          headerShown: false,
        }}
      />
      <Header hideBack title="Messages" />
      <Animated.FlatList
        data={inboxParams.data.chats}
        showsVerticalScrollIndicator={false}
        overScrollMode={"never"}
        keyExtractor={(item) => item.chatId}
        renderItem={renderItemCallback}
      />
    </AppScreen>
  );
}
