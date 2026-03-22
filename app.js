const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const VALID_PRIORITIES = ['low', 'medium', 'high'];

// In-memory task store seeded from task.json
const { tasks: seedTasks } = require('./task.json');
const priorities = ['low', 'medium', 'high'];
let tasks = seedTasks.map((t, i) => ({
    ...t,
    priority: priorities[i % 3],
    createdAt: new Date(Date.now() - (seedTasks.length - i) * 60000).toISOString()
}));
let nextId = tasks.length + 1;

// GET /tasks - retrieve all tasks (supports ?completed=true/false, sorted by createdAt)
app.get('/tasks', (req, res) => {
    let result = [...tasks];

    if (req.query.completed !== undefined) {
        const completedFilter = req.query.completed === 'true';
        result = result.filter(t => t.completed === completedFilter);
    }

    result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    res.status(200).json(result);
});

// GET /tasks/priority/:level - retrieve tasks by priority level
app.get('/tasks/priority/:level', (req, res) => {
    const { level } = req.params;
    if (!VALID_PRIORITIES.includes(level)) {
        return res.status(400).json({ error: `Priority must be one of: ${VALID_PRIORITIES.join(', ')}` });
    }
    const result = tasks.filter(t => t.priority === level);
    res.status(200).json(result);
});

// GET /tasks/:id - retrieve a specific task
app.get('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json(task);
});

// POST /tasks - create a new task
app.post('/tasks', (req, res) => {
    const { title, description, completed, priority = 'low' } = req.body;
    if (!title || !description || typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'title, description, and completed (boolean) are required' });
    }
    if (!VALID_PRIORITIES.includes(priority)) {
        return res.status(400).json({ error: `priority must be one of: ${VALID_PRIORITIES.join(', ')}` });
    }
    const task = { id: nextId++, title, description, completed, priority, createdAt: new Date().toISOString() };
    tasks.push(task);
    res.status(201).json(task);
});

// PUT /tasks/:id - update an existing task
app.put('/tasks/:id', (req, res) => {
    const index = tasks.findIndex(t => t.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Task not found' });

    const { title, description, completed, priority = tasks[index].priority } = req.body;
    if (!title || !description || typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'title, description, and completed (boolean) are required' });
    }
    if (!VALID_PRIORITIES.includes(priority)) {
        return res.status(400).json({ error: `priority must be one of: ${VALID_PRIORITIES.join(', ')}` });
    }
    tasks[index] = { ...tasks[index], title, description, completed, priority };
    res.status(200).json(tasks[index]);
});

// DELETE /tasks/:id - delete a task
app.delete('/tasks/:id', (req, res) => {
    const index = tasks.findIndex(t => t.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Task not found' });
    tasks.splice(index, 1);
    res.status(200).json({ message: 'Task deleted' });
});

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

module.exports = app;