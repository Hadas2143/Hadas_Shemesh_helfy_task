import express from "express";
import cors from "cors";


const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

let nextId=1;
const tasks=[{
  id: nextId++,
  title: "Sample Task",
  description: "This is a sample task",
  completed: false,
  createdAt: new Date(),
  priority: 'medium'
},
{
  id: nextId++,
  title: "Sample Task 2",
  description: "This is another sample task",
  completed: false,
  createdAt: new Date(),
  priority: 'low'
}];

app.get('/api/gwtAllTask', (req, res) => {
    res.status(200).json(tasks);
});

const isValidPriority = (p) => ['low', 'medium', 'high'].includes(p);

app.post('/api/addTask', (req, res) => {
    const { title, description, priority } = req.body;

    if (!title ||title.trim() === '') {
        return res.status(400).json({ error: "You must input title" });
    }
    if (!description || typeof description !== 'string') {
        return res.status(400).json({ error: "Description is not string" });
    }
    if (!priority || !isValidPriority(priority)) {
        return res.status(400).json({ error: "Priority must be 'low', 'medium', or 'high'" });
    }

    const newTask = {
        id: nextId++,
        title: title,
        description: description,
        completed: false,
        createdAt: new Date(),
        priority
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.put('/api/updateTask/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const { title, description, completed, priority } = req.body;

    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
        return res.status(404).json({ error: `Task ${taskId} not found.` });
    }

   if (!title ||title.trim() === '') {
        return res.status(400).json({ error: "You must input title" });
    }
    if (!description || typeof description !== 'string') {
        return res.status(400).json({ error: "Description is not string" });
    }
    if (!priority || !isValidPriority(priority)) {
        return res.status(400).json({ error: "Priority must be 'low', 'medium', or 'high'" });
    }

    tasks[taskIndex] = {
        ...tasks[taskIndex],
        title: title,
        description: description,
        completed,
        priority
    };

    res.status(200).json(tasks[taskIndex]);
});

app.delete('/api/deleteTask/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ error: `Task ${taskId} not found.` });
    }

    tasks.splice(taskIndex, 1);
    res.status(204).json({ message: `Task ${taskId} deleted successfully.` });
});

app.patch('/api/toggleTask/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return res.status(404).json({ error: `Task ${taskId} not found.` });
    }

    task.completed = !task.completed;

    res.status(200).json(task);
});

app.listen(PORT, () => {
  console.log(`server is  running on port ${PORT}`);
});
