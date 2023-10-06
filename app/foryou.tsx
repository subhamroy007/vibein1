import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { layoutStyle } from "../styles";
import AppText from "../components/AppText";
import { Tabs } from "expo-router";

export default function Foryou() {
  return (
    <SafeAreaView
      style={[
        layoutStyle.flex_1,
        layoutStyle.align_item_center,
        layoutStyle.justify_content_space_around,
      ]}
    >
      <StatusBar translucent={true} hidden={false} />
      <Tabs.Screen
        options={{
          headerTitle: "",
        }}
      />
      <AppText>For you Feed</AppText>
    </SafeAreaView>
  );
}
