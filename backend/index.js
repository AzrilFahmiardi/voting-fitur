const express = require("express");
const cors = require("cors");
const db = require("./database");
require("dotenv").config();
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());

app.use(session({
    secret: 'batamcampusexpo2025',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, 
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 
    }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const username = profile.displayName;
        const email = profile.emails[0].value;

        const [rows] = await db.query('SELECT * FROM user WHERE email = ?', [email]);

        if (rows.length > 0) {
            return done(null, rows[0]);
        } else {
            const has_voted = 0;
            const [result] = await db.query('INSERT INTO user (username, email,has_voted) VALUES (?, ?,?)', [username, email,has_voted]);

            const newUser = {
                username: username,
                email: email
            };

            return done(null, newUser);
        }
    } catch (error) {
        console.error('Error accessing database:', error);
        return done(error, null);
    }
}));


passport.serializeUser((user, done) => {
    done(null, user.email);
});


passport.deserializeUser(async (email, done) => {
    try {
        const [rows] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
        done(null, rows[0]);
    } catch (error) {
        done(error, null);
    }
});


app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));


app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: 'http://localhost:5173/',
    successRedirect: 'http://localhost:5173/' 
}));

app.get('/check-auth', (req, res) => {
    res.json({
        isAuthenticated: req.isAuthenticated(),
        user: req.user ? {
            email: req.user.email,
            username: req.user.username
        } : null
    });
});


app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('http://localhost:5173/'); 
    });
});

app.get("/", (req, res) => {
    res.status(200).send("OK");
});


app.post('/vote', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();
        
        const [user] = await db.query('SELECT has_voted FROM user WHERE email = ?', [req.user.email]);
        
        if (user[0].has_voted === 1) {
            return res.status(400).json({ message: 'You have already voted' });
        }

        const { universities } = req.body;
        
        for (const university of universities) {
            await db.query(
                "UPDATE universitas SET jumlah_voting = jumlah_voting + 1 WHERE kode_univ = ?", 
                [university]
            );
        }

        await connection.query(
            "UPDATE user SET has_voted = 1 WHERE email = ?",
            [req.user.email]
        );

        await connection.commit();
        connection.release();
        
        res.status(200).json({ message: 'Voting successful' });
    } catch (error) {

        await connection.rollback();
        connection.release();
        console.error('Error updating votes:', error);
        res.status(500).json({ message: 'Error updating votes' });
    }
});


app.get('/universitas-voting', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM universitas");
        res.json(rows);
    } catch (error) {
        console.error('Error fetching universities:', error);
        res.status(500).send('Error fetching universities');
    }
});

app.get('/check-vote-status', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const [user] = await db.query('SELECT has_voted FROM user WHERE email = ?', [req.user.email]);
        res.json({ hasVoted: user[0].has_voted === 1 });
    } catch (error) {
        console.error('Error checking vote status:', error);
        res.status(500).json({ message: 'Error checking vote status' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
