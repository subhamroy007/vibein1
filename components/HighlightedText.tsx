import React, { useCallback, useState } from "react";
import AppText from "./AppText";
import { StyleProp, TextStyle } from "react-native";
import Animated, { Layout } from "react-native-reanimated";
import { COLOR_5 } from "../constants";

export type HighlightedTextProps = {
  children: string;
  style?: StyleProp<TextStyle>;
};

export default function HighlightedText({
  children,
  style,
}: HighlightedTextProps) {
  const [isExpanded, setExpanded] = useState(false);

  const regex = /(#[A-Za-z0-9]+|@[A-Za-z_\.][\w\.]{2,}|[#@]|.[^#@]+)/g;

  const phases = children.match(regex) || [];

  const onPressCallback = useCallback(() => {
    setExpanded((prevState) => !prevState);
  }, [setExpanded]);

  return (
    <AppText
      style={style}
      ellipsizeMode="tail"
      numberOfLines={isExpanded ? undefined : 2}
      onPress={onPressCallback}
      weight="regular"
    >
      {phases.map((phase, index) => {
        const firstChar = phase.charAt(0);

        if ((firstChar === "#" || firstChar === "@") && phase.length > 1) {
          return (
            <AppText weight="regular" color={COLOR_5} key={phase + index}>
              {phase}
            </AppText>
          );
        }
        return <React.Fragment key={phase + index}>{phase}</React.Fragment>;
      })}
    </AppText>
  );
}
