import React, { PureComponent } from "react";
import { MultilineTextProps } from "../../../types/component.types";
import { LOGO_BLUE, TEXT_HIGHLIGHT_FILTER } from "../../../constants";
import Text from "./Text";
import Animated from "react-native-reanimated";

export default class MultilineText extends PureComponent<MultilineTextProps> {
  render() {
    const {
      text,
      collapsed,
      hightlightColor,
      onPress,
      numberOfLines,
      color,
      ...restProps
    } = this.props;
    const phases = text.match(TEXT_HIGHLIGHT_FILTER) || [];

    const text_sections: React.JSX.Element[] = [];

    let calculatedHightlightColor = LOGO_BLUE;

    if (hightlightColor === "secondary") {
      calculatedHightlightColor = "grey";
    } else if (hightlightColor && hightlightColor !== "primary") {
      calculatedHightlightColor = hightlightColor;
    }
    let currentOffset = 0;
    for (const phase of phases) {
      const matchIndex = text.indexOf(phase, currentOffset);
      if (matchIndex > currentOffset) {
        text_sections.push(
          <Text
            weight="light_medium"
            key={currentOffset}
            {...restProps}
            color={color}
          >
            {text.substring(currentOffset, matchIndex)}
          </Text>
        );
      }
      currentOffset = matchIndex + phase.length;
      text_sections.push(
        <Text
          weight="light_medium"
          key={phase}
          onPress={() => {
            console.log(phase);
          }}
          color={calculatedHightlightColor}
          {...restProps}
        >
          {phase}
        </Text>
      );
    }

    if (currentOffset < text.length) {
      text_sections.push(
        <Text key={currentOffset} {...restProps} color={color}>
          {text.substring(currentOffset)}
        </Text>
      );
    }

    return (
      <Text
        {...restProps}
        numberOfLines={collapsed ? 1 : numberOfLines ? numberOfLines : 0}
        onPress={onPress}
      >
        {text_sections}
      </Text>
    );
  }
}

export const AnimatedMultilineText =
  Animated.createAnimatedComponent(MultilineText);
