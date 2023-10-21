import { ScrollView, StyleSheet, View } from "react-native";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../../styles";
import SolidButton from "../SolidButton";
import { useCallback, useState } from "react";
import { useAppSelector } from "../../hooks/storeHooks";
import { selectInboxParams } from "../../store/client/client.selector";
import AppTextInput from "../AppTextInput";
import { ChatItemIdentifierParams } from "../../types/store.types";
import { OneToOneChatReceipient } from "./OneToOneChatReceipient";
import { Portal } from "@gorhom/portal";

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

  if (!inbox) {
    return null;
  }

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
        {inbox.chats.map((chat, index) => {
          if (chat.type === "one-to-one") {
            return (
              <OneToOneChatReceipient
                username={chat.username}
                key={chat.username + index}
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
