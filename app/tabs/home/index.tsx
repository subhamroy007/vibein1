import { Image, Pressable, StyleSheet } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { useAppSelector } from "../../../hooks/storeHooks";
import { useHomeFeed } from "../../../hooks/client.hooks";
import { SIZE_18, SIZE_24, SIZE_27, SIZE_30 } from "../../../constants";
import { selectClientAccountParams } from "../../../store/client/client.selector";
import Header from "../../../components/Header";
import Avatar from "../../../components/Avatar";
import Icon from "../../../components/Icon";
import StackContainer from "../../../components/StackContainer";
import ScrollablePostList from "../../../components/scrollable-post/ScrollablePostList";

export default function Home() {
  const clientAccount = useAppSelector(selectClientAccountParams);

  const { fetchPosts, homeFeed, refresh } = useHomeFeed();

  const clampedScrollOffset = useSharedValue(0);

  if (!clientAccount) {
    return null;
  }

  return (
    <StackContainer>
      <Header
        ItemLeft={
          <Pressable hitSlop={SIZE_24}>
            <Avatar url={clientAccount.profilePictureUri} size={SIZE_30} />
          </Pressable>
        }
        ItemMiddle={
          <Image
            resizeMode="contain"
            source={require("../../../assets/gradient-title.png")}
            style={styles.logo}
          />
        }
        ItemRight={
          <Pressable hitSlop={SIZE_24}>
            <Icon name="explore-outline" size={SIZE_27} />
          </Pressable>
        }
      />
      <ScrollablePostList
        data={homeFeed.data?.items}
        isLoading={homeFeed.isLoading}
        isError={
          homeFeed.error
            ? !homeFeed.failedToRefresh
              ? true
              : homeFeed.data === null
            : false
        }
        onFetch={fetchPosts}
        onRefresh={refresh}
        hasEndReached={homeFeed.data?.hasEndReached}
      />
    </StackContainer>
  );
}

const styles = StyleSheet.create({
  logo: { aspectRatio: "1772/250", height: SIZE_18 },
});
