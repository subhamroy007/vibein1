import { Stack } from "expo-router";
import { backgroundStyle } from "../../styles";

export default function Home() {
  return (
    <Stack
      screenOptions={{
        animation: "slide_from_right",
        animationDuration: 400,
        contentStyle: backgroundStyle.background_color_1,
      }}
    />
  );
}
