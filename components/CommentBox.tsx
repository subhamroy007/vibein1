import {
  NativeSyntheticEvent,
  Pressable,
  TextInput,
  TextInputSelectionChangeEventData,
  View,
} from "react-native";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../styles";
import { SIZE_18, SIZE_24, SIZE_54 } from "../constants";
import Avatar from "./Avatar";
import { selectClientAccountParams } from "../store/client/client.selector";
import { useAppSelector } from "../hooks/storeHooks";
import Icon from "./Icon";
import { useKeyboard } from "@react-native-community/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import AppText from "./AppText";
import Animated from "react-native-reanimated";
import ReactionBox from "./ReactionBox";

export type CommentBoxProps = {
  replyTo?: string;
  resetReplyState: () => void;
  onSend: (text: string) => void;
};

export default function CommentBox({
  replyTo,
  onSend,
  resetReplyState,
}: CommentBoxProps) {
  const [inputText, setInputText] = useState(""); //state used as the controlled input of the comment box

  const [cursorPosition, setCursorPosition] = useState<{
    start: number;
    end: number;
  }>({ end: 0, start: 0 }); //state used to track the cursor position of the input

  const processedText = inputText.trim(); //trim the text for frther calculation (i.e whether or not to hide the send icon)

  const clientAccountParams = useAppSelector(selectClientAccountParams);

  const textInputRef = useRef<TextInput>(null);

  const { keyboardShown } = useKeyboard();

  const [searchToken, setSearchToken] = useState<string | null>(null);

  /**
   * hook that is invoked when the keyboard is not visible anymore
   * it resets the search token if there was any and also blurs the text input
   */
  useEffect(() => {
    if (!keyboardShown) {
      setSearchToken(null);
      textInputRef.current?.blur();
    }
  }, [keyboardShown, setSearchToken]);

  /**
   * hook that is invoked when the client is replying to someone
   * it resets the input text with the username of the account the client is replying to
   */
  useEffect(() => {
    if (replyTo) {
      setInputText("@" + replyTo + " ");
      textInputRef.current?.focus();
    } else {
      setInputText("");
    }
  }, [replyTo, setInputText]);

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
        const slicedText = inputText.substring(0, selection.start); //slice the text upto the current position of the cursor
        const tokens = slicedText.match(
          /(#[A-Za-z0-9]+|@[A-Za-z_\.][\w\.]{2,})/g
        ); //collect the tokens based on the regular expression
        const lastToken = tokens ? tokens[tokens.length - 1] : null; //get the last token
        //if the sliced text ends with the last token then set that as the search token state or set it back to null
        if (lastToken && slicedText.endsWith(lastToken)) {
          setSearchToken(lastToken);
        } else {
          setSearchToken(null);
        }
      }
    },
    [inputText, setSearchToken, setCursorPosition]
  );

  /**
   * callback function that is invoked when the send icon is pressed
   * it invokes the onSend function to add the comment to the list, resets the input text and also resets
   * the search token if there was any
   * finally it blurs the text input
   */
  const sendCallback = useCallback(() => {
    onSend(processedText);
    setInputText("");
    setSearchToken(null);
    textInputRef.current?.blur();
  }, [onSend, setInputText, setSearchToken]);

  /**
   * callback function that is invoked when an emoji is pressed from the reaction box
   * it inserts the selected emoji to the input box at the current cursor position
   */
  const emojiSelectCallback = useCallback(
    (emoji: string) => {
      setInputText((prevText) => {
        const prefixText = prevText.substring(0, cursorPosition.start);
        const suffixText = prevText.substring(cursorPosition.end);
        return prefixText + emoji + suffixText;
      });
    },
    [cursorPosition, setInputText]
  );

  return (
    <View style={{ position: "absolute", width: "100%", bottom: 0 }}>
      {replyTo && (
        <Animated.View
          style={[
            layoutStyle.align_item_center,
            layoutStyle.flex_direction_row,
            borderStyle.border_color_2,
            borderStyle.border_top_width_hairline,
            layoutStyle.justify_content_space_between,
            paddingStyle.padding_vertical_12,
            paddingStyle.padding_horizontal_12,
          ]}
        >
          <AppText color="grey" weight="regular">
            Replying to @{replyTo}
          </AppText>
          <Pressable onPress={resetReplyState} hitSlop={SIZE_24}>
            <Icon name="close" color="grey" size={SIZE_18} />
          </Pressable>
        </Animated.View>
      )}
      <ReactionBox onSelect={emojiSelectCallback} />
      <View
        style={[
          layoutStyle.flex_direction_row,
          layoutStyle.align_item_center,
          paddingStyle.padding_horizontal_12,
          backgroundStyle.background_color_1,
          {
            height: SIZE_54,
          },
        ]}
      >
        <Avatar url={clientAccountParams.profilePictureUrl} />

        <TextInput
          style={[layoutStyle.flex_1, marginStyle.margin_horizontal_9]}
          placeholder="write a comment..."
          value={inputText}
          ref={textInputRef}
          textAlignVertical="center"
          multiline
          numberOfLines={1}
          onChangeText={setInputText}
          onSelectionChange={selectionChangeCallback}
        />
        {processedText != "" && (
          <Pressable
            style={[layoutStyle.align_self_center]}
            hitSlop={SIZE_24}
            onPress={sendCallback}
          >
            <Icon name="send-outline" size={SIZE_24} />
          </Pressable>
        )}
      </View>
    </View>
  );
}
