import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../styles";
import SolidButton from "./SolidButton";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/storeHooks";
import { selectInboxParams } from "../store/client/client.selector";
import useAccountParams from "../hooks/accountHook";
import Avatar from "./Avatar";
import AppText from "./AppText";
import { COLOR_1, COLOR_2, COLOR_5 } from "../constants";
import { getAccounts } from "../mocks/accounts";
import { addManyAccountToStore } from "../store/account/account.slice";
import { addChatsToInbox } from "../store/client/client.slice";
import Icon from "./Icon";
import AppTextInput from "./AppTextInput";

export type ChatListItemProps = {
  accountId: string;
  onSelect: (accountId: string, username: string) => void;
  selected: boolean;
};

export function ChatListItem({
  accountId,
  onSelect,
  selected,
}: ChatListItemProps) {
  const { accountParams } = useAccountParams(accountId, ["fullname"]);

  if (!accountParams) {
    return null;
  }

  const pressCallback = useCallback(
    () => onSelect(accountId, accountParams.username),
    [onSelect, accountId, accountParams.username]
  );

  return (
    <Pressable
      style={[
        paddingStyle.padding_horizontal_12,
        paddingStyle.padding_vertical_6,
        layoutStyle.align_item_center,
        layoutStyle.flex_direction_row,
      ]}
      onPress={pressCallback}
    >
      <Avatar url={accountParams.profilePictureUrl} size={48} />
      <View style={[marginStyle.margin_left_6, layoutStyle.flex_1]}>
        <AppText>{accountParams.username}</AppText>
        <AppText size={11} color={COLOR_2}>
          {accountParams.fullname}
        </AppText>
      </View>
      {!selected ? (
        <Icon name="radio-unchecked" size={24} color={COLOR_2} />
      ) : (
        <Icon name="tick-circle-solid" size={24} color={COLOR_5} />
      )}
    </Pressable>
  );
}

export function SelectedItem({ id, name }: SelectedChatItemParams) {
  return (
    <View
      style={[
        paddingStyle.padding_horizontal_12,
        paddingStyle.padding_vertical_9,
        layoutStyle.align_item_center,
        layoutStyle.flex_direction_row,
        { borderRadius: 18, backgroundColor: COLOR_5 },
        marginStyle.margin_horizontal_3,
      ]}
    >
      <AppText color={COLOR_1}>{name}</AppText>
    </View>
  );
}

export type SelectedChatItemParams = {
  id: string;
  name: string;
};

export default function PostSendSection() {
  const captionTextInputRef = useRef<TextInput>(null);

  const [captionInputHeight, setCaptionInputHeight] = useState(0);

  const [selectedChats, setSelectedChats] = useState<SelectedChatItemParams[]>(
    []
  );

  const inbox = useAppSelector(selectInboxParams);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (inbox.state === "success") {
      return;
    }
    const accounts = getAccounts(20, ["fullname"]);

    dispatch(addManyAccountToStore(accounts));

    dispatch(
      addChatsToInbox({
        accounts: accounts.map((account) => account._id),
      })
    );
  }, [dispatch, inbox.state]);

  const selectCallback = useCallback(
    (id: string, name: string) => {
      setSelectedChats((prevChats) => {
        const selected = prevChats.find((item) => item.id === id);
        if (selected) {
          return prevChats.filter((item) => item.id !== id);
        }
        return [{ id, name }, ...prevChats];
      });
    },
    [setSelectedChats]
  );

  return (
    <View style={layoutStyle.flex_1}>
      <View
        style={[
          paddingStyle.padding_vertical_12,
          borderStyle.border_bottom_width_hairline,
          borderStyle.border_color_2,
          backgroundStyle.background_color_1,
        ]}
      >
        <AppTextInput
          placeholder="Send to..."
          style={marginStyle.margin_horizontal_12}
        />
        {selectedChats.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            overScrollMode="never"
            style={marginStyle.margin_top_9}
            contentContainerStyle={paddingStyle.padding_horizontal_9}
          >
            {selectedChats.map((item) => (
              <SelectedItem {...item} key={item.id} />
            ))}
          </ScrollView>
        )}
      </View>
      <ScrollView
        style={[layoutStyle.flex_1, backgroundStyle.background_color_1]}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        contentContainerStyle={paddingStyle.padding_vertical_12}
        nestedScrollEnabled
      >
        {inbox.data.chats.map((chat) => (
          <ChatListItem
            accountId={chat.accountId}
            key={chat.accountId}
            onSelect={selectCallback}
            selected={
              selectedChats.find((item) => item.id === chat.accountId) !==
              undefined
            }
          />
        ))}
      </ScrollView>
      {selectedChats.length > 0 && (
        <View
          style={[
            borderStyle.border_color_2,
            borderStyle.border_top_width_hairline,
            paddingStyle.padding_12,
            backgroundStyle.background_color_1,
          ]}
        >
          <AppTextInput
            placeholder="write a caption..."
            multiline
            style={[marginStyle.margin_bottom_12]}
            onContentSizeChange={({
              nativeEvent: {
                contentSize: { height },
              },
            }) => {
              setCaptionInputHeight(height);
            }}
          />
          <SolidButton onPress={() => {}} title="send post" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
