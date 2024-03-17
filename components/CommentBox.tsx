import {
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  TextInputSelectionChangeEventData,
  View,
} from "react-native";
import {
  backgroundStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../styles";
import {
  SIZE_12,
  SIZE_18,
  SIZE_24,
  SIZE_36,
  SIZE_42,
  SIZE_54,
} from "../constants";
import Avatar from "./Avatar";
import { selectClientAccountParams } from "../store/client/client.selector";
import { useAppSelector } from "../hooks/storeHooks";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import ReactionBox from "./ReactionBox";
import AppTextInput from "./AppTextInput";
import CircleSolidIcon from "./CircleSolidIcon";
import Animated, {
  SlideInDown,
  SlideInLeft,
  SlideOutDown,
  SlideOutLeft,
} from "react-native-reanimated";
import AppText from "./AppText";
import Icon from "./Icon";
import { useAccountAdapterParams } from "../hooks/account.hooks";

export type CommentBoxProps = {
  onSend: () => void;
  comment: string;
  setComment: Dispatch<SetStateAction<string>>;
  replyTo?: string;
  resetReplyTo?: () => void;
  postAuthor: string;
};

export default function CommentBox({
  onSend,
  comment,
  setComment,
  replyTo,
  resetReplyTo,
  postAuthor,
}: CommentBoxProps) {
  const [cursorPosition, setCursorPosition] = useState<{
    start: number;
    end: number;
  }>({ end: 0, start: 0 }); //state used to track the cursor position of the input

  const processedText = comment.trim(); //trim the text for frther calculation (i.e whether or not to hide the send icon)

  const clientAccountParams = useAppSelector(selectClientAccountParams);

  const [searchToken, setSearchToken] = useState<string | null>(null);

  /**
   * callback that is invoked every time the position of the cursor changes
   * it sets the corresponding state of the cursor position
   * based on the position of the cusrsor it also finds the last token of the input text upto the position
   * of the cursor and if that token is a hashtag or an account mention it also sets the corresponding search
   * token state so that appropriate suggestions can be shown
   */
  const selectionChangeCallback = useCallback(
    ({
      nativeEvent: { selection },
    }: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
      //if the start and end of the selection is same then set it to the cursor position state
      if (selection.start === selection.end) {
        setCursorPosition(selection);
        // const slicedText = inputText.substring(0, selection.start); //slice the text upto the current position of the cursor
        // const tokens = slicedText.match(
        //   /(#[A-Za-z0-9]+|@[A-Za-z_\.][\w\.]{2,})/g
        // ); //collect the tokens based on the regular expression
        // const lastToken = tokens ? tokens[tokens.length - 1] : null; //get the last token
        // //if the sliced text ends with the last token then set that as the search token state or set it back to null
        // if (lastToken && slicedText.endsWith(lastToken)) {
        //   setSearchToken(lastToken);
        // } else {
        //   setSearchToken(null);
        // }
      }
    },
    []
  );

  /**
   * callback function that is invoked when the send icon is pressed
   * it invokes the onSend function to add the comment to the list, resets the input text and also resets
   * the search token if there was any
   * finally it blurs the text input
   */
  // const sendCallback = useCallback(() => {
  //   onSend();
  //   setComment("");
  // }, [onSend]);

  /**
   * callback function that is invoked when an emoji is pressed from the reaction box
   * it inserts the selected emoji to the input box at the current cursor position
   */
  const emojiSelectCallback = useCallback(
    (emoji: string) => {
      setComment((prevText) => {
        const prefixText = prevText.substring(0, cursorPosition.start);
        const suffixText = prevText.substring(cursorPosition.end);
        return prefixText + emoji + suffixText;
      });
    },
    [cursorPosition]
  );

  if (!clientAccountParams) {
    return null;
  }

  const replyToAccountParams = useAccountAdapterParams(replyTo);

  return (
    <View style={styles.root_container}>
      {replyToAccountParams && (
        <Animated.View
          style={styles.reply_box}
          entering={SlideInLeft.duration(200)}
          exiting={SlideOutLeft.duration(200)}
        >
          <Avatar url={replyToAccountParams.profilePictureUri} size={SIZE_24} />
          <AppText
            color="grey"
            weight="regular"
            size={SIZE_12}
            style={styles.reply_box_text}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Replying to @{replyToAccountParams.username}
          </AppText>
          <Pressable hitSlop={SIZE_36} onPress={resetReplyTo}>
            <Icon name="close" color="grey" size={SIZE_18} />
          </Pressable>
        </Animated.View>
      )}
      <ReactionBox onSelect={emojiSelectCallback} />
      <View style={[styles.comment_box]}>
        <Avatar url={clientAccountParams.profilePictureUri} />
        <AppTextInput
          style={styles.text_input}
          placeholder={`write a comment to ${postAuthor}`}
          value={comment}
          textAlignVertical="center"
          multiline
          onChangeText={setComment}
          onSelectionChange={selectionChangeCallback}
        />
        {processedText != "" && (
          <Pressable hitSlop={SIZE_24} onPress={onSend}>
            <CircleSolidIcon iconName="send-outline" size={SIZE_36} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  comment_box: {
    minHeight: SIZE_54,
    ...layoutStyle.flex_direction_row,
    ...layoutStyle.align_item_center,
    ...paddingStyle.padding_horizontal_12,
    ...backgroundStyle.background_color_1,
    zIndex: 3,
  },
  text_input: {
    minHeight: SIZE_54,
    ...layoutStyle.flex_1,
    ...paddingStyle.padding_horizontal_9,
  },
  reply_box: {
    height: SIZE_42,
    ...layoutStyle.align_item_center,
    ...layoutStyle.flex_direction_row,
    ...paddingStyle.padding_horizontal_12,
    ...backgroundStyle.background_dove_grey,
    zIndex: 1,
  },
  root_container: {
    ...layoutStyle.position_absolute,
    ...layoutStyle.width_100_percent,
    ...layoutStyle.justify_content_flex_end,
    bottom: 0,
  },
  reply_box_text: {
    ...layoutStyle.flex_1,
    ...marginStyle.margin_horizontal_6,
  },
});
