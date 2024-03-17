import { ButtonProps } from "../../../types/component.types";
import PressableGesture from "./PressableGesture";
import { usePressAnimation } from "../../../hooks/utility.hooks";
import { AnimatedLabel } from "../text/Label";

const Button = ({
  style,
  enabled,
  onPress,
  onPressIn,
  onPressOut,
  onLongPress,
  hitSlop,
  children,
  animateOnLongPress,
  animateOnPress,
  ...restProps
}: ButtonProps) => {
  const [animatedStyle, pressCallback, longPressCallback] = usePressAnimation(
    animateOnPress,
    animateOnLongPress,
    onPress,
    onLongPress
  );

  return (
    <PressableGesture
      enabled={enabled}
      hitSlop={hitSlop}
      onLongPress={onLongPress ? longPressCallback : undefined}
      onPress={onPress ? pressCallback : undefined}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <AnimatedLabel {...restProps} style={[style, animatedStyle]} />
    </PressableGesture>
  );
};

export default Button;
