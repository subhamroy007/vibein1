import { View } from "react-native";
import AppText from "../AppText";
import { COLOR_1 } from "../../constants";
import { backgroundStyle, borderStyle, paddingStyle } from "../../styles";

const container_style = [
  borderStyle.border_radius_12,
  backgroundStyle.background_ocean_blue,
  paddingStyle.padding_horizontal_8,
  paddingStyle.padding_vertical_3,
];

const NotificationBanner = ({ count }: { count: number }) => {
  return (
    <View style={container_style}>
      <AppText color={COLOR_1} weight="semi-bold">
        {count}
      </AppText>
    </View>
  );
};

export default NotificationBanner;
