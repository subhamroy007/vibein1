import { StyleProp, TextStyle } from "react-native";
import { AppDispatch, RootState } from "../store";
import { Tabs } from "expo-router";

export type IconName =
  | "home-outline"
  | "home-solid"
  | "heart-outline"
  | "heart-solid"
  | "search-regular"
  | "search-bold"
  | "bookmark-outline"
  | "bookmark-solid"
  | "comment"
  | "more-horiz"
  | "more-vert"
  | "send-outline"
  | "send-solid"
  | "star-outline"
  | "star-solid"
  | "tag-outline"
  | "tag-solid"
  | "close"
  | "hashtag"
  | "mention"
  | "retry"
  | "tick"
  | "add"
  | "remove"
  | "tick-circle-outline"
  | "tick-circle-solid"
  | "add-circle-outline"
  | "add-circle-solid"
  | "close-circle-outline"
  | "close-circle-solid"
  | "arrow-up"
  | "arrow-down"
  | "arrow-left"
  | "arrow-right"
  | "radio-unchecked"
  | "explore"
  | "report"
  | "delete"
  | "pin-solid"
  | "pin-outline"
  | "edit"
  | "link"
  | "share"
  | "circulate";

export type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

type TabsProps = typeof Tabs extends React.FC<infer P> ? P : never;

export type BottomTabBarProps = Parameters<NonNullable<TabsProps["tabBar"]>>[0];
