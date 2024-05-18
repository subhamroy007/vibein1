import { StyleSheet, View } from "react-native";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { selectMemoryById } from "../../store/account-store/account.adapter";
import {
  AccountParams,
  SendSectionItemIdentifier,
} from "../../types/utility.types";
import {
  COLOR_1,
  COLOR_2,
  COLOR_6,
  LINE_WIDTH,
  SIZE_1,
  SIZE_12,
  SIZE_14,
  SIZE_15,
  SIZE_2,
  SIZE_24,
  SIZE_30,
  SIZE_36,
  SIZE_48,
  SIZE_54,
  windowWidth,
} from "../../constants";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../../styles";
import Photo from "../Photo";
import Avatar from "../Avatar";
import Text from "../utility-components/text/Text";
import PressableIcon from "../utility-components/button/PressableIcon";
import Pressable from "../utility-components/button/Pressable";
import Video from "../Video";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  changeMemoryLikeRequest,
  sendMemoryReplyRequest,
} from "../../store/account-store/account.thunks";
import Animated, {
  SharedValue,
  cancelAnimation,
  runOnJS,
  runOnUI,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useBackHandler, useKeyboard } from "@react-native-community/hooks";
import { TextInput } from "react-native-gesture-handler";
import { Portal } from "@gorhom/portal";
import SendSection from "../portals/SendSection";

export type MemoryBodyProps = {
  memoryId: string;
  account: AccountParams;
  contentHeight: number;
  useMaxHeight: boolean;
  paused: boolean;
  preload: boolean;
  focused: boolean;
  hideWidgets: boolean;
  onContentReady: (duration?: number) => void;
  barAnimatedValue: SharedValue<number>;
  noOfMemories: number;
  currentIndex: number;
  goToNext: () => void;
};

