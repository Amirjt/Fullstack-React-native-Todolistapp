const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/todolistapplication")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

const Todo = require("./models/Todo");
const User = require("./models/User");

app.post("/register", async (req, res) => {
  const newUser = req.body;
  if (!newUser) {
    return res.status(400).json({
      message: "Invalid username or password",
    });
  }

  const existingUser = await User.findOne({ email: newUser.email });
  if (existingUser) {
    return res.status(409).json({
      message: "User already exists",
    });
  }

  User.create(newUser);

  return res.status(201).json({
    message: "User created successfully",
  });
});

app.post("/login", async (req, res) => {
  const user = req.body;

  const existingUser = await User.findOne({
    $or: [{ email: user.identify }, { username: user.identify }],
  });

  if (!existingUser) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const validPass = user.password === existingUser.password;
  if (!validPass) {
    return res.status(401).json({
      message: "Invalid username or password",
    });
  }

  const token = jwt.sign(
    { email: existingUser.email },
    "oisudhfidsfjdsfklsdfjdklsfdfjlk" || ""
  );

  return res.status(200).json(token);
});

app.get("/me", async (req, res) => {
  const { token } = req.headers;
  if (!token) {
    return false;
  }

  const verified = jwt.verify(token, "oisudhfidsfjdsfklsdfjdklsfdfjlk");
  if (!verified) {
    return res.status(401).json({
      message: "Something went wrong",
    });
  }

  const user = await User.findOne({ email: verified.email }, "-__v");
  return res.status(200).json(user);
});

app.delete("/users/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    await Todo.deleteMany({ user: userId });
    await User.findByIdAndDelete(userId);
    return res.status(200).json({
      message: "user deleted",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

app.post("/todos/:userId", async (req, res) => {
  const newTodo = req.body;
  const { userId } = req.params;

  try {
    const createdTodo = await Todo.create(newTodo);
    const user = await User.findById(userId);
    user.todos.push(createdTodo);
    await user.save();

    return res.status(201).json({
      message: "todo created",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

app.get("/todos/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate("todos");
    return res.status(200).json(user.todos);
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

app.delete("/todos/:todoId", async (req, res) => {
  const { todoId } = req.params;
  try {
    await Todo.findByIdAndDelete(todoId);
    return res.status(200).json({
      message: "Succsess",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

app.patch("/todos/:todoId", async (req, res) => {
  const { todoId } = req.params;
  const updated = req.body;
  try {
    await Todo.findByIdAndUpdate(todoId, updated);
    return res.status(200).json({
      message: "Succsess",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

app.listen("3000", () => {
  console.log("Server is running on port 3000");
});
