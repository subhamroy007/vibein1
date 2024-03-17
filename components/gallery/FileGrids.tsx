import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { FileParams } from "../../hooks/utility.hooks";
import { useCallback, useState } from "react";
import FileGridItem from "./FileGridItem";
import { layoutStyle } from "../../styles";

type FileGridsProps = {
  files: FileParams[] | null | undefined;
  selectedFiles: FileParams[];
  isPageLoading: boolean;
  loadPage: (end: string, albumId: string) => void;
  onFileSelect: (selectedFile: FileParams) => void;
  hasNextPage: boolean;
  endCursor: string;
  albumId: string;
  multiselect?: boolean;
  portrait?: boolean;
};

const FileGrids = ({
  endCursor,
  files,
  hasNextPage,
  isPageLoading,
  loadPage,
  albumId,
  multiselect,
  portrait,
  selectedFiles,
  onFileSelect,
}: FileGridsProps) => {
  const { width: screenWidth } = useWindowDimensions();

  const endReachCallback = useCallback(() => {
    if (!isPageLoading && hasNextPage) {
      loadPage(endCursor, albumId);
    }
  }, [endCursor, hasNextPage, albumId, isPageLoading]);

  const getItemLayout = useCallback(
    (_: ArrayLike<FileParams> | null | undefined, index: number) => {
      const length =
        Math.abs(screenWidth / 3 - 4 * StyleSheet.hairlineWidth) +
        6 * StyleSheet.hairlineWidth;
      return {
        index,
        length,
        offset: Math.floor(index / 3) * length,
      };
    },
    []
  );

  const seprator = useCallback(
    () => (
      <View
        style={{
          height: 6 * StyleSheet.hairlineWidth,
        }}
      />
    ),
    []
  );

  const renderGrid = useCallback(
    ({ item }: ListRenderItemInfo<FileParams>) => {
      return (
        <FileGridItem
          {...item}
          multiselect={multiselect}
          portrailt={portrait}
          selectionCount={
            selectedFiles.findIndex((file) => file.id === item.id) + 1
          }
          onSelect={onFileSelect}
        />
      );
    },
    [selectedFiles, multiselect, portrait]
  );

  return (
    <FlatList
      overScrollMode="never"
      showsVerticalScrollIndicator={false}
      data={files}
      renderItem={renderGrid}
      columnWrapperStyle={layoutStyle.justify_content_space_between}
      numColumns={3}
      keyExtractor={(item) => item.id + item.filename}
      onEndReached={endReachCallback}
      onEndReachedThreshold={0.4}
      getItemLayout={getItemLayout}
      ItemSeparatorComponent={seprator}
    />
  );
};

export default FileGrids;
