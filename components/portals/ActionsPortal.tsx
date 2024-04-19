import { Portal } from "@gorhom/portal";
import ActionsContainer, { ActionsContainerProps } from "./ActionsContainer";
import { Pressable, StyleSheet } from "react-native";
import { backgroundStyle, layoutStyle } from "../../styles";

export type ActionsPortalProps = ActionsContainerProps & {
  onClose: () => void;
};

export default function ActionsPortal({
  actions,
  onClose,
}: ActionsPortalProps) {
  return (
    <Portal>
      <Pressable
        onPress={onClose}
        style={[
          StyleSheet.absoluteFill,
          layoutStyle.content_center,
          backgroundStyle.background_color_3,
        ]}
      >
        <ActionsContainer actions={actions} />
      </Pressable>
    </Portal>
  );
}
