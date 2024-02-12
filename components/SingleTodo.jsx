import {
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import colors from "../config/Colors";

import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

const SingleTodo = ({ task, search, mainCat }) => {
  const [isEditTaskModalVisible, setEditModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState(task.category);
  const [title, setTitle] = useState(task.title);
  const [note, setNote] = useState(task.note);

  const deleteHandler = async () => {
    fetch(`http://10.0.2.2:3000/todos/${task._id}`, {
      method: "DELETE",
    });
  };

  const editTaskHandler = async () => {
    fetch(`http://10.0.2.2:3000/todos/${task._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        note,
        category,
        dueDate: date,
      }),
    }).then((res) => {
      if (res.status === 200) {
        setEditModalVisible(false);
      }
    });
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  const defaultCategories = [
    {
      id: 1,
      title: "All",
    },
    {
      id: 2,
      title: "Work",
    },
    {
      id: 3,
      title: "Training",
    },
    {
      id: 4,
      title: "Exercise",
    },
    {
      id: 5,
      title: "Shopping",
    },
    {
      id: 6,
      title: "Personal",
    },
  ];

  const include = task.title
    .toLowerCase()
    .trim()
    .includes(search.toLowerCase().trim());

  const catIncludes =
    mainCat === "All" ||
    task.category.toLowerCase().trim().includes(mainCat.toLowerCase().trim());

  const completeHandler = async () => {
    fetch(`http://10.0.2.2:3000/todos/${task._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isCompleted: !task.isCompleted,
      }),
    });
  };

  const formattedDueDate = new Date(task.dueDate);

  return (
    <>
      <View
        style={{
          ...{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginVertical: 7,
            marginHorizontal: 10,
            backgroundColor: colors.primary,
            padding: 12,
            borderRadius: 10,
          },
          ...(include ? {} : styles.hidden),
          ...(catIncludes ? {} : styles.hidden),
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          <TouchableOpacity onPress={completeHandler}>
            <MaterialIcons
              name={
                task.isCompleted
                  ? "radio-button-checked"
                  : "radio-button-unchecked"
              }
              size={22}
              color={"#FFF"}
            />
          </TouchableOpacity>
          <Text
            style={{
              ...{
                color: "#FFF",
                fontWeight: "bold",
              },
              ...(task.isCompleted ? styles.completed : {}),
            }}
          >
            {task.title}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <View
            style={{
              marginRight: 17,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Text
              style={{
                color: "#FFF",
                fontWeight: "600",
                fontSize: 12,
                textAlign: "center",
              }}
            >
              {formattedDueDate.toLocaleString().split(",")[0]}
            </Text>
            <Text
              style={{
                color: "#FFF",
                fontWeight: "600",
                fontSize: 12,
                textAlign: "center",
                marginRight: 2,
              }}
            >
              {formattedDueDate.toLocaleString().split(",")[1]}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setEditModalVisible(true)}>
            <Feather name="edit" size={20} color={colors.secondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={deleteHandler}>
            <AntDesign name="delete" size={20} color={colors.secondary} />
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="slide"
        visible={isEditTaskModalVisible}
        transparent
        onRequestClose={() => setEditModalVisible(false)}
      >
        <Pressable
          style={{ height: 350, backgroundColor: "#DDD", opacity: 0.5 }}
          onPress={() => setEditModalVisible(false)}
        />
        <View
          style={{
            backgroundColor: "#FFF",
            flex: 1,
            padding: 25,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
          }}
        >
          <Text
            style={{
              color: colors.primary,
              fontSize: 16,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Editing Task
          </Text>
          <TextInput
            style={{
              borderWidth: 0.8,
              borderColor: colors.primary,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 10,
              marginTop: 15,
            }}
            value={title}
            onChangeText={(txt) => setTitle(txt)}
          />
          <TextInput
            multiline
            numberOfLines={6}
            style={{
              borderWidth: 0.8,
              borderColor: colors.primary,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 10,
              marginTop: 10,
            }}
            value={note}
            onChangeText={(txt) => setNote(txt)}
          />
          <Text
            style={{
              marginTop: 15,
              fontWeight: "600",
              color: colors.secondary,
            }}
          >
            Task Category
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 2,
              marginTop: 10,
            }}
          >
            {[...defaultCategories].map((cat) => (
              <Pressable
                key={cat.id}
                style={[
                  {
                    borderWidth: 0.8,
                    borderColor: colors.primary,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 10,
                    marginLeft: 5,
                    marginTop: 4,
                  },
                  cat.title === category && styles.active,
                ]}
                onPress={() => setCategory(cat.title)}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    color: colors.secondary,
                  }}
                >
                  {cat.title}
                </Text>
              </Pressable>
            ))}
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: 15,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontWeight: "600" }}>Due Time</Text>
            <Text style={{ fontWeight: "600" }}>{date.toLocaleString()}</Text>
          </View>
          <SafeAreaView
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              gap: 5,
              marginTop: 15,
            }}
          >
            <TouchableOpacity
              onPress={showDatepicker}
              style={{
                borderRadius: 10,
                backgroundColor: colors.primary,
                width: "50%",
                height: 35,
                paddingHorizontal: 8,
                paddingVertical: 4,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                  color: colors.secondary,
                }}
              >
                Add Date
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={showTimepicker}
              style={{
                borderRadius: 10,
                backgroundColor: colors.primary,
                width: "50%",
                height: 35,
                paddingHorizontal: 8,
                paddingVertical: 4,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                  color: colors.secondary,
                }}
              >
                Add Time
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              marginTop: 15,
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
            onPress={editTaskHandler}
          >
            <Text style={{ textAlign: "center", fontWeight: "bold" }}>
              Save Changes
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

export default SingleTodo;

const styles = StyleSheet.create({
  active: {
    backgroundColor: colors.primary,
    borderWidth: 0,
  },
  hidden: {
    display: "none",
  },
  completed: {
    textDecorationLine: "line-through",
    opacity: 0.8,
  },
});
