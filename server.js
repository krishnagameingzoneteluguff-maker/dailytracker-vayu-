const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// 🔗 MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/tracker");

// 📦 Task Schema
const TaskSchema = new mongoose.Schema({
  text: String,
  completed: { type: Boolean, default: false },
  date: String
});

const Task = mongoose.model("Task", TaskSchema);

// ➕ Add Task
app.post("/tasks", async (req, res) => {
  const newTask = new Task({
    text: req.body.text,
    date: new Date().toDateString()
  });
  await newTask.save();
  res.json(newTask);
});

// 📥 Get Tasks
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// ✅ Toggle Complete
app.put("/tasks/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.completed = !task.completed;
  await task.save();
  res.json(task);
});

// ❌ Delete Task
app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// 🚀 Start Server
app.listen(3000, () => console.log("Server running on port 3000"));
