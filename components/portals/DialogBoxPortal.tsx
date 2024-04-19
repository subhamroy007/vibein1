import { Portal } from "@gorhom/portal";
import { Pressable, StyleSheet } from "react-native";
import { backgroundStyle, layoutStyle } from "../../styles";
import DialogBox, { DialogBoxProps } from "./DialogeBox";

export type DialogBoxPortalProps = DialogBoxProps & {
  onClose: () => void;
};

export default function DialogBoxPortal({
  onClose,
  ...restProps
}: DialogBoxPortalProps) {
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
        <DialogBox {...restProps} />
      </Pressable>
    </Portal>
  );
}
