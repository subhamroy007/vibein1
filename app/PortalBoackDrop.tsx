import { StyleSheet, View } from "react-native";
import { backgroundStyle, layoutStyle } from "../styles";
import { PortalHost } from "@gorhom/portal";

export default function PortalBackDrop() {
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        layoutStyle.content_center,
        backgroundStyle.background_color_3,
      ]}
    >
      <PortalHost name="backdrop" />
    </View>
  );
}
