import { ReactNode, useCallback } from "react";
import { backgroundStyle, layoutStyle } from "../styles";
import { useAppDispatch } from "../hooks/storeHooks";
import { setFullScreenActiveState } from "../store/client/client.slice";
import { setStatusBarStyle } from "expo-status-bar";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";

export type AppScreenProps = {
  children?: ReactNode;
  dark?: boolean;
};

const AppScreen = ({ children, dark }: AppScreenProps) => {
  const dispatch = useAppDispatch();
  const screenFocusCallback = useCallback(() => {
    if (dark) {
      dispatch(setFullScreenActiveState(true));
      setStatusBarStyle("light");
    } else {
      dispatch(setFullScreenActiveState(false));
      setStatusBarStyle("dark");
    }
  }, [dark]);

  useFocusEffect(screenFocusCallback);

  return (
    <SafeAreaView
      style={[
        layoutStyle.flex_1,
        layoutStyle.align_self_stretch,
        { overflow: "hidden" },
        dark
          ? backgroundStyle.background_color_4
          : backgroundStyle.background_color_1,
      ]}
    >
      <View
        style={[
          layoutStyle.flex_1,
          layoutStyle.align_self_stretch,
          { overflow: "hidden" },
        ]}
      >
        {children}
      </View>
    </SafeAreaView>
  );
};

export default AppScreen;
