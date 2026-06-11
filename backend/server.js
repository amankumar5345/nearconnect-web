import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_dev_key_nearconnect_123';

app.use(cors());
app.use(express.json());

// Helper middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- AUTH ROUTES ---

app.post('/api/auth/register', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    try {
        const hash = bcrypt.hashSync(password, 10);
        const stmt = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)');
        const info = stmt.run(email, hash);
        
        const token = jwt.sign({ id: info.lastInsertRowid, email }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: info.lastInsertRowid, email } });
    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            res.status(409).json({ error: 'Email already exists' });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    try {
        const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
        const user = stmt.get(email);

        if (user && bcrypt.compareSync(password, user.password_hash)) {
            const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
            res.json({ token, user: { id: user.id, email: user.email } });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// --- USER ROUTES ---

app.get('/api/user/me', authenticateToken, (req, res) => {
    try {
        const userStmt = db.prepare('SELECT id, email, created_at FROM users WHERE id = ?');
        const user = userStmt.get(req.user.id);

        if (!user) return res.status(404).json({ error: 'User not found' });

        const profileStmt = db.prepare('SELECT * FROM profiles WHERE user_id = ?');
        const profile = profileStmt.get(req.user.id) || {};

        if (profile.interests) profile.interests = JSON.parse(profile.interests);
        if (profile.privacy_settings) profile.privacy_settings = JSON.parse(profile.privacy_settings);

        res.json({ user, profile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/user/profile', authenticateToken, (req, res) => {
    const { 
        name, phone, bio, age, gender, occupation, 
        location_city, location_society, interests, privacy_settings 
    } = req.body;

    try {
        // Check if profile exists
        const checkStmt = db.prepare('SELECT user_id FROM profiles WHERE user_id = ?');
        const exists = checkStmt.get(req.user.id);

        const interestsStr = interests ? JSON.stringify(interests) : null;
        const privacyStr = privacy_settings ? JSON.stringify(privacy_settings) : null;

        if (exists) {
            // Update
            const stmt = db.prepare(`
                UPDATE profiles 
                SET name = ?, phone = ?, bio = ?, age = ?, gender = ?, occupation = ?, 
                    location_city = ?, location_society = ?, interests = ?, privacy_settings = ?
                WHERE user_id = ?
            `);
            stmt.run(name, phone, bio, age, gender, occupation, location_city, location_society, interestsStr, privacyStr, req.user.id);
        } else {
            // Insert
            const stmt = db.prepare(`
                INSERT INTO profiles (user_id, name, phone, bio, age, gender, occupation, location_city, location_society, interests, privacy_settings)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            stmt.run(req.user.id, name, phone, bio, age, gender, occupation, location_city, location_society, interestsStr, privacyStr);
        }

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
