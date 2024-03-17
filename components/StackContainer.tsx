import { View } from "react-native";
import { backgroundStyle, layoutStyle } from "../styles";
import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useScreenInit } from "../hooks/utility.hooks";
import { ReactNode } from "react";

type StackContainerProps = {
  dark?: boolean;
  avoidEdges?: boolean;
  children?: ReactNode;
};

const StackContainer = ({
  avoidEdges,
  dark,
  children,
}: StackContainerProps) => {
  const insets = useSafeAreaInsets();

  useScreenInit(dark);

  return (
    <View style={layoutStyle.flex_fill}>
      <Stack.Screen
        options={{
          headerShown: false,
          contentStyle: [
            dark
              ? backgroundStyle.background_color_4
              : backgroundStyle.background_color_1,
            {
              paddingBottom: avoidEdges ? 0 : insets.bottom,
              paddingTop: avoidEdges ? 0 : insets.top,
              paddingLeft: avoidEdges ? 0 : insets.left,
              paddingRight: avoidEdges ? 0 : insets.right,
            },
          ],
        }}
      />
      {children}
    </View>
  );
};

export default StackContainer;
