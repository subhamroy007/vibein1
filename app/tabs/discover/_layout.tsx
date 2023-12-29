import { Stack, Tabs } from "expo-router";

export default function DiscoverStack() {
  return (
    <Stack
      screenOptions={{
        animation: "slide_from_right",
        animationDuration: 400,
      }}
    />
  );
}
