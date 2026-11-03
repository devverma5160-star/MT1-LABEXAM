import http from 'http';
import fs from 'fs';

// Employee tasks array
let tasks = [
    {
        id: 1,
        taskName: "Develop Login Page",
        assignedTo: "Rahul Sharma",
        status: "Pending"
    },
    {
        id: 2,
        taskName: "Create Dashboard",
        assignedTo: "Amit Kumar",
        status: "Completed"
    },
    {
        id: 3,
        taskName: "Testing Website",
        assignedTo: "Priya Singh",
        status: "In Progress"
    }
];

// Create HTTP Server
const server = http.createServer((req, res) => {

    // Route 1: Home
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Welcome to Employee Task Management System</h1>');
    }

    // Route 2: Get All Tasks
    else if (req.method === 'GET' && req.url === '/tasks') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(tasks));
    }

    // Route 3: About
    else if (req.method === 'GET' && req.url === '/about') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Employee Task Management Application using Node.js');
    }

    // Route 4: Serve HTML using FS Module
    else if (req.method === 'GET' && req.url === '/home') {

        fs.readFile('./public/index.html', 'utf8', (err, data) => {

            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error reading HTML file');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }

        });
    }

    // Route 5: Add Task using POST
    else if (req.method === 'POST' && req.url === '/add-task') {

        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {

            try {
                const newTask = JSON.parse(body);

                if (!newTask.id || !newTask.taskName ||
                    !newTask.assignedTo || !newTask.status) {

                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        message: 'All fields are required'
                    }));

                    return;
                }

                tasks.push(newTask);

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: 'Task added successfully',
                    task: newTask
                }));

            } catch (error) {

                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: 'Invalid JSON data'
                }));

            }

        });
    }

    // Invalid Routes
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 - Page Not Found');
    }

});

// Start Server
server.listen(3000, () => {
    console.log('HTTP Server running at http://localhost:3000');
});