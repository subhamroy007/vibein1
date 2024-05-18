import { Pressable, View } from "react-native";
import { useAppSelector } from "../../hooks/storeHooks";
import { selectChatListParams } from "../../store/chat/chat.selector";
import {
  LOGO_BLUE,
  SIZE_11,
  SIZE_12,
  SIZE_15,
  SIZE_18,
  SIZE_42,
  SIZE_54,
  SIZE_60,
  SIZE_72,
} from "../../constants";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../../styles";
import Avatar from "../Avatar";
import Text from "../utility-components/text/Text";
import Icon from "../utility-components/icon/Icon";
import CountBubble from "./CountBubble";
import { useRouter } from "expo-router";
import { useCallback } from "react";

export default function ChatListItem({ chatId }: { chatId: string }) {
  const router = useRouter();

  const data = useAppSelector((state) => selectChatListParams(state, chatId));

  const gotoChatWindow = useCallback(() => {
    router.push({ pathname: "/chat_window", params: { chatId } });
  }, []);

  if (!data) return null;

  let avatarItem = null;

  let primaryTextItem = null;
  let secondaryTextItem = null;
  let timestampItem = null;

  secondaryTextItem = (
    <Text color="grey" weight="light_medium" style={{ maxWidth: "90%" }}>
      {data.lastMessageItem.isPlaceHolder ? "Draft" : data.lastMessageItem.text}
    </Text>
  );
  if (!data.lastMessageItem.isPlaceHolder) {
    timestampItem = (
      <Text
        weight="light_medium"
        size={SIZE_11}
        color="grey"
        style={marginStyle.margin_bottom_3}
      >
        {data.lastMessageItem.timestamp}
      </Text>
    );
  }
  if (data.type === "one-to-one") {
    avatarItem = (
      <Avatar url={data.receipient.profilePictureUri} size={SIZE_54} />
    );
    primaryTextItem = (
      <Text weight="semi-bold" size={SIZE_15}>
        {data.receipient.name}
      </Text>
    );
  } else {
    primaryTextItem = (
      <Text weight="semi-bold" size={SIZE_15}>
        {data.name}
      </Text>
    );
    if (data.posterUri) {
      avatarItem = <Avatar size={SIZE_54} url={data.posterUri} />;
    } else {
      avatarItem = (
        <View style={{ width: SIZE_54, aspectRatio: 1 }}>
          <Avatar
            size={SIZE_42}
            url={data.recepientProfilePictureUris![0]}
            style={[layoutStyle.position_absolute, { top: 3, right: 3 }]}
          />
          <Avatar
            size={SIZE_42}
            url={data.recepientProfilePictureUris![1]}
            style={[layoutStyle.position_absolute, { bottom: 3, left: 3 }]}
          />
        </View>
      );
    }
  }

  return (
    <Pressable
      onPress={gotoChatWindow}
      style={[
        { height: SIZE_72 },
        layoutStyle.flex_direction_row,
        layoutStyle.align_item_center,
        paddingStyle.padding_horizontal_12,
      ]}
    >
      {avatarItem}
      <View
        style={[
          layoutStyle.flex_fill,
          marginStyle.margin_left_9,
          //   { backgroundColor: "orange" },
        ]}
      >
        <View
          style={[
            layoutStyle.flex_direction_row,
            layoutStyle.align_item_flex_end,
            layoutStyle.flex_1,
          ]}
        >
          <View
            style={[
              layoutStyle.flex_direction_row,
              layoutStyle.align_item_center,
              layoutStyle.flex_1,
            ]}
          >
            {primaryTextItem}
            {data.isMuted && (
              <Icon
                name="notification-off-outline"
                color="grey"
                size={SIZE_12}
                style={marginStyle.margin_left_3}
              />
            )}
          </View>
          {timestampItem}
        </View>
        <View
          style={[
            layoutStyle.flex_direction_row,
            layoutStyle.align_item_flex_start,
            layoutStyle.flex_1,
          ]}
        >
          <View
            style={[
              layoutStyle.flex_direction_row,
              layoutStyle.align_item_center,
              layoutStyle.flex_1,
              marginStyle.margin_top_4,
            ]}
          >
            {secondaryTextItem}

            <Icon
              name="check-circle-solid"
              size={SIZE_15}
              style={marginStyle.margin_left_6}
              color={LOGO_BLUE}
            />
          </View>
          {data.noOfUnseenMessages > 0 ? (
            <CountBubble
              count={data.noOfUnseenMessages}
              style={marginStyle.margin_top_3}
            />
          ) : undefined}
        </View>
      </View>
    </Pressable>
  );
}
