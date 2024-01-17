import { View } from "react-native";
import { layoutStyle } from "../../styles";
import { GridPost } from "./GridPost";
import { Href } from "expo-router/build/link/href";

export type GridPostGroupProps = {
  posts: string[];
  portrait?: boolean;
  showPin?: boolean;
  showViews?: boolean;
  gridPressRoute?: Href;
  previewPressRoute?: Href;
};

export function GridPostGroup({ posts, ...restProps }: GridPostGroupProps) {
  return (
    <View style={layoutStyle.flex_direction_row}>
      {posts.map((post, index) => (
        <GridPost id={post} key={post} first={index === 0} {...restProps} />
      ))}
    </View>
  );
}
