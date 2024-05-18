import { StyleSheet, View } from "react-native";
import { useAppSelector } from "../../hooks/storeHooks";
import { selectClientAccountParams } from "../../store/client/client.selector";
import { COLOR_2, SIZE_24, SIZE_42 } from "../../constants";
import Avatar from "../Avatar";
import { borderStyle, layoutStyle, marginStyle } from "../../styles";
import Pressable from "../utility-components/button/Pressable";
import Text from "../utility-components/text/Text";

export type CommentBoxPlaceHolderProps = {
  onCommentBoxPress: () => void;
};

const CommentBoxPlaceHolder = ({
  onCommentBoxPress,
}: CommentBoxPlaceHolderProps) => {
  const client = useAppSelector((state) => selectClientAccountParams(state));

  if (!client) return null;

  return (
    <Pressable onPress={onCommentBoxPress} style={root_container_style}>
      <Avatar size={SIZE_24} url={client.profilePictureUri} />
      <Text color={COLOR_2} weight="regular" style={marginStyle.margin_left_6}>
        write a comment
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  root_container: { width: "54%", height: SIZE_42 },
});

const root_container_style = [
  styles.root_container,
  borderStyle.border_color_2,
  borderStyle.border_radius_24,
  borderStyle.border_width_hairline,
  layoutStyle.flex_direction_row,
  layoutStyle.content_center,
];
export default CommentBoxPlaceHolder;
