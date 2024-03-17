import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { AlbumSelectorParams, FileParams } from "../../hooks/utility.hooks";
import { useCallback, useState } from "react";
import GridItem from "./FileGridItem";
import { layoutStyle } from "../../styles";
import AlbumGridItem from "./AlbumGridItem";

type AlbumGridsProps = {
  albums: AlbumSelectorParams[] | null | undefined;
  onSelect: (albumId: string) => void;
};

const AlbumGrids = ({ albums, onSelect }: AlbumGridsProps) => {
  const { width: screenWidth } = useWindowDimensions();

  const getItemLayout = useCallback(
    (_: ArrayLike<AlbumSelectorParams> | null | undefined, index: number) => {
      const length =
        Math.abs(screenWidth / 2 - 5 * StyleSheet.hairlineWidth) +
        10 * StyleSheet.hairlineWidth;
      return {
        index,
        length,
        offset: Math.floor(index / 2) * length,
      };
    },
    []
  );

  const seprator = useCallback(
    () => (
      <View
        style={{
          height: 10 * StyleSheet.hairlineWidth,
        }}
      />
    ),
    []
  );

  const renderAlbumGrid = useCallback(
    ({ item }: ListRenderItemInfo<AlbumSelectorParams>) => {
      return <AlbumGridItem {...item} onSelect={onSelect} />;
    },
    [onSelect]
  );

  return (
    <FlatList
      overScrollMode="never"
      showsVerticalScrollIndicator={false}
      data={albums}
      renderItem={renderAlbumGrid}
      columnWrapperStyle={layoutStyle.justify_content_space_between}
      numColumns={2}
      keyExtractor={(item) => item.id + item.title}
      getItemLayout={getItemLayout}
      ItemSeparatorComponent={seprator}
    />
  );
};

export default AlbumGrids;
