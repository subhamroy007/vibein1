import { Image, Pressable, StyleSheet } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { useAppSelector } from "../../../hooks/storeHooks";
import { useHomeFeed } from "../../../hooks/client.hooks";
import { SIZE_18, SIZE_24, SIZE_27, SIZE_30 } from "../../../constants";
import { selectClientAccountParams } from "../../../store/client/client.selector";
import Header from "../../../components/Header";
import Avatar from "../../../components/Avatar";
import StackContainer from "../../../components/StackContainer";
import ScrollablePostList from "../../../components/scrollable-post/ScrollablePostList";
import MemoryAccountList from "../../../components/memory-section/MemoryAccountList";
import Icon from "../../../components/utility-components/icon/Icon";

export default function Home() {
  const clientAccount = useAppSelector(selectClientAccountParams);

  const { fetchPosts, homeFeed, refresh } = useHomeFeed();

  if (!clientAccount) {
    return null;
  }

  const { memoryAccounts, posts } = homeFeed;
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
      <MemoryAccountList data={memoryAccounts.data?.items} />
      {/* <ScrollablePostList
        data={posts.data?.items}
        isLoading={posts.isLoading}
        isError={posts.error}

        onEndReach={fetchPosts}
        onInit={refresh}
        hasEndReached={posts.data?.hasEndReached}
      /> */}
    </StackContainer>
  );
}

const styles = StyleSheet.create({
  logo: { aspectRatio: "1772/250", height: SIZE_18 },
});
