import Animated from "react-native-reanimated";
import { DataFetchListGeneralProps } from "../../types/component.types";
import { SearchParams } from "../../types/utility.types";
import { useCallback } from "react";
import { SIZE_70 } from "../../constants";
import { ListRenderItemInfo } from "react-native";
import AccountSearchItem from "./AccountSearchItem";
import HashTagSearchItem from "./HashtagSearhItem";
import TextSearchItem from "./TextSearchItem";
import { useLayout } from "@react-native-community/hooks";
import DefaultErrorFallback from "../utility-components/DefaultErrorFallback";
import EntityListPlaceholder from "../utility-components/EntityListPlaceholder";

export type EntitySearchListProps = DataFetchListGeneralProps<SearchParams>;

const EntitySearchList = ({
  data,
  isError,
  isLoading,
  onFetch,
}: EntitySearchListProps) => {
  const { height, onLayout } = useLayout();

  const getItemLayout = useCallback(
    (_: ArrayLike<SearchParams> | null | undefined, index: number) => ({
      index,
      length: SIZE_70,
      offset: index * SIZE_70,
    }),
    []
  );

  const renderItem = useCallback(
    ({ index, item }: ListRenderItemInfo<SearchParams>) => {
      if (item.type === "account") {
        return <AccountSearchItem {...item} key={index} />;
      } else if (item.type === "hashtag") {
        return <HashTagSearchItem {...item} key={index} />;
      } else {
        return <TextSearchItem {...item} key={index} />;
      }
    },
    []
  );

  return (
    <Animated.FlatList
      onLayout={onLayout}
      data={data}
      overScrollMode={"never"}
      showsVerticalScrollIndicator={false}
      getItemLayout={getItemLayout}
      renderItem={renderItem}
      ListEmptyComponent={
        isError ? (
          onFetch && <DefaultErrorFallback height={height} retry={onFetch} />
        ) : (
          <EntityListPlaceholder isLoading={isLoading || false} />
        )
      }
    />
  );
};

export default EntitySearchList;
