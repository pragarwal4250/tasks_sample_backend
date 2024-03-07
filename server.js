const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));

const connectionString = `mongodb+srv://${credentials.id}:${credentials.password}@cluster0.qgumum5.mongodb.net/?retryWrites=true&w=majority`;

// Connect to MongoDB Atlas
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
});

const Task = mongoose.model('Task', taskSchema);

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const { title, description } = req.body;
  const newTask = new Task({ title, description });
  await newTask.save();
  res.json(newTask);
});

app.delete('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  await Task.findByIdAndDelete(taskId);
  res.json({ message: 'Task deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
