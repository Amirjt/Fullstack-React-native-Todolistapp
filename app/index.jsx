import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, router } from "expo-router";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";

const index = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    AsyncStorage.getItem("token").then((token) => {
      if (token) {
        router.replace("(tabs)");
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loader />;
  }

  return <Redirect href={"/(auth)/login"} />;
};

export default index;
