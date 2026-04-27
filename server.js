const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/tracker");

// USER
const userSchema = new mongoose.Schema({
  username: String,
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 }
});
const User = mongoose.model("User", userSchema);

// TASK + HABIT
const taskSchema = new mongoose.Schema({
  userId: String,
  title: String,
  completed: Boolean,
  type: String,
  date: String
});
const Task = mongoose.model("Task", taskSchema);

// TRACKER
const trackerSchema = new mongoose.Schema({
  userId: String,
  water: Number,
  sleep: Number,
  weight: Number,
  mood: String,
  study: Number,
  workout: String,
  expense: Number,
  income: Number,
  date: String
});
const Tracker = mongoose.model("Tracker", trackerSchema);

// ROUTES

// TASKS
app.post("/task", async (req,res)=>{
  const t = await Task.create(req.body);
  res.json(t);
});

app.get("/tasks/:userId", async (req,res)=>{
  const t = await Task.find({userId:req.params.userId});
  res.json(t);
});

app.put("/task/:id", async (req,res)=>{
  const t = await Task.findByIdAndUpdate(req.params.id, req.body, {new:true});
  res.json(t);
});

app.delete("/task/:id", async (req,res)=>{
  await Task.findByIdAndDelete(req.params.id);
  res.send("deleted");
});

// TRACKER
app.post("/tracker", async (req,res)=>{
  const t = await Tracker.create(req.body);
  res.json(t);
});

app.get("/tracker/:userId", async (req,res)=>{
  const t = await Tracker.find({userId:req.params.userId});
  res.json(t);
});

// PROGRESS
app.get("/progress/:userId", async (req,res)=>{
  const tasks = await Task.find({userId:req.params.userId});
  const done = tasks.filter(t=>t.completed).length;
  const total = tasks.length;

  res.json({
    percent: total ? (done/total)*100 : 0,
    done,
    total
  });
});

// XP SYSTEM
app.post("/xp/:userId", async (req,res)=>{
  let user = await User.findOne({userId:req.params.userId});
  if(!user) user = await User.create({userId:req.params.userId});

  user.xp += 10;
  if(user.xp >= 100){
    user.level += 1;
    user.xp = 0;
  }

  await user.save();
  res.json(user);
});

// SIMPLE AI
app.get("/ai", (req,res)=>{
  res.json({ tip: "Focus on Python + Gym + Water today 🔥" });
});

app.listen(5000, ()=>console.log("Server running"));
