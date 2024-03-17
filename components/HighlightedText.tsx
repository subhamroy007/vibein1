import React from "react";
import AppText from "./AppText";
import { StyleProp, TextStyle } from "react-native";
import { COLOR_1, COLOR_14, COLOR_2, OCEAN_BLUE } from "../constants";
import { useRouter } from "expo-router";

export type HighlightedTextProps = {
  children: string;
  style?: StyleProp<TextStyle>;
  transparent?: boolean;
  collapsed?: boolean;
  noOfLinesInCollapsedMode?: number;
  onPress?: () => void;
};

export default function HighlightedText({
  children,
  style,
  transparent,
  collapsed,
  noOfLinesInCollapsedMode,
  onPress,
}: HighlightedTextProps) {
  const regex = /(#[A-Za-z0-9]+|@[A-Za-z_\.][\w\.]{2,}|[#@]|.[^#@]+)/g;

  const router = useRouter();

  const phases = children.match(regex) || [];

  return (
    <AppText
      style={style}
      numberOfLines={
        collapsed
          ? noOfLinesInCollapsedMode
            ? noOfLinesInCollapsedMode
            : 1
          : undefined
      }
      onPress={onPress}
      weight="medium"
      isMultiline
      color={transparent ? COLOR_1 : undefined}
    >
      {phases.map((phase, index) => {
        const firstChar = phase.charAt(0);

        if ((firstChar === "#" || firstChar === "@") && phase.length > 1) {
          return (
            <AppText
              isMultiline
              weight="medium"
              color={transparent ? COLOR_2 : OCEAN_BLUE}
              key={phase + index}
              onPress={() => {
                if (firstChar === "@") {
                  router.push({
                    pathname: "/account/[username]",
                    params: { username: phase.slice(1) },
                  });
                } else {
                  router.push({
                    pathname: "/hashtag/[hashtag]",
                    params: { hashtag: phase.slice(1) },
                  });
                }
              }}
            >
              {phase}
            </AppText>
          );
        }
        return <React.Fragment key={phase + index}>{phase}</React.Fragment>;
      })}
    </AppText>
  );
}