export default function MemoryBody({
  account,
  memoryId,
  contentHeight,
  useMaxHeight,
  paused,
  preload,
  focused,
  hideWidgets,
  barAnimatedValue,
  currentIndex,
  noOfMemories,
  goToNext,
}: MemoryBodyProps) {
  const [contentReady, setContentReady] = useState(false);

  const [showReplyBox, setReplyBoxState] = useState(false);

  const [showSendPortal, setSendPortalState] = useState(false);

  const [showOptionsPortal, setOptionsPortalState] = useState(false);

  const switchSendPortalState = useCallback(
    () => setSendPortalState((value) => !value),
    []
  );

  const switchOptionsPortalState = useCallback(
    () => setOptionsPortalState((value) => !value),
    []
  );

  const [replyText, setReplyText] = useState("");

  const trimmedText = useRef("");

  trimmedText.current = replyText.trim();

  const { keyboardShown } = useKeyboard();

  const switchReplyBoxState = useCallback(
    () => setReplyBoxState((value) => !value),
    []
  );

  const memoryParams = useAppSelector((state) =>
    selectMemoryById(state.account_store.memories, memoryId)
  );

  const dispatch = useAppDispatch();
  const onLikeIconPress = useCallback(() => {
    dispatch(
      changeMemoryLikeRequest({
        memoryId: memoryParams?.id!,
        value: !memoryParams?.metadata.isLiked!,
      })
    );
  }, [memoryParams?.id, memoryParams?.metadata.isLiked]);

  const barAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: `${barAnimatedValue.value}%`,
    };
  }, []);

  const onLoad = useCallback(() => {
    setContentReady(true);
  }, []);

  const onRepy = useCallback(() => {
    dispatch(
      sendMemoryReplyRequest({ memoryId, replyText: trimmedText.current })
    );
    switchReplyBoxState();
    setReplyText("");
  }, [memoryId]);

  const onSend = useCallback(
    (chats: SendSectionItemIdentifier[], text?: string) => {
      console.log(
        "sending the memory ",
        memoryId,
        " to this chats ",
        chats,
        " with the message ",
        text
      );
    },
    [memoryId]
  );

  useEffect(() => {
    if (paused || showReplyBox || showSendPortal) {
      cancelAnimation(barAnimatedValue);
    } else if (focused) {
      if (contentReady) {
        runOnUI(() => {
          const remainingTime = (100 - barAnimatedValue.value) * 60;
          barAnimatedValue.value = withTiming(
            100,
            { duration: remainingTime },
            (finished) => {
              if (finished) {
                runOnJS(goToNext)();
              }
            }
          );
        })();
      }
    } else {
      cancelAnimation(barAnimatedValue);
      barAnimatedValue.value = 0;
    }
  }, [paused, focused, contentReady, goToNext, showReplyBox, showSendPortal]);

  useEffect(() => {
    return () => {
      setContentReady(false);
    };
  }, [currentIndex]);

  useBackHandler(() => {
    if (showReplyBox) {
      switchReplyBoxState();
      return true;
    }

    return false;
  });

  useEffect(() => {
    if (!keyboardShown) {
      setReplyBoxState(false);
    }
  }, [keyboardShown]);

  if (!memoryParams) return null;

  const barWidth = noOfMemories
    ? Math.round(
        (0.96 * windowWidth - SIZE_1 * (noOfMemories + 1)) / noOfMemories
      )
    : 0;

  const bars = [];

  for (let i = 0; i < noOfMemories; i++) {
    bars.push(i);
  }

  const { content, metadata } = memoryParams;

  return (
    <>
      <View
        style={[
          {
            height: contentHeight,
            top: useMaxHeight ? SIZE_54 : 0,
          },
          layoutStyle.overflow_hidden,
          borderStyle.border_radius_12,
          layoutStyle.width_100_percent,
        ]}
      >
        {content.type === "photo" ? (
          <Photo
            uri={content.uri}
            placeholder={content.blurhash}
            style={layoutStyle.fill}
            onLoad={onLoad}
            showLoadingRing
          />
        ) : (
          <Video
            uri={content.uri}
            preload={preload}
            paused={paused}
            poster={content.poster}
            style={layoutStyle.fill}
            focused
          />
        )}
      </View>
      {!hideWidgets && (
        <View
          style={[
            layoutStyle.flex_direction_row,
            layoutStyle.position_absolute,
            layoutStyle.align_self_center,
            { top: SIZE_2, width: "96%" },
          ]}
        >
          {bars.map((item, index) => (
            <View
              key={item}
              style={[
                {
                  width: barWidth,
                  height: 5 * LINE_WIDTH,
                  borderRadius: SIZE_2,
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  marginHorizontal: SIZE_1,
                },
              ]}
            >
              {index === currentIndex ? (
                <Animated.View
                  style={[
                    layoutStyle.height_100_percent,
                    backgroundStyle.background_color_1,
                    barAnimatedStyle,
                  ]}
                />
              ) : undefined}
            </View>
          ))}
        </View>
      )}
      {!hideWidgets && (
        <View
          style={[
            layoutStyle.position_absolute,
            layoutStyle.width_100_percent,
            layoutStyle.align_item_center,
            layoutStyle.flex_direction_row,
            paddingStyle.padding_horizontal_12,
            { top: SIZE_12 },
          ]}
        >
          <Avatar size={SIZE_30} url={account.profilePictureUri} />
          <View style={[layoutStyle.flex_1, marginStyle.margin_horizontal_12]}>
            <View style={layoutStyle.flex_direction_row}>
              <Text weight="semi-bold" color={COLOR_1}>
                {account.userId}
              </Text>
              <Text
                weight="medium"
                color={COLOR_2}
                style={marginStyle.margin_left_12}
              >
                17h
              </Text>
            </View>
          </View>
          <PressableIcon name={"more-vert"} color={COLOR_1} size={SIZE_24} />
        </View>
      )}
      {!hideWidgets && (
        <View
          style={[
            layoutStyle.align_item_center,
            layoutStyle.flex_direction_row,
            layoutStyle.justify_content_space_evenly,
            layoutStyle.position_absolute,
            { bottom: SIZE_12 },
            layoutStyle.width_100_percent,
          ]}
        >
          <PressableIcon
            name={"send-outline"}
            color={COLOR_1}
            onPress={switchSendPortalState}
          />
          <Pressable
            style={[
              borderStyle.border_radius_24,
              borderStyle.border_color_2,
              borderStyle.border_width_hairlinex2,
              { width: "60%", height: SIZE_36, borderWidth: 1 },
              layoutStyle.justify_content_center,
              layoutStyle.align_item_flex_start,
              paddingStyle.padding_horizontal_18,
            ]}
            onPress={switchReplyBoxState}
          >
            <Text weight="regular" size={SIZE_14} color={COLOR_2}>
              write a reply...
            </Text>
          </Pressable>
          <PressableIcon
            name={metadata.isLiked ? "heart-solid" : "heart-outline"}
            color={metadata.isLiked ? COLOR_6 : COLOR_1}
            animateOnPress
            onPress={onLikeIconPress}
          />
        </View>
      )}
      {showReplyBox && (
        <Portal>
          <View
            style={[
              StyleSheet.absoluteFill,
              backgroundStyle.background_color_3,
              layoutStyle.justify_content_flex_end,
              layoutStyle.align_item_center,
            ]}
          >
            <View
              style={[
                { width: "95%", height: SIZE_48 },
                backgroundStyle.background_color_4,
                borderStyle.border_radius_24,
                layoutStyle.flex_direction_row,
                layoutStyle.align_item_center,
                paddingStyle.padding_horizontal_18,
                marginStyle.margin_bottom_12,
              ]}
            >
              <TextInput
                autoFocus
                style={[
                  layoutStyle.flex_1,
                  { color: COLOR_1, fontSize: SIZE_15 },
                ]}
                placeholderTextColor={COLOR_1}
                placeholder="write a reply..."
                value={replyText}
                onChangeText={setReplyText}
                onSubmitEditing={onRepy}
              />
              {trimmedText.current !== "" && (
                <Text
                  weight="semi-bold"
                  color={COLOR_1}
                  size={SIZE_15}
                  style={marginStyle.margin_left_12}
                  onPress={onRepy}
                >
                  Send
                </Text>
              )}
            </View>
          </View>
        </Portal>
      )}
      {showSendPortal && (
        <Portal>
          <SendSection onDismiss={switchSendPortalState} onSend={onSend} />
        </Portal>
      )}
    </>
  );
}
