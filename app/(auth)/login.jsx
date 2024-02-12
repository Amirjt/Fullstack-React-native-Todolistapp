import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import colors from "./../../config/Colors";

import { AntDesign } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const login = () => {
  useEffect(() => {
    AsyncStorage.getItem("token").then((token) => {
      if (token) {
        router.replace("(tabs)");
      }
    });
  }, []);

  const [identify, setIdentify] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const loginHandler = () => {
    if (!identify || !password) {
      setErr("Please fill all the fields");
      setTimeout(() => {
        setErr("");
      }, 2000);
    } else {
      fetch("http://10.0.2.2:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identify,
          password,
        }),
      })
        .then((res) => {
          if (res.status === 404) {
            setErr("User not found");
            setTimeout(() => {
              setErr("");
            }, 2000);
          } else if (res.status === 401) {
            setErr("Invalid username/email or password");
            setTimeout(() => {
              setErr("");
            }, 2000);
          } else if (res.status === 200) {
            return res.json();
          }
        })
        .then((data) => {
          if (data) {
            AsyncStorage.setItem("token", data);
            router.push("(tabs)");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <SafeAreaView
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        padding: 30,
      }}
    >
      <Text style={{ fontWeight: "bold", color: colors.primary, fontSize: 18 }}>
        Welcome to Todo-list Tracker
      </Text>
      <Text
        style={{
          marginTop: 10,
          fontSize: 14,
          color: colors.secondary,
          fontWeight: "600",
          marginBottom: 20,
        }}
      >
        First of all please Login
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 7,
          borderWidth: 0.9,
          borderColor: colors.secondary,
          borderRadius: 10,
          width: "100%",
          marginTop: 10,
          paddingHorizontal: 10,
          paddingVertical: 5,
        }}
      >
        <AntDesign
          style={{ opacity: 0.7 }}
          name="user"
          size={22}
          color={colors.secondary}
        />
        <TextInput
          value={identify}
          onChangeText={(txt) => setIdentify(txt)}
          placeholder="Username or email"
        />
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 7,
          borderWidth: 0.9,
          borderColor: colors.secondary,
          borderRadius: 10,
          width: "100%",
          marginTop: 10,
          paddingHorizontal: 10,
          paddingVertical: 5,
        }}
      >
        <AntDesign
          name="key"
          size={22}
          color={colors.secondary}
          style={{ opacity: 0.7 }}
        />
        <TextInput
          value={password}
          onChangeText={(txt) => setPassword(txt)}
          placeholder="Password"
          secureTextEntry={true}
        />
      </View>
      {err && (
        <Text
          style={{
            marginTop: 8,
            alignSelf: "flex-start",
            paddingLeft: 5,
            color: "red",
          }}
        >
          {err}
        </Text>
      )}
      <TouchableOpacity
        style={{
          marginTop: 14,
          backgroundColor: colors.primary,
          borderRadius: 10,
          width: "100%",
          paddingHorizontal: 12,
          paddingVertical: 6,
        }}
        onPress={loginHandler}
      >
        <Text
          style={{
            fontWeight: "bold",
            color: "#FFF",
            fontSize: 18,
            textAlign: "center",
          }}
        >
          Login
        </Text>
      </TouchableOpacity>
      <Pressable style={{ marginTop: 15 }}>
        <Text style={{ color: colors.secondary }}>
          Dont have account ? <Link href={"/(auth)/register"}>Register</Link>
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default login;
