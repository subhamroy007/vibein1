import { View } from "react-native";
import { useAppSelector } from "../../hooks/storeHooks";
import { selectMessage } from "../../store/chat/chat.selector";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../../styles";
import Text from "../utility-components/text/Text";
import {
  SIZE_10,
  SIZE_12,
  SIZE_15,
  SIZE_18,
  SIZE_24,
  SIZE_6,
  SIZE_9,
} from "../../constants";
import MessageTextBubble from "./MessageTextBubble";
import Avatar from "../Avatar";
import { getProfilePictureUrl } from "../../mocks/data";

export default function MessageListItem({ messageId }: { messageId: string }) {
  const data = useAppSelector((state) => selectMessage(state, messageId));

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
    </View>
  );
}
