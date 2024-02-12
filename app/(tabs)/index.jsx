import {
  Text,
  SafeAreaView,
  View,
  Pressable,
  StyleSheet,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";

import React, { useContext, useState } from "react";
import colors from "../../config/Colors";

import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

import { Ionicons } from "@expo/vector-icons";

import { AppContext } from "./_layout";
import SingleTodo from "../../components/SingleTodo";

const index = () => {
  const [mainCategory, setMainCategory] = useState("All");
  const [isAddTaskModalVisible, setAddModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [search, setSearch] = useState("");

  const { user, todos } = useContext(AppContext);

  const [newTask, setNewTask] = useState({
    title: "",
    note: "",
    category: "",
    dueDate: date,
  });

  const completedTodos = todos?.filter((task) => task.isCompleted === true);

  const updateDueDate = (newDueDate) => {
    setNewTask((prevTask) => {
      return {
        ...prevTask,
        dueDate: newDueDate,
      };
    });
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    updateDueDate(currentDate);
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

  const addTaskHandler = async () => {
    if (!newTask.title) {
      return false;
    } else {
      fetch(`http://10.0.2.2:3000/todos/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newTask,
          user: user._id,
        }),
      }).then((res) => {
        if (res.status === 201) {
          setAddModalVisible(false);
          setNewTask({
            title: "",
            note: "",
            category: "",
            dueDate: date,
          });
        }
      });
    }
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

  const someSuggestions = [
    {
      id: 1,
      title: "Read a Book",
      note: "Finish the novel you started last week.",
      category: "Personal",
    },
    {
      id: 2,
      title: "Complete Work Project",
      note: "Submit the project report by the end of the day.",
      category: "Work",
    },
    {
      id: 3,
      title: "Gym Session",
      note: "Hit the gym for a workout session.",
      category: "Exercise",
    },
    {
      id: 4,
      title: "Grocery Shopping",
      note: "Buy groceries for the week.",
      category: "Shopping",
    },
    {
      id: 5,
      title: "Code Review",
      note: "Review the pull requests on the code repository.",
      category: "Work",
    },
  ];

  return (
    <ScrollView
      style={{
        width: "100%",
        height: "100%",
        marginTop: 0,
      }}
    >
      <View
        style={{
          display: "flex",
          padding: 15,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <FlatList
          style={{
            padding: 15,
            paddingLeft: 0,
          }}
          horizontal
          data={defaultCategories}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              key={item.id}
              style={[
                {
                  borderWidth: 0.8,
                  borderColor: colors.primary,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 10,
                  marginLeft: 5,
                },
                item.title === mainCategory ? styles.active : {},
              ]}
              onPress={() => setMainCategory(item.title)}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                  color: colors.secondary,
                }}
              >
                {item.title}
              </Text>
            </Pressable>
          )}
        />
        <Ionicons
          onPress={() => setAddModalVisible(true)}
          name="add-circle-outline"
          size={27}
          color={colors.primary}
          style={{ marginLeft: 8 }}
        />
      </View>
      <View
        style={{
          padding: 15,
          marginTop: -20,
        }}
      >
        <View
          style={{
            borderWidth: 0.8,
            borderColor: colors.primary,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 10,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Ionicons name="search-outline" size={24} color={colors.secondary} />
          <TextInput
            value={search}
            onChangeText={(txt) => setSearch(txt)}
            placeholder="Search For a Task"
          />
        </View>
      </View>
      {todos.length === 0 ? (
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 60,
          }}
        >
          <Image source={require("./../../assets/images/tasks.png")} />
          <Text style={{ marginTop: 15, fontSize: 15, fontWeight: "bold" }}>
            There are no tasks yet, or they have all been completed
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 9,
              marginTop: 15,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 14,
                color: colors.primary,
              }}
            >
              Try to create new tasks
            </Text>
            <Ionicons
              name="add-circle-outline"
              size={24}
              color={colors.primary}
              onPress={() => setAddModalVisible(true)}
            />
          </View>
        </View>
      ) : (
        <>
          <ScrollView>
            {todos?.map(
              (task, index) =>
                !task.isCompleted && (
                  <SingleTodo
                    mainCat={mainCategory}
                    search={search}
                    key={index}
                    task={task}
                  />
                )
            )}
          </ScrollView>
          {completedTodos.length !== 0 && (
            <ScrollView>
              <Text
                style={{
                  padding: 12,
                  fontWeight: "bold",
                }}
              >
                Completed Todos
              </Text>
              {completedTodos?.map((task, index) => (
                <SingleTodo
                  mainCat={mainCategory}
                  search={search}
                  key={index}
                  task={task}
                />
              ))}
            </ScrollView>
          )}
        </>
      )}
      <Modal
        animationType="slide"
        visible={isAddTaskModalVisible}
        transparent
        onRequestClose={() => setAddModalVisible(false)}
      >
        <Pressable
          style={{ height: 240, backgroundColor: "#DDD", opacity: 0.5 }}
          onPress={() => setAddModalVisible(false)}
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
            Adding new task
          </Text>
          <TextInput
            value={newTask.title}
            onChangeText={(txt) =>
              setNewTask((prev) => {
                return {
                  ...prev,
                  title: txt,
                };
              })
            }
            style={{
              borderWidth: 0.8,
              borderColor: colors.primary,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 10,
              marginTop: 15,
            }}
            placeholder="Task name"
          />
          <TextInput
            multiline
            value={newTask.note}
            onChangeText={(txt) =>
              setNewTask((prev) => {
                return {
                  ...prev,
                  note: txt,
                };
              })
            }
            numberOfLines={6}
            style={{
              borderWidth: 0.8,
              borderColor: colors.primary,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 10,
              marginTop: 10,
            }}
            placeholder="Task note"
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
                  cat.title === newTask.category ? styles.active : {},
                  ,
                ]}
                onPress={() =>
                  setNewTask((prev) => {
                    return {
                      ...prev,
                      category: cat.title,
                    };
                  })
                }
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
          <Text
            style={{ fontWeight: "600", color: colors.primary, marginTop: 10 }}
          >
            Some Suggestions
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
            {someSuggestions.map((suggestion) => (
              <TouchableOpacity
                key={suggestion.id}
                style={[
                  {
                    borderWidth: 1,
                    borderColor: colors.primary,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 10,
                    marginLeft: 5,
                    marginTop: 4,
                  },
                  suggestion.title === newTask.title ? styles.active : {},
                ]}
                onPress={() =>
                  setNewTask({
                    title: suggestion.title,
                    note: suggestion.note,
                    category: suggestion.category,
                    dueDate: date,
                  })
                }
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    color: colors.secondary,
                  }}
                >
                  {suggestion.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              marginTop: 15,
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
            onPress={addTaskHandler}
          >
            <Text style={{ textAlign: "center", fontWeight: "bold" }}>
              Add Task
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default index;

const styles = StyleSheet.create({
  active: {
    backgroundColor: colors.primary,
    borderWidth: 0,
  },
  hidden: {
    display: "none",
  },
});
