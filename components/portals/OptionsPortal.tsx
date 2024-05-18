import { useWindowDimensions } from "react-native";
import { SIZE_15, SIZE_24, SIZE_48 } from "../../constants";
import { layoutStyle, marginStyle, paddingStyle } from "../../styles";
import { IconName } from "../../types/component.types";
import Pressable from "../utility-components/button/Pressable";
import Icon from "../utility-components/icon/Icon";
import Text from "../utility-components/text/Text";
import NewPortal from "./NewPortal";

export type PortalOptionParams = {
  icon: IconName;
  label: string;
  color?: string;
  callback: () => void;
};

export type OptionsPortalProps = {
  options: PortalOptionParams[];
  onClose: () => void;
};

export default function OptionsPortal({
  onClose,
  options,
}: OptionsPortalProps) {
  const { height } = useWindowDimensions();

  const contentHeight = Math.min(height, (options.length + 1) * SIZE_48);

  return (
    <NewPortal onClose={onClose} title="options" contentHeight={contentHeight}>
      {options.map((option, index) => (
        <Pressable
          useUnderlay
          style={[
            paddingStyle.padding_horizontal_12,
            layoutStyle.align_item_center,
            layoutStyle.flex_direction_row,
            {
              height: SIZE_48,
            },
          ]}
          onPress={option.callback}
          key={index}
        >
          <Icon name={option.icon} color={option.color} size={SIZE_24} />
          <Text
            color={option.color}
            style={marginStyle.margin_left_9}
            weight="light_medium"
            size={SIZE_15}
          >
            {option.label}
          </Text>
        </Pressable>
      ))}
    </NewPortal>
  );
}
