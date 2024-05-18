import { View } from "react-native";
import { useAppSelector } from "../../hooks/storeHooks";
import { selectMessagePlaceHolderById } from "../../store/chat/chat.adater";
import { layoutStyle, marginStyle, paddingStyle } from "../../styles";
import MessageTextBubble from "./MessageTextBubble";
import Text from "../utility-components/text/Text";
import { SIZE_10 } from "../../constants";

export default function MessageDraft({ draftId }: { draftId: string }) {
  const data = useAppSelector((state) =>
    selectMessagePlaceHolderById(state.chat.messagePlaceHolders, draftId)
  );

  if (!data) return null;

  const { error, isSending, attachment, text } = data;

  let textItem = null;

  if (text) {
    textItem = (
      <MessageTextBubble
        text={text}
        isClientAuthor
        isSeen={false}
        onPress={() => {}}
      />
    );
  }

  return (
    <View
      style={[
        paddingStyle.padding_horizontal_12,
        layoutStyle.align_item_flex_end,
      ]}
    >
      <View style={[{ maxWidth: "85%" }, layoutStyle.align_item_flex_end]}>
        {textItem}
      </View>

      <Text
        weight="light_medium"
        size={SIZE_10}
        color={error ? "red" : "grey"}
        scale={1}
        style={[marginStyle.margin_right_12, marginStyle.margin_top_6]}
      >
        {isSending ? "Sending..." : error ? "Failed" : "Pending"}
      </Text>
    </View>
  );
}
