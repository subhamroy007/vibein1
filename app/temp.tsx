import { SafeAreaView } from "react-native-safe-area-context";
import { backgroundStyle, layoutStyle } from "../styles";
import { Stack } from "expo-router";

export default function Temp() {
  return (
    <SafeAreaView
      style={[layoutStyle.flex_1, backgroundStyle.background_color_3]}
    >
      <Stack.Screen
        options={{
          presentation: "transparentModal",
          contentStyle: { backgroundColor: "transparent" },
          animation: "slide_from_bottom",
        }}
        key={"temp"}
      />
    </SafeAreaView>
  );
}
