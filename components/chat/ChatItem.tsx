import { useCallback } from "react";
import { useAppSelector } from "../../hooks/storeHooks";
import { RootState } from "../../store";
import { selectChatItem } from "../../store/inbox/chat.selector";
import { useRouter } from "expo-router";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { layoutStyle, marginStyle, paddingStyle } from "../../styles";
import { SIZE_12, SIZE_15, SIZE_48, SIZE_70 } from "../../constants";
import Avatar from "../Avatar";
import AppText from "../AppText";
import { getLocalTimeStringFromUTC } from "../../utility";
import NotificationBanner from "./NotificationBanner";

const ChatItem = ({ chatId }: { chatId: string }) => {
  const chatSelectorCallback = useCallback(
    (state: RootState) => selectChatItem(state, chatId),
    [chatId]
  );

  const chatParams = useAppSelector(chatSelectorCallback);

  const router = useRouter();

  const pressCallback = useCallback(() => {
    router.push({
      params: { chatId, username: chatParams?.receipient.username },
      pathname: "/chat_window",
    });
  }, [router]);

  if (!chatParams) {
    return null;
  }
  const { lastMessage, noOfUnseenMessages, receipient, globalTimestamp } =
    chatParams;

  return (
    <Pressable onPress={pressCallback} style={root_container_style}>
      <Avatar size={SIZE_48} url={receipient.profilePictureUri} />
      <View style={metadata_container_style}>
        <View style={receipient_container_style}>
          <AppText weight="bold" size={SIZE_15} style={styles.receipient_text}>
            {receipient.fullname}
          </AppText>
          <AppText weight="semi-bold" size={SIZE_12} color="grey">
            {getLocalTimeStringFromUTC(
              lastMessage ? lastMessage.createdAt : globalTimestamp
            )}
          </AppText>
        </View>
        <View style={last_message_container_style}>
          <AppText weight="semi-bold" color={"grey"} style={last_message_style}>
            {lastMessage
              ? (lastMessage.seenByReceipient ? "seen: " : "sent: ") +
                lastMessage.text
              : receipient.username}
          </AppText>
          {noOfUnseenMessages > 0 ? (
            <NotificationBanner count={noOfUnseenMessages} />
          ) : undefined}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  receipient_text: {
    width: "80%",
  },
  last_message_text: {
    width: "80%",
  },
  last_message_container: {
    height: "50%",
  },
  receipient_container: {
    height: "50%",
  },
  root_container: { height: SIZE_70 },
});

const last_message_style: StyleProp<TextStyle> = [
  styles.last_message_text,
  layoutStyle.align_self_start,
];

const last_message_container_style: StyleProp<ViewStyle> = [
  layoutStyle.flex_direction_row,
  layoutStyle.justify_content_space_between,
  layoutStyle.align_item_center,
  styles.last_message_container,
];

const receipient_container_style: StyleProp<ViewStyle> = [
  styles.receipient_container,
  layoutStyle.flex_direction_row,
  layoutStyle.justify_content_space_between,
  layoutStyle.align_item_flex_end,
];

const metadata_container_style: StyleProp<ViewStyle> = [
  layoutStyle.flex_1,
  marginStyle.margin_left_12,
  layoutStyle.align_self_stretch,
];

const root_container_style: StyleProp<ViewStyle> = [
  paddingStyle.padding_horizontal_12,
  styles.root_container,
  layoutStyle.flex_direction_row,
  layoutStyle.align_item_center,
];

export default ChatItem;
