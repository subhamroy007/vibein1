import { ReactNode } from "react";
import { layoutStyle } from "../styles";
import { View } from "react-native";
import { useScreenInit } from "../hooks/utility.hooks";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type AppScreenProps = {
  children?: ReactNode;
  dark?: boolean;
  avoidEdges?: boolean;
};

const AppScreen = ({ children, dark, avoidEdges }: AppScreenProps) => {
  useScreenInit(dark);

  const { bottom, left, right, top } = useSafeAreaInsets();

  return (
    <View
      style={[
        layoutStyle.flex_fill,
        layoutStyle.overflow_hidden,
        {
          marginBottom: avoidEdges ? 0 : bottom,
          marginTop: avoidEdges ? 0 : top,
          marginLeft: avoidEdges ? 0 : left,
          marginRight: avoidEdges ? 0 : right,
        },
      ]}
    >
      {children}
    </View>
  );
};

export default AppScreen;
