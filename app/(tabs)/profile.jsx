import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext } from "react";
import { AppContext } from "./_layout";
import colors from "../../config/Colors";

import { LineChart } from "react-native-chart-kit";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const profile = () => {
  const { user, todos } = useContext(AppContext);
  const completedTodos = todos.filter((task) => task.isCompleted === true);
  const pendingTodos = todos.filter((task) => task.isCompleted === false);

  const logoutHandler = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("(auth)/login");
  };

  const deleteAccountHandler = () => {
    fetch(`http://10.0.2.2:3000/users/${user._id}`, {
      method: "DELETE",
    }).then((res) => {
      if (res.status === 200) {
        AsyncStorage.removeItem("token").then(() => {
          router.replace("(auth)/register");
        });
      }
    });
  };

  return (
    <View
      style={{
        padding: 25,
      }}
    >
      <Text style={{ fontWeight: "bold", fontSize: 20 }}>
        Welcome{" "}
        <Text
          style={{
            textTransform: "capitalize",
            color: colors.primary,
          }}
        >
          {user?.username}
        </Text>
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          gap: 7,
          marginTop: 15,
        }}
      >
        <View
          style={{
            shadowColor: colors.primary,
            shadowOffset: { width: 20, height: 20 },
            flex: 1,
            gap: 5,
            shadowRadius: 40,
            elevation: 20,
            backgroundColor: "#FFF",
            padding: 12,
            borderRadius: 15,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>All todos</Text>
          <Text
            style={{
              fontWeight: "bold",
              alignSelf: "center",
              fontSize: 20,
              color: colors.primary,
            }}
          >
            {todos.length}
          </Text>
        </View>
        <View
          style={{
            shadowColor: colors.primary,
            shadowOffset: { width: 20, height: 20 },
            flex: 1,
            gap: 5,
            shadowRadius: 40,
            elevation: 20,
            backgroundColor: "#FFF",
            padding: 12,
            borderRadius: 15,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>Completed</Text>
          <Text
            style={{
              fontWeight: "bold",
              alignSelf: "center",
              fontSize: 20,
              color: colors.primary,
            }}
          >
            {completedTodos.length}
          </Text>
        </View>
        <View
          style={{
            shadowColor: colors.primary,
            shadowOffset: { width: 20, height: 20 },
            shadowRadius: 40,
            elevation: 20,
            flex: 1,
            gap: 5,
            backgroundColor: "#FFF",
            padding: 12,
            borderRadius: 15,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>Pending</Text>
          <Text
            style={{
              fontWeight: "bold",
              alignSelf: "center",
              fontSize: 20,
              color: colors.primary,
            }}
          >
            {pendingTodos.length}
          </Text>
        </View>
      </View>
      <LineChart
        data={{
          labels: ["Pending", "Completed"],
          datasets: [
            {
              data: [pendingTodos.length, completedTodos.length],
            },
          ],
        }}
        width={350}
        height={220}
        yAxisInterval={2}
        style={{
          marginTop: 15,
          borderRadius: 15,
          shadowColor: colors.primary,
          shadowOffset: { width: 20, height: 20 },
          shadowRadius: 40,
          elevation: 20,
        }}
        chartConfig={{
          backgroundGradientFrom: colors.primary,
          backgroundGradientTo: "#FFF",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: colors.primary,
          },
        }}
        bezier
      />
      <View
        style={{
          marginTop: 15,
          display: "flex",
          flexDirection: "row",
          gap: 7,
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            backgroundColor: colors.primary,
            padding: 15,
            borderRadius: 15,
          }}
          onPress={logoutHandler}
        >
          <MaterialIcons name="logout" size={24} color="#FFF" />
          <Text
            style={{ fontWeight: "bold", textAlign: "center", color: "#FFF" }}
          >
            Logout
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            backgroundColor: colors.primary,
            alignItems: "center",
            gap: 4,
            padding: 15,
            borderRadius: 15,
          }}
          onPress={deleteAccountHandler}
        >
          <AntDesign name="deleteuser" size={24} color="#FFF" />
          <Text
            style={{ fontWeight: "bold", textAlign: "center", color: "#FFF" }}
          >
            Delete Account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default profile;

const styles = StyleSheet.create({});
