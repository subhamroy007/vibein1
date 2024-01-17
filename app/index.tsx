import { Redirect, Stack } from "expo-router";

const index = () => {
  return (
    <>
      <Stack.Screen options={{ animation: "none" }} />
      <Redirect
        href={{
          pathname: "account/summer",
        }}
      />
    </>
  );
};

export default index;
