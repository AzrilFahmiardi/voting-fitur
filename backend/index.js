const express = require("express");
const cors = require("cors");
const db = require("./database");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send("OK");
});

app.post('/submit-form', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        await db.query("INSERT INTO user (username, email, password) VALUES (?,?,?)", [username, email, password]);
        res.status(200).json({ message: 'Form submitted successfully', data: { username, email, password } });
        console.log('Data received from frontend:', { username, email, password });
    } catch (error) {
        console.error("Query error: ", error);
        return res.status(500).send("Internal Server Error");
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [results] = await db.query("SELECT * from user WHERE email=? and password=?", [email, password]);
        
        if (results.length > 0) {
            const { username, email } = results[0];
            console.log('Data received from frontend:', { email, password });
            return res.status(200).json({ username, email });
        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error querying database:', error);
        return res.status(500).send("Internal Server Error");
    }
});

// Route untuk voting
app.post('/vote', async (req, res) => {
    const { universities } = req.body;
    try {
        for (const university of universities) {
            await db.query("UPDATE universitas SET jumlah_voting = jumlah_voting + 1 WHERE kode_univ = ?", [university]);
        }
        res.status(200).send('Voting successful');
    } catch (error) {
        console.error('Error updating votes:', error);
        res.status(500).send('Error updating votes');
    }
});

// Endpoint untuk mendapatkan data universitas
app.get('/universitas-voting', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM universitas order by kode_univ");
        res.json(rows);
    } catch (error) {
        console.error('Error fetching universities:', error);
        res.status(500).send('Error fetching universities');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
