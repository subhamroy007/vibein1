import {
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { selectMessageParams } from "../../store/inbox/chat.selector";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../../styles";
import AppText from "../AppText";
import {
  SIZE_11,
  SIZE_12,
  SIZE_16,
  SIZE_30,
  SIZE_6,
  SIZE_60,
} from "../../constants";
import { getLocalTimeStringFromUTC } from "../../utility";
import {
  Gesture,
  GestureDetector,
  Swipeable,
} from "react-native-gesture-handler";

import Animated from "react-native-reanimated";
import { useCallback, useMemo, useRef, useState } from "react";
import { Portal } from "@gorhom/portal";
import {
  removeMessage,
  setMessageReaction,
} from "../../store/inbox/chat.slice";
import ReactionBox from "./ReactionBox";
import MediaAttachment from "./MediaAttachment";
import Options from "./Options";
import * as Clipboard from "expo-clipboard";

const Message = ({ id }: { id: string }) => {
  const { width: screenWidth } = useWindowDimensions();

  const swipableRef = useRef<Swipeable | null>(null);

  const [reactionBoxPosition, setReactionBoxPosition] = useState<number | null>(
    null
  );

  const hideReactionBox = useCallback(() => {
    setReactionBoxPosition(null);
  }, []);

  const messageParams = useAppSelector((state) =>
    selectMessageParams(state, id)
  );

  const clientInfo = useAppSelector((state) => state.client.loggedInAccount);

  const dispatch = useAppDispatch();

  const longPressGesture = Gesture.LongPress()
    .onStart(({ absoluteY }) => {
      setReactionBoxPosition(absoluteY);
    })
    .minDuration(200)
    .runOnJS(true);

  const caption_text_cached_style = useMemo<StyleProp<TextStyle>>(
    () => [
      messageParams?.author.isClient
        ? messageParams.seenByReceipient
          ? backgroundStyle.background_cerulean_blue
          : backgroundStyle.background_mint_green
        : backgroundStyle.background_dove_grey,
      paddingStyle.padding_horizontal_12,
      paddingStyle.padding_vertical_6,
      borderStyle.border_radius_24,
      { maxWidth: 0.8 * screenWidth },
    ],
    [messageParams?.author.isClient, messageParams?.seenByReceipient]
  );

  const timestamp_text_cached_style = useMemo<StyleProp<TextStyle>>(
    () => [
      marginStyle.margin_top_9,
      messageParams?.author.isClient
        ? marginStyle.margin_right_12
        : marginStyle.margin_left_12,
    ],
    [messageParams?.author.isClient]
  );

  const reactCallback = useCallback(
    (reactionEmoji: string) => {
      setReactionBoxPosition(null);
      dispatch(
        setMessageReaction({
          messageId: id,
          clientUsername: clientInfo!.userId,
          reactionEmoji,
        })
      );
    },
    [clientInfo, id]
  );

  if (!messageParams || !clientInfo) return null;

  const { author, createdAt, body, state, reactionInfo } = messageParams;

  return (
    <GestureDetector gesture={longPressGesture}>
      <Animated.View style={root_container_style}>
        <Animated.View
          style={[
            author.isClient
              ? layoutStyle.align_self_end
              : layoutStyle.align_self_start,
            author.isClient
              ? layoutStyle.align_item_flex_end
              : layoutStyle.align_item_flex_start,
          ]}
        >
          {body.attachment && body.attachment.type === "media" && (
            <MediaAttachment files={body.attachment.media} />
          )}
          {body.text ? (
            <AppText
              color={author.isClient ? "white" : "black"}
              weight="medium"
              size={SIZE_16}
              isMultiline
              dataDetectorType={"all"}
              style={[caption_text_cached_style]}
            >
              {body.text}
            </AppText>
          ) : undefined}
          <AppText
            size={SIZE_11}
            style={timestamp_text_cached_style}
            weight="semi-bold"
            color={"grey"}
          >
            {getLocalTimeStringFromUTC(createdAt)}
          </AppText>
        </Animated.View>
        {reactionBoxPosition !== null ? (
          <Portal>
            <Pressable
              onPress={hideReactionBox}
              style={[
                StyleSheet.absoluteFill,
                layoutStyle.align_item_center,
                { backgroundColor: "rgba(0, 0, 0, 0.3)" },
              ]}
            >
              <ReactionBox
                position={reactionBoxPosition - SIZE_60}
                onReact={reactCallback}
              />
              <Options
                position={reactionBoxPosition - 60}
                options={[
                  { icon: "forward", label: "Forward", callback: () => {} },
                  { icon: "reply", label: "Reply", callback: () => {} },
                  {
                    icon: "copy-solid",
                    label: "copy-solid",
                    callback: () => {
                      if (body.text) {
                        Clipboard.setStringAsync(body.text);
                      }
                    },
                  },
                  {
                    icon: "delete",
                    label: "Delete",
                    callback: () => {
                      dispatch(
                        removeMessage({ messageId: id, chatId: author.id })
                      );
                    },
                    color: "red",
                  },
                ]}
              />
            </Pressable>
          </Portal>
        ) : undefined}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  reaction_text: {
    left: SIZE_12,
    top: -SIZE_6,
  },
});

const root_container_style: StyleProp<ViewStyle> = [
  paddingStyle.padding_horizontal_12,
  paddingStyle.padding_vertical_9,
  { transform: [{ scaleX: -1 }] },
];

export default Message;
