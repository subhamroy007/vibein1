import { useLocalSearchParams } from "expo-router";
import Header from "../components/Header";
import StackContainer from "../components/StackContainer";
import { useAppDispatch, useAppSelector } from "../hooks/storeHooks";
import { selectChatDetails } from "../store/chat/chat.selector";
import { FlatList, ListRenderItemInfo, Pressable, View } from "react-native";
import { useCallback, useRef, useState } from "react";
import { MessageItemIdentitfier } from "../types/store.types";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../styles";
import MessageListItem from "../components/chat-section/MessageListItem";
import {
  SIZE_15,
  SIZE_20,
  SIZE_24,
  SIZE_30,
  SIZE_40,
  SIZE_54,
} from "../constants";
import IconCircle from "../components/utility-components/icon/IconCircle";
import { TextInput } from "react-native-gesture-handler";
import Icon from "../components/utility-components/icon/Icon";
import { addMessageDraft } from "../store/chat/chat.slice";
import { nanoid } from "@reduxjs/toolkit";
import MessageDraft from "../components/chat-section/MessageDraft";
import Avatar from "../components/Avatar";
import Text from "../components/utility-components/text/Text";

export default function ChatWindow() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();

  const [messageText, setMessageText] = useState("");

  const dispatch = useAppDispatch();

  const trimmedText = useRef("");

  trimmedText.current = messageText.trim();

  const data = useAppSelector((state) => selectChatDetails(state, chatId!));

  const renderMessage = useCallback(
    ({ item }: ListRenderItemInfo<MessageItemIdentitfier>) => {
      if (item.isPlaceHolder) {
        return <MessageDraft draftId={item.key} />;
      }
      return <MessageListItem messageId={item.key} />;
    },
    []
  );

  const onSend = useCallback(() => {
    if (trimmedText.current !== "") {
      setMessageText("");
      dispatch(
        addMessageDraft({
          id: nanoid(),
          sentTo: chatId!,
          text: trimmedText.current,
        })
      );
    }
  }, []);

  if (!data) return null;

  const { messages, receipient } = data;

  return (
    <StackContainer>
      {data && (
        <Header
          leftAligned
          ItemMiddle={
            <View
              style={[
                layoutStyle.align_item_center,
                layoutStyle.flex_direction_row,
              ]}
            >
              <Avatar
                size={SIZE_30}
                url={receipient.account.profilePictureUri}
              />
              <Text style={marginStyle.margin_left_9}>
                {receipient.account.name!}
              </Text>
            </View>
          }
        />
      )}
      <FlatList
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        data={messages.items}
        renderItem={renderMessage}
        ItemSeparatorComponent={() => (
          <View style={marginStyle.margin_top_24} />
        )}
        inverted
        style={layoutStyle.flex_1}
        contentContainerStyle={paddingStyle.padding_vertical_18}
      />
      <View
        style={[
          {
            minHeight: SIZE_54,
            maxHeight: SIZE_54 * 4,
          },
          layoutStyle.flex_direction_row,
          layoutStyle.align_item_flex_end,
          paddingStyle.padding_horizontal_12,
          paddingStyle.padding_vertical_6,
        ]}
      >
        <View
          style={[
            layoutStyle.flex_direction_row,
            layoutStyle.flex_1,
            layoutStyle.align_self_stretch,
            borderStyle.border_radius_24,
            backgroundStyle.background_dove_grey,
            paddingStyle.padding_horizontal_12,
            layoutStyle.align_item_center,
          ]}
        >
          <TextInput
            placeholder="write a message..."
            style={[layoutStyle.flex_fill, { fontSize: SIZE_15 }]}
            multiline
            value={messageText}
            onChangeText={setMessageText}
          />
          {messageText === "" && (
            <>
              <Icon
                name="attach"
                size={SIZE_20}
                style={marginStyle.margin_right_18}
              />
              <Icon name="photo-camera-outline" size={SIZE_20} />
            </>
          )}
        </View>
        <Pressable style={marginStyle.margin_left_6} onPress={onSend}>
          <IconCircle name="arrow-right" solid size={SIZE_40} />
        </Pressable>
      </View>
    </StackContainer>
  );
}
