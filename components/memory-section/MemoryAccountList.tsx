import { useCallback } from "react";
import { FlatList, ListRenderItemInfo, View } from "react-native";
import { MemoryAccountStoreParams } from "../../types/store.types";
import MemoryAccount from "./MemoryAccount";
import { borderStyle, marginStyle, paddingStyle } from "../../styles";
import { SIZE_12, SIZE_84 } from "../../constants";

export default function MemoryAccountList({
  data,
}: {
  data?: MemoryAccountStoreParams[] | null;
}) {
  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<MemoryAccountStoreParams>) => {
      return <MemoryAccount userId={item.key} index={index} />;
    },
    []
  );

  const seperator = useCallback(
    () => <View style={marginStyle.margin_left_12} />,
    []
  );

  const getItemLayout = useCallback((_: any, index: number) => {
    return {
      index,
      length: SIZE_84,
      offset: (SIZE_84 + SIZE_12) * index + SIZE_12,
    };
  }, []);

  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      horizontal
      overScrollMode="never"
      data={data}
      renderItem={renderItem}
      contentContainerStyle={content_container_style}
      style={list_style}
      ItemSeparatorComponent={seperator}
      getItemLayout={getItemLayout}
    />
  );
}

const content_container_style = [
  paddingStyle.padding_vertical_9,
  paddingStyle.padding_horizontal_12,
];

const list_style = [
  borderStyle.border_bottom_width_hairline,
  borderStyle.border_color_2,
];
