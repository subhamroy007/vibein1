import {
  KeyboardAvoidingView,
  ListRenderItemInfo,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SendListItem from "../send_section/SendListItem";
import SwipeUpPortal, { SwipeUpPortalRefParams } from "./SwipeUpPortal";
import { selectInboxAndSuggested } from "../../store/client/client.selector";
import {
  ChatItemIdentifierParams,
  ChatItemSelectorParams,
} from "../../types/selector.types";
import { Dictionary } from "@reduxjs/toolkit";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../../styles";
import {
  DOVE_GREY,
  SIZE_100,
  SIZE_12,
  SIZE_120,
  SIZE_14,
  SIZE_15,
  SIZE_18,
  SIZE_42,
  SIZE_54,
  SIZE_60,
  SIZE_90,
} from "../../constants";
import SearchBox from "../utility-components/SearchBox";
import { fetchSendSectionAccounts } from "../../store/client/client.thunk";
import Text from "../utility-components/text/Text";
import Spinner from "../utility-components/Spinner";
import { shallowEqual } from "react-redux";
import Animated, {
  interpolate,
  useAnimatedKeyboard,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { TextInput } from "react-native-gesture-handler";
import PressableIconCircle from "../utility-components/button/PressableIconCircle";
import { useDeviceLayout } from "../../hooks/utility.hooks";
import PressableIcon from "../utility-components/button/PressableIcon";

export type SendSectionProps = {
  onDismiss: () => void;
  onSend: (sendTo: ChatItemIdentifierParams[], message: string | null) => void;
};

export default function SendSection({ onDismiss, onSend }: SendSectionProps) {
  const { height: window_height } = useWindowDimensions();

  // const { cappedHeight: window_height } = useDeviceLayout();
  console.log(window_height);
  const portalPosition = useSharedValue(0);

  const portalRef = useRef<SwipeUpPortalRefParams | null>(null);

  const [messageText, setMessageText] = useState("");

  const trimmedMessageText = useRef("");
  trimmedMessageText.current = messageText.trim();

  const abortCallback = useRef<(() => void) | null>(null); //callback reference to abort an ongoing search request
  const [searchPhase, setSearchPhase] = useState(""); //current search phase

  const [isSearchLoading, setSearchLoading] = useState(false); //boolean to indicate the search loading state
  const [isSearchError, setSearchError] = useState(false); //boolean to indicate the search error state

  const lastSeachedPhase = useRef<string | null>(null); // reference to the last searched phase
  const trimmedText = searchPhase.trim(); //trim the text
  const { height: keyboardHeight, state: keyboardState } = useAnimatedKeyboard({
    isStatusBarTranslucentAndroid: true,
  });

  const [searchedAccounts, setSearchedAccounts] = useState<
    Dictionary<ChatItemSelectorParams[]>
  >({});

  const [selectedItems, setSelectedItems] = useState<
    (ChatItemSelectorParams & { searched: boolean })[]
  >([]);

  const filteredAccounts = searchedAccounts[searchPhase];

  const dispatch = useAppDispatch();

  const { inboxAndSuggested } = useAppSelector(
    (state) => selectInboxAndSuggested(state),
    shallowEqual
  );

  const { isTextBlank, listData, searchRank } = useMemo(() => {
    let listData: ChatItemSelectorParams[] = [];
    let searchRank = -1;
    let isTextBlank = true;
    if (trimmedText === "") {
      const filteredList = selectedItems.filter((item) => item.searched);
      searchRank = filteredList.length;
      isTextBlank = true;
      listData.push(...filteredList, ...inboxAndSuggested);
    } else {
      const filteredList = inboxAndSuggested.filter((item) =>
        item.name.startsWith(searchPhase)
      );
      searchRank = filteredList.length;
      isTextBlank = false;
      listData.push(...filteredList);
      if (filteredAccounts) {
        listData.push(...filteredAccounts);
      }
    }
    return { listData, searchRank, isTextBlank };
  }, [trimmedText, selectedItems, filteredAccounts, inboxAndSuggested]);

  const onItemPress = useCallback(
    (
      targetItem: ChatItemSelectorParams,
      select: boolean,
      searched: boolean
    ) => {
      if (select) {
        setSelectedItems((value) => {
          return [...value, { ...targetItem, searched }];
        });
      } else {
        setSelectedItems((value) => {
          return value.filter((item) => item.id !== targetItem.id);
        });
      }
    },
    []
  );

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<ChatItemSelectorParams>) => {
      return (
        <SendListItem
          item={item}
          selected={selectedItems.findIndex((chat) => chat.id === item.id) > -1}
          onPress={onItemPress}
          searched={isTextBlank ? index < searchRank : index >= searchRank}
        />
      );
    },
    [isTextBlank, searchRank, onItemPress, selectedItems]
  );

  const onSendButtonPress = useCallback(() => {
    if (portalRef.current) {
      portalRef.current.close(() => {
        onSend(
          selectedItems,
          trimmedMessageText.current !== "" ? trimmedMessageText.current : null
        );
      });
    }
  }, [onSend, selectedItems]);

  //logic to fetch the searched accounts
  useEffect(() => {
    lastSeachedPhase.current = trimmedText; //set the trimmed text as the last searched phase ref
    if (trimmedText !== "" && !filteredAccounts) {
      //if no accounts is available for the non-empty trimmed text then send the search request
      setSearchLoading(true); //set the search loading state to true
      setSearchError(false); //reset the search state
      const promise = dispatch(
        fetchSendSectionAccounts({ searchPhase: trimmedText })
      ); //store the promise of the sent request
      abortCallback.current = promise.abort; //set the abort callback of the promise as the abortCallback ref
      promise
        .unwrap()
        .then((value) => {
          //in case new account is found, store them in the dictionary
          const searchResult = value.accounts
            .filter(
              (account) =>
                inboxAndSuggested.findIndex(
                  (item) => item.id === account.id
                ) === -1
            )
            .map<ChatItemSelectorParams>((account) => ({
              type: "one-to-one",
              ...account,
              name: account.name!,
            }));
          setSearchedAccounts((value) => {
            return {
              ...value,
              [trimmedText]: searchResult,
            };
          });
        })
        .catch(() => {
          if (trimmedText === lastSeachedPhase.current) {
            //if the request is failed and the trimmed text is still the last seached text then set the search error state to true
            setSearchError(true);
          }
        })
        .finally(() => {
          if (trimmedText === lastSeachedPhase.current) {
            //if the trimmed text is still the last searched phase then set the loading state to true and reset the last search phase ref and abort callback ref to null
            setSearchLoading(false);
            lastSeachedPhase.current = null;
            abortCallback.current = null;
          }
        });
    }

    return () => {
      if (abortCallback.current) {
        // incase the search phase is changed and the last search request is still not finished, abort it
        abortCallback.current();
        abortCallback.current = null;
      }
    };
  }, [trimmedText, filteredAccounts]);

  let placeholder = null;
  if (trimmedText !== "" && !isSearchLoading) {
    //in case the data is available and the show data ref is set to true set the placeholder

    placeholder = (
      <View style={placeholder_style}>
        <Text weight="semi-bold" color="grey">
          {isSearchError ? "Request failed" : "No result found"}
        </Text>
      </View>
    );
  }

  let footer = null;
  if (isSearchLoading) {
    footer = (
      <View style={placeholder_style}>
        <Spinner size={SIZE_18} style={marginStyle.margin_right_9} />
        <Text weight="semi-bold" color="grey">
          Searching...
        </Text>
      </View>
    );
  }

  let header = (
    <View style={header_style}>
      <SearchBox setText={setSearchPhase} text={searchPhase} />
    </View>
  );

  const portalFooterAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY:
            interpolate(portalPosition.value, [0, 1], [-window_height, 0]) -
            keyboardHeight.value,
        },
      ],
    };
  }, [window_height]);

  return (
    <SwipeUpPortal
      ref={portalRef}
      onClose={onDismiss}
      title="send"
      contentHeight={window_height}
      position={portalPosition}
    >
      <Animated.FlatList
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        ListEmptyComponent={placeholder}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        style={layoutStyle.flex_1}
        data={listData}
        renderItem={renderItem}
        keyboardDismissMode={"none"}
        keyboardShouldPersistTaps={"always"}
      />
      {selectedItems.length > 0 ? (
        <Animated.View
          style={[
            { height: SIZE_60, bottom: 0 },
            layoutStyle.position_absolute,
            layoutStyle.width_100_percent,
            borderStyle.border_top_width_hairline,
            borderStyle.border_color_2,
            portalFooterAnimatedStyle,
            layoutStyle.flex_direction_row,
            layoutStyle.align_item_center,
            paddingStyle.padding_horizontal_12,
            backgroundStyle.background_color_1,
          ]}
        >
          <TextInput
            style={[layoutStyle.flex_fill, { fontSize: SIZE_15 }]}
            placeholder="write message..."
            onSubmitEditing={onSendButtonPress}
          />
          <PressableIconCircle
            name={"arrow-right"}
            solid
            size={SIZE_42}
            onPress={onSendButtonPress}
          />
        </Animated.View>
      ) : (
        <Animated.View
          style={[
            { height: SIZE_100, bottom: 0 },
            layoutStyle.position_absolute,
            layoutStyle.width_100_percent,
            borderStyle.border_top_width_hairline,
            borderStyle.border_color_2,
            portalFooterAnimatedStyle,
            layoutStyle.flex_direction_row,
            layoutStyle.align_item_center,
            layoutStyle.justify_content_space_around,
            backgroundStyle.background_color_1,
          ]}
        >
          <View style={layoutStyle.align_item_center}>
            <PressableIconCircle
              name={"link"}
              solid
              size={SIZE_54}
              scale={0.5}
              backgroundColor={DOVE_GREY}
              color={"black"}
            />
            <Text size={SIZE_12} style={marginStyle.margin_top_6}>
              Copy Link
            </Text>
          </View>
          <View style={layoutStyle.align_item_center}>
            <PressableIconCircle
              name={"share"}
              solid
              size={SIZE_54}
              scale={0.5}
              backgroundColor={DOVE_GREY}
              color={"black"}
            />
            <Text size={SIZE_12} style={marginStyle.margin_top_6}>
              Share To
            </Text>
          </View>
          <View style={layoutStyle.align_item_center}>
            <PressableIconCircle
              name={"circulate"}
              solid
              size={SIZE_54}
              scale={0.5}
              backgroundColor={DOVE_GREY}
              color={"black"}
            />
            <Text size={SIZE_12} style={marginStyle.margin_top_6}>
              Add To Story
            </Text>
          </View>
        </Animated.View>
      )}
    </SwipeUpPortal>
  );
}

const styles = StyleSheet.create({
  header: {
    height: SIZE_90,
  },
});

const placeholder_style = [
  marginStyle.margin_top_24,
  layoutStyle.flex_direction_row,
  layoutStyle.content_center,
];

const header_style = [styles.header, layoutStyle.content_center];
