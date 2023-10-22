import { Stack, Tabs } from "expo-router";
import { backgroundStyle } from "../../styles";

export default function DiscoverStack() {
  return (
    <>
      <Tabs.Screen
        options={{
          headerShown: false,
        }}
      />
      <Stack
        screenOptions={{
          animation: "slide_from_right",
          animationDuration: 400,
          contentStyle: backgroundStyle.background_color_1,
        }}
      />
    </>
  );
}
