import AppScreen from "../../components/AppScreen";
import Header from "../../components/Header";
import { ScrollView, View, _Image } from "react-native";
import { useState } from "react";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../../styles";
import {
  OCEAN_BLUE,
  SIZE_120,
  SIZE_14,
  SIZE_16,
  SIZE_18,
  SIZE_20,
  SIZE_24,
  SIZE_36,
  SIZE_40,
  SIZE_48,
  SIZE_54,
  SIZE_60,
} from "../../constants";
import Avatar from "../../components/Avatar";
import AppText from "../../components/AppText";
import Icon from "../../components/Icon";
import BasicPressable from "../../components/pressables/BasicPressable";
import CircleIcon from "../../components/CircleIcon";
import MultilineTextInput from "../../components/MultilineTextInput";
import { useAppSelector } from "../../hooks/storeHooks";
import { selectInboxFilteredChats } from "../../store/client/client.selector";
import {
  InboxChatInfoParams,
  InboxDirectChatInfoParams,
} from "../../types/selector.types";
import Animated, { Layout } from "react-native-reanimated";
import { Stack, Tabs } from "expo-router";

const InboxDirectChatItem = ({
  item,
  selected,
  onSelect,
}: {
  item: InboxDirectChatInfoParams;
  selected: boolean;
  onSelect: (item: InboxDirectChatInfoParams, selected: boolean) => void;
}) => {
  return (
    <BasicPressable
      onPress={() => {
        onSelect(item, selected);
      }}
      style={[
        { height: SIZE_60 },
        layoutStyle.align_item_center,
        layoutStyle.flex_direction_row,
        paddingStyle.padding_horizontal_12,
      ]}
    >
      <Avatar size={SIZE_48} url={item.profilePictureUri} />
      <View style={[marginStyle.margin_horizontal_12, layoutStyle.flex_1]}>
        <AppText size={SIZE_14} weight="bold">
          {item.fullname}
        </AppText>
      </View>
      <Icon
        name={selected ? "remove-circle-solid" : "add-circle-solid"}
        size={SIZE_24}
        color={OCEAN_BLUE}
        style={marginStyle.margin_right_6}
      />
    </BasicPressable>
  );
};

export default function Notification() {
  const [selectedChats, setSelectedChats] = useState<InboxChatInfoParams[]>([]);

  const chats = useAppSelector((state) => selectInboxFilteredChats(state, ""));

  return (
    <AppScreen>
      <Header title="Notifications" hideBack />
      {/* 
      <View
        style={[
          { height: SIZE_54 },
          layoutStyle.flex_direction_row,
          layoutStyle.align_item_center,
          paddingStyle.padding_horizontal_18,
          borderStyle.border_bottom_width_hairline,
          borderStyle.border_bottom_color_2,
        ]}
      >
        <Icon
          size={SIZE_20}
          color="grey"
          name="search"
          style={[marginStyle.margin_right_6]}
        />
        <AppText color="grey" size={SIZE_16}>
          search here...
        </AppText>
        <Icon
          size={SIZE_20}
          color="grey"
          name="group-add-outline"
          style={[marginStyle.margin_left_auto]}
        />
      </View>
      {selectedChats.length > 0 ? (
        <Animated.View
          layout={Layout.duration(300)}
          style={[paddingStyle.padding_vertical_8]}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            overScrollMode="never"
          >
            {selectedChats.map((chat) => {
              if (chat.type === "direct") {
                return (
                  <View
                    key={chat.id}
                    style={[
                      backgroundStyle.background_logo_blue,
                      borderStyle.border_radius_24,
                      paddingStyle.padding_horizontal_16,
                      paddingStyle.padding_vertical_8,
                      layoutStyle.align_item_center,
                      marginStyle.margin_horizontal_3,
                      layoutStyle.flex_direction_row,
                    ]}
                  >
                    <AppText weight="semi-bold" size={SIZE_16} color="white">
                      {chat.fullname}
                    </AppText>
                    <Icon
                      name="close-circle-solid"
                      size={SIZE_18}
                      color="white"
                      style={marginStyle.margin_left_6}
                    />
                  </View>
                );
              }
            })}
          </ScrollView>
        </Animated.View>
      ) : undefined}

      <Animated.ScrollView
        style={layoutStyle.flex_1}
        showsVerticalScrollIndicator={false}
        layout={Layout.duration(300)}
      >
        {chats.map((chat) => {
          if (chat.type === "direct") {
            return (
              <InboxDirectChatItem
                selected={
                  selectedChats.findIndex(
                    (selectedChat) => selectedChat.id === chat.id
                  ) > -1
                }
                item={chat}
                key={chat.id}
                onSelect={(selectedChat, selected) => {
                  setSelectedChats((prev) => {
                    if (selected) {
                      return prev.filter((chat) => chat.id !== selectedChat.id);
                    } else {
                      return [...prev, { ...selectedChat, type: "direct" }];
                    }
                  });
                }}
              />
            );
          }
        })}
      </Animated.ScrollView>

      <View
        style={[
          { minHeight: SIZE_54, maxHeight: SIZE_120 },
          borderStyle.border_top_width_hairline,
          borderStyle.border_color_2,
          layoutStyle.flex_direction_row,
          layoutStyle.align_item_center,
          paddingStyle.padding_horizontal_12,
        ]}
      >
        <MultilineTextInput
          text=""
          onTextChange={() => {}}
          placeholder="write caption here..."
        />
        <CircleIcon
          name="arrow-right"
          hasBackground
          size={SIZE_40}
          style={marginStyle.margin_left_12}
        />
      </View> */}
    </AppScreen>
  );
}

/**
 * [Error: Unable to resolve host "i.pinimmg.com": No address associated with hostname]

 */
