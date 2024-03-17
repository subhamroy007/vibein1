import { StyleProp, ViewStyle } from "react-native";
import { LINE_WIDTH, LOGO_BLUE, SIZE_20, SIZE_40 } from "../../../constants";
import { layoutStyle, marginStyle } from "../../../styles";
import { CapsuleProps } from "../../../types/component.types";
import Icon from "../icon/Icon";
import Text from "../text/Text";
import Pressable from "./Pressable";

const Capsule = ({
  icon,
  text,
  size,
  iconScale,
  textScale,
  style,
  weight,
  backgroundColor,
  outlineColor,
  outlined,
  outlineWidth,
  keepBackgroundWithOutline,
  width,
  centerd,
  ...restProps
}: CapsuleProps) => {
  const calculatedSize = size ? size : SIZE_40;

  const calculatedTextColor = outlined ? "black" : "white";

  const calculatedOutlineColor = outlined
    ? outlineColor
      ? outlineColor
      : calculatedTextColor
    : undefined;
  const calculatedOutlineWidth = outlined
    ? outlineWidth
      ? LINE_WIDTH * outlineWidth
      : LINE_WIDTH * 3
    : undefined;

  const calculatedBackgroundColor = backgroundColor
    ? backgroundColor
    : !outlined || keepBackgroundWithOutline
    ? LOGO_BLUE
    : undefined;

  const calculatedTextSize = textScale
    ? textScale * calculatedSize
    : 0.32 * calculatedSize;

  const calculatedIconSize = iconScale
    ? iconScale * calculatedSize
    : 0.5 * calculatedSize;

  const label_style: StyleProp<ViewStyle> = [
    layoutStyle.align_item_center,
    layoutStyle.flex_direction_row,
    {
      height: calculatedSize,
      width: width ? width : "auto",
      backgroundColor: calculatedBackgroundColor,
      borderRadius: calculatedSize,
      borderWidth: calculatedOutlineWidth,
      borderColor: calculatedOutlineColor,
      paddingHorizontal: calculatedSize / 2,
      justifyContent: centerd ? "center" : "flex-start",
    },
  ];

  return (
    <Pressable {...restProps} style={[label_style, style]}>
      <Icon color={calculatedTextColor} name={icon} size={calculatedIconSize} />
      <Text
        color={calculatedTextColor}
        weight={weight ? weight : "semi-bold"}
        style={marginStyle.margin_left_6}
        size={calculatedTextSize}
      >
        {text}
      </Text>
    </Pressable>
  );
};

export default Capsule;
