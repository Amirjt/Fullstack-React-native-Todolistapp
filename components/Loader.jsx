import { AntDesign } from "@expo/vector-icons";
import { View } from "react-native";

const Loader = () => {
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#DDD",
        opacity: 0.7,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AntDesign name="loading1" size={24} color="black" />
    </View>
  );
};

export default Loader;
