import { TouchableHighlight } from "react-native-gesture-handler";
import { COLOR_2, SIZE_14, SIZE_54, SIZE_70 } from "../../constants";
import { layoutStyle, marginStyle, paddingStyle } from "../../styles";
import IconCircle from "../utility-components/icon/IconCircle";
import Text from "../utility-components/text/Text";
import { TextSearchParams } from "../../types/utility.types";
import { View } from "react-native";

const TextSearchItem = ({ text }: TextSearchParams) => {
  return (
    <TouchableHighlight>
      <View
        style={[
          { height: SIZE_70 },
          layoutStyle.flex_direction_row,
          layoutStyle.align_item_center,
          paddingStyle.padding_horizontal_12,
        ]}
      >
        <IconCircle
          name="search"
          outlineWidth={1}
          size={SIZE_54}
          outlineColor={COLOR_2}
          scale={0.5}
        />
        <Text
          weight="semi-bold"
          size={SIZE_14}
          style={marginStyle.margin_left_6}
        >
          {text}
        </Text>
      </View>
    </TouchableHighlight>
  );
};

export default TextSearchItem;
