const express = require('express');

const server = express();

server.use(express.json());

var projects = [];
var numReqs = 0;

// MIDDLEWARES
server.use((req, res, next) => {
  numReqs++;

  console.log(`Number of requests: ${numReqs}`);

  next();
});

function checkProjectExists(req, res, next) {
  const { id } = req.params;

  if(!projects.find(project => project.id == id)){
    return res.status(400).json({ error: 'Project does not exists' });
  }

  next();
}

// PROJECTS ROUTES
server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  projects.push({id, title, tasks: []});

  return res.json(projects);
});

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  let project = projects.find(project => project.id == id);

  project.title = title;

  return res.json(project);
});

server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(project => project.id == id);

  projects.splice(index, 1);

  return res.send();
});

// TASKS ROUTES
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  let project = projects.find(project => project.id == id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3000);