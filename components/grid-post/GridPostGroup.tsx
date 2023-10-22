import { View } from "react-native";
import { layoutStyle } from "../../styles";
import { GridPost } from "./GridPost";

export type GridPostGroupProps = {
  posts: string[];
  portrait?: boolean;
  showPin?: boolean;
  showViews?: boolean;
  onPress: (id: string) => void;
  onLongPress: (id: string) => void;
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
