const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

const FILE_PATH = './users.json';

const readData = () => {
    return JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
};

const writeData = (data) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
};

// 1. Add user
app.post('/user', (req, res) => {
    const { name, age, email } = req.body;
    const users = readData();
    
    if (users.find(u => u.email === email)) {
        return res.json({ message: "Email already exists." });
    }

    const newUser = { id: users.length + 1, name, age, email };
    users.push(newUser);
    writeData(users);
    res.json({ message: "User added successfully." });
});

// 2. Update user
app.patch('/user/:id', (req, res) => {
    const { id } = req.params;
    const { age } = req.body;
    let users = readData();
    const userIndex = users.findIndex(u => u.id == id);

    if (userIndex === -1) {
        return res.json({ message: "User ID not found." });
    }

    users[userIndex].age = age;
    writeData(users);
    res.json({ message: "User age updated successfully." });
});

// 3. Delete user
app.delete('/user/:id', (req, res) => {
    const { id } = req.params;
    let users = readData();
    const initialLength = users.length;
    users = users.filter(u => u.id != id);

    if (users.length === initialLength) {
        return res.json({ message: "User ID not found." });
    }

    writeData(users);
    res.json({ message: "User deleted successfully." });
});

// 4. Get user by name
app.get('/user/getByName', (req, res) => {
    const { name } = req.query;
    const users = readData();
    const user = users.find(u => u.name === name);

    if (!user) {
        return res.json({ message: "User name not found." });
    }
    res.json(user);
});

// 5. Get all users
app.get('/user', (req, res) => {
    res.json(readData());
});

// 6. Filter users by minimum age
app.get('/user/filter', (req, res) => {
    const { minAge } = req.query;
    const users = readData();
    const filteredUsers = users.filter(u => u.age >= parseInt(minAge));

    if (filteredUsers.length === 0) {
        return res.json({ message: "no user found" });
    }
    res.json(filteredUsers);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

// 7. Create an API that gets User by ID
app.get('/user/:id', (req, res) => {
    const { id } = req.params;
    const users = readData();
    const user = users.find(u => u.id == id);

    if (!user) {
        return res.json({ message: "User not found." });
    }
    
    res.json(user);
});