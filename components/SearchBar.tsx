import { Pressable } from "react-native";
import { backgroundStyle, layoutStyle, paddingStyle } from "../styles";
import { SIZE_14, SIZE_20, SIZE_36 } from "../constants";
import Text from "./utility-components/text/Text";
import Icon from "./utility-components/icon/Icon";

export type SearchBarProps = {
  onPress: () => void;
};

const SearchBar = ({ onPress }: SearchBarProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        layoutStyle.flex_direction_row,
        layoutStyle.align_item_center,
        paddingStyle.padding_horizontal_12,
        layoutStyle.justify_content_space_between,
        backgroundStyle.background_dove_grey,
        { height: SIZE_36, width: "100%", borderRadius: SIZE_36 },
      ]}
    >
      <Text color="grey" size={SIZE_14}>
        Search here...
      </Text>
      <Icon name="search" size={SIZE_20} color={"grey"} />
    </Pressable>
  );
};

export default SearchBar;
