import { Animated, View } from "react-native";
import { Route } from "react-native-tab-view";
import { layoutStyle } from "../../styles";
import { SIZE_3, SIZE_45, SIZE_6 } from "../../constants";
import Icon from "../utility-components/icon/Icon";
import { IconName } from "../../types/component.types";
import Text from "../utility-components/text/Text";

export type TabBarProps = {
  routes: Route[];
  index: number;
  offset: Animated.AnimatedInterpolation<number>;
};

export default function TabBar({ routes, index, offset }: TabBarProps) {
  return (
    <View
      style={[
        layoutStyle.flex_direction_row,
        layoutStyle.align_item_center,
        layoutStyle.justify_content_space_around,
        {
          height: SIZE_45,
        },
      ]}
    >
      {routes.map((route) => {
        if (route.icon) {
          return <Icon name={route.icon as IconName} key={route.key} />;
        } else {
          return (
            <Text weight="bold" key={route.key}>
              {route.title ? route.title : route.key}
            </Text>
          );
        }
      })}
      <Animated.View
        style={[
          layoutStyle.position_absolute,
          {
            bottom: 0,
            left: 0,
            width: `${100 / routes.length}%`,
            height: SIZE_3,
            backgroundColor: "black",
            transform: [{ translateX: offset }],
          },
        ]}
      />
    </View>
  );
}
