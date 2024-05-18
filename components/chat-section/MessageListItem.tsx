import { Pressable, StyleSheet, View } from "react-native";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { selectMessage } from "../../store/chat/chat.selector";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../../styles";
import Text from "../utility-components/text/Text";
import { SIZE_10, SIZE_12, SIZE_15, SIZE_24, SIZE_6 } from "../../constants";
import MessageTextBubble from "./MessageTextBubble";
import Avatar from "../Avatar";
import { useCallback, useState } from "react";
import ReactionBox from "./ReactionBox";
import ActionsList from "./ActionList";
import { selectClientAccountParams } from "../../store/client/client.selector";
import { setMessageReaction } from "../../store/chat/chat.slice";
import { Portal } from "@gorhom/portal";
import { usePopupNotification } from "../../hooks/utility.hooks";
import { setStringAsync as setClipBoardText } from "expo-clipboard";
import { useBackHandler } from "@react-native-community/hooks";

export default function MessageListItem({ messageId }: { messageId: string }) {
  const [showActions, setActions] = useState(false);

  const showPopup = usePopupNotification();

  const dispatch = useAppDispatch();

  const data = useAppSelector((state) => selectMessage(state, messageId));

  const client = useAppSelector(selectClientAccountParams);

  const changeReaction = useCallback(
    (emoji: string) => {
      setActions(false);
      dispatch(
        setMessageReaction({ emoji, messageId, userId: client!.userId })
      );
    },
    [client, messageId]
  );

  const onCopyText = useCallback(async () => {
    setActions(false);
    await setClipBoardText(data?.text!);
    showPopup("Text Copied to Clipboard");
  }, [data?.text]);

  useBackHandler(() => {
    if (showActions) {
      setActions(false);
      return true;
    }
    return false;
  });

  if (!data) return null;

  let textItem = null;
  let reactionElement = null;

  const { author, uploadedAt, text, reactions } = data;

  if (data.text) {
    textItem = (
      <MessageTextBubble
        text={data.text}
        isClientAuthor={author.isClient}
        isSeen={false}
        onPress={() => setActions(true)}
      />
    );
  }

  if (reactions.length > 0) {
    let reactionChild = null;

    if (reactions.length === 1) {
      reactionChild = (
        <>
          <Avatar size={SIZE_15} url={reactions[0].account.profilePictureUri} />
          <Text>{reactions[0].emoji}</Text>
        </>
      );
    } else if (reactions.length === 2) {
      if (reactions[0].emoji === reactions[1].emoji) {
        reactionChild = (
          <>
            <Avatar
              size={SIZE_15}
              url={reactions[0].account.profilePictureUri}
            />
            <Avatar
              size={SIZE_15}
              url={reactions[1].account.profilePictureUri}
            />
            <Text>{reactions[0].emoji}</Text>
          </>
        );
      } else {
        reactionChild = (
          <>
            <Avatar
              size={SIZE_15}
              url={reactions[0].account.profilePictureUri}
            />
            <Text>{reactions[0].emoji}</Text>
            <Avatar
              size={SIZE_15}
              url={reactions[1].account.profilePictureUri}
            />
            <Text>{reactions[1].emoji}</Text>
          </>
        );
      }
    } else {
      reactionChild = (
        <>
          <Text>{reactions[0].emoji}</Text>
          <Text>{reactions[1].emoji}</Text>
          <Text size={SIZE_12} weight="light_medium">
            {reactions.length}
          </Text>
        </>
      );
    }

    reactionElement = (
      <View
        style={[
          borderStyle.border_radius_24,
          paddingStyle.padding_horizontal_6,
          backgroundStyle.background_dove_grey,
          layoutStyle.flex_direction_row,
          layoutStyle.align_item_center,
          { top: -SIZE_6, height: SIZE_24, right: "10%" },
        ]}
      >
        {reactionChild}
      </View>
    );
  }

  return (
    <View
      style={[
        paddingStyle.padding_horizontal_12,
        author.isClient
          ? layoutStyle.align_item_flex_end
          : layoutStyle.align_item_flex_start,
      ]}
    >
      <View style={[{ maxWidth: "85%" }, layoutStyle.align_item_flex_end]}>
        {textItem}
      </View>

      <View
        style={[
          reactionElement ? undefined : marginStyle.margin_top_6,
          !author.isClient
            ? marginStyle.margin_left_12
            : marginStyle.margin_right_12,
          author.isClient
            ? layoutStyle.align_item_flex_end
            : layoutStyle.align_item_flex_start,
        ]}
      >
        {reactionElement}
        <Text weight="light_medium" size={SIZE_10} color="grey" scale={1}>
          {uploadedAt}
        </Text>
      </View>
      {showActions && (
        <Portal>
          <Pressable
            onPress={() => setActions(false)}
            style={[
              StyleSheet.absoluteFill,
              backgroundStyle.background_color_3,
              layoutStyle.content_center,
            ]}
          >
            <ReactionBox onPress={changeReaction} />
            <ActionsList
              actions={[
                { label: "Copy", onPress: onCopyText, icon: "copy-outline" },
                {
                  label: "Reply",
                  onPress: () => {
                    setActions(false);
                    showPopup("No Internet connection");
                  },
                  icon: "reply",
                },
                {
                  label: "Send",
                  onPress: () => {
                    setActions(false);
                    showPopup("No Internet connection");
                  },
                  icon: "forward",
                },
              ]}
            />
          </Pressable>
        </Portal>
      )}
    </View>
  );
}
