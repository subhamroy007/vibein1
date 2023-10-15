import { ScrollView, StyleSheet, View } from "react-native";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../styles";
import SolidButton from "./SolidButton";
import { useCallback, useState } from "react";
import { useAppSelector } from "../hooks/storeHooks";
import { selectInboxParams } from "../store/client/client.selector";
import Avatar from "./Avatar";
import AppText from "./AppText";
import { COLOR_2, COLOR_5, SIZE_11, SIZE_24, SIZE_48 } from "../constants";
import Icon from "./Icon";
import AppTextInput from "./AppTextInput";
import AppTouchableHighlight from "./AppTouchableHighlight";
import { ChatItemIdentifierParams } from "../types/store.types";
import { useAccountAdapterParams } from "../hooks/account.hooks";

export type ChatListItemProps = {
  username: string;
  onSelect: (username: string) => void;
  selected: boolean;
};

export function ChatListItem({
  username,
  onSelect,
  selected,
}: ChatListItemProps) {
  const accountParams = useAccountAdapterParams(username, ["fullname"]);

  if (!accountParams) {
    return null;
  }

  const pressCallback = useCallback(
    () => onSelect(username),
    [onSelect, username]
  );

  return (
    <AppTouchableHighlight
      style={[
        paddingStyle.padding_horizontal_12,
        paddingStyle.padding_vertical_6,
        layoutStyle.align_item_center,
        layoutStyle.flex_direction_row,
      ]}
      onPress={pressCallback}
    >
      <Avatar url={accountParams.profilePictureUrl} size={SIZE_48} />
      <View style={[marginStyle.margin_left_6, layoutStyle.flex_1]}>
        <AppText>{accountParams.username}</AppText>
        <AppText size={SIZE_11} color={COLOR_2}>
          {accountParams.fullname}
        </AppText>
      </View>
      {!selected ? (
        <Icon name="radio-unchecked" size={SIZE_24} color={COLOR_2} />
      ) : (
        <Icon name="tick-circle-solid" size={SIZE_24} color={COLOR_5} />
      )}
    </AppTouchableHighlight>
  );
}

export default function PostSendSection() {
  const [caption, setCaption] = useState("");

  const [selectedChats, setSelectedChats] = useState<
    ChatItemIdentifierParams[]
  >([]);

  const inbox = useAppSelector(selectInboxParams);

  const selectCallback = useCallback(
    (username: string) => {
      setSelectedChats((prevChats) => {
        const selected = prevChats.find(
          (item) => item.type === "one-to-one" && item.username === username
        );
        if (selected) {
          return prevChats.filter(
            (item) => item.type === "one-to-one" && item.username !== username
          );
        }
        return [{ username, type: "one-to-one" }, ...prevChats];
      });
    },
    [setSelectedChats]
  );

  const sendButtonPressCallback = useCallback(() => {
    console.log(
      `going to send a msg to the chats ${selectedChats} with the caption '${caption}'`
    );
  }, [caption, selectedChats]);

  return (
    <View style={[layoutStyle.flex_1, backgroundStyle.background_color_1]}>
      <View style={[paddingStyle.padding_12, borderStyle.border_color_2]}>
        <AppTextInput
          placeholder="Send to..."
          style={[
            borderStyle.border_color_2,
            borderStyle.border_width_hairline,
            borderStyle.border_radius_18,
            paddingStyle.padding_horizontal_12,
            paddingStyle.padding_vertical_9,
            backgroundStyle.background_color_13,
          ]}
        />
      </View>
      <ScrollView
        style={[layoutStyle.flex_1]}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        contentContainerStyle={[
          paddingStyle.padding_top_12,
          paddingStyle.padding_bottom_90,
        ]}
        nestedScrollEnabled
      >
        {inbox.data.chats.map((chat) => {
          if (chat.type === "one-to-one") {
            return (
              <ChatListItem
                username={chat.username}
                key={chat.username}
                onSelect={selectCallback}
                selected={
                  selectedChats.find(
                    (item) =>
                      item.type === "one-to-one" &&
                      item.username === chat.username
                  ) !== undefined
                }
              />
            );
          } else {
            return null;
          }
        })}
      </ScrollView>
      {selectedChats.length > 0 && (
        <View
          style={[
            borderStyle.border_color_2,
            borderStyle.border_top_width_hairline,
            paddingStyle.padding_12,
            layoutStyle.position_absolute,
            backgroundStyle.background_color_1,
            styles.footer,
          ]}
        >
          <AppTextInput
            placeholder="write a caption..."
            multiline
            style={[
              marginStyle.margin_bottom_12,
              paddingStyle.padding_vertical_6,
            ]}
            onChangeText={setCaption}
          />
          <SolidButton onPress={sendButtonPressCallback} title="send post" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    bottom: 0,
    width: "100%",
  },
});
