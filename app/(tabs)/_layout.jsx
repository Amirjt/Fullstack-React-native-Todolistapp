import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../config/Colors";
import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AppContext = createContext();

const Layout = () => {
  const [todos, setTodos] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("token").then((token) => {
      if (token) {
        fetch("http://10.0.2.2:3000/me", {
          method: "GET",
          headers: {
            token,
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((user) => setUser(user))
          .catch((error) => {
            console.error("Error fetching user data:", error);
          });
      }
    });
  }, []);

  const dataGetter = () => {
    fetch(`http://10.0.2.2:3000/todos/${user._id}`)
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((error) => {
        console.error("Error fetching todos:", error);
      });
  };

  useEffect(() => {
    if (user && user._id) {
      dataGetter();
    }
  }, [user, todos]);

  return (
    <AppContext.Provider value={{ user, setUser, todos, setTodos }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: colors.primary,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
          },
        }}
      >
        <Tabs.Screen
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons
                  name="home-outline"
                  size={24}
                  color={colors.secondary}
                />
              ) : (
                <Ionicons name="home-outline" size={24} color="white" />
              ),
          }}
          name="index"
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons
                  name="person-outline"
                  size={24}
                  color={colors.secondary}
                />
              ) : (
                <Ionicons name="person-outline" size={24} color="white" />
              ),
          }}
        />
      </Tabs>
    </AppContext.Provider>
  );
};

export default Layout;
