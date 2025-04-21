require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');

const server = express();
server.use(cors());
server.use(express.json());

const PORT = process.env.PORT || 5000;

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
};

const pool = mysql.createPool(dbConfig);

// Function to create a database connection
const connectDB = async () => {
    try {
        await pool.getConnection();
        console.log('Connected to AWS RDS database.');
    } catch (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
};

// API route
server.get('/', async (req, res) => {
    res.send('Welcome to the Event Planner API!');
});

// Start server
server.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
});

//authentication
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

//error handling
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
};

//validation
const validateUser = [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('role').isIn(['admin', 'university', 'rso', 'student'])
];

const validateEvent = [
    body('name').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('category').isIn(['social', 'fundraising', 'tech talk', 'other']),
    body('visibility').isIn(['public', 'private', 'rso'])
];



//--------------------------------------------------------------------------------
//                                AUTHENTICATION ROUTES
//--------------------------------------------------------------------------------
server.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const [users] = await pool.execute(
            'SELECT * FROM Users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { user_id: user.user_id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.json({ token, user: { user_id: user.user_id, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



//-------------------------------------------------------------------------------
//                                USER ROUTES
//--------------------------------------------------------------------------------
server.post('/api/users/register', validateUser, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await pool.execute(
            'INSERT INTO Users (email, password_hash, role) VALUES (?, ?, ?)',
            [email, hashedPassword, role]
        );
        res.status(201).json({ user_id: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

server.get('/api/users/getUserId/:email', async (req, res) => {
    try {
        const email = req.params.email;

        if (!email) {
            return res.status(400).json({ error: "Missing email in query parameters" });
        }

        const [rows] = await pool.execute('SELECT user_id FROM Users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(rows[0]); // Return user data
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

server.get('/api/users/getUser/:user_id', async (req, res) => {
    try {
        const user_id = req.params.user_id;

        if (!user_id) {
            return res.status(400).json({ error: "Missing user_id in query parameters" });
        }

        const [rows] = await pool.execute('SELECT * FROM Users WHERE user_id = ?', [user_id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(rows[0]); // Return user data
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

server.get('/api/users/getUserList', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM Users');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

server.put('/api/users/updateUser', async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { user_id, email, password } = req.body;

        // Check if the user exists before updating
        const [userRows] = await pool.execute('SELECT * FROM Users WHERE user_id = ?', [user_id]);

        if (userRows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        // Hash the new password if provided, or keep the old password
        let hashedPassword = userRows[0].password_hash;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Update the user information (exclude 'role' from being updated)
        const [result] = await pool.execute(
            'UPDATE Users SET email = ?, password_hash = ? WHERE user_id = ?',
            [email, hashedPassword, user_id]
        );

        res.status(200).json({ message: 'User information updated successfully' });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

server.delete('/api/users/deleteUser/:user_id', async (req, res) => {
    try {
        const user_id = req.params.user_id;

        if (!user_id) {
            return res.status(400).json({ error: "Missing user_id in parameters" });
        }

        // Check if user exists
        const [rows] = await pool.execute('SELECT * FROM Users WHERE user_id = ?', [user_id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        // Delete user
        await pool.execute('DELETE FROM Users WHERE user_id = ?', [user_id]);

        res.status(200).json({ message: "User and associated data deleted successfully" });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});



//-------------------------------------------------------------------------------
//                                UNIVERSITY ROUTES
//-------------------------------------------------------------------------------
server.post('/api/universities/createUniversity', async (req, res) => {
    try {
        const { name, location, description, num_students, website, user_id } = req.body;
        const [result] = await pool.execute(
            'INSERT INTO Universities (name, location, description, num_students, website, user_id) VALUES (?, ?, ?, ?, ?, ?)',
            [name, location, description, num_students, website, user_id]
        );
        res.status(201).json({ university_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

server.get('/api/universities/getActiveUniversityList', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM Universities WHERE status = "active"');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

server.get('/api/universities/getPendingUniversityList', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM Universities WHERE status = "pending"');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

server.get('/api/universities/getActiveRSOList', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM RSOs WHERE status = "active"');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

server.get('/api/universities/getPendingRSOList', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM RSOs WHERE status = "pending"');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

server.get('/api/universities/getInactiveRSOList', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM RSOs WHERE status = "inactive"');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

server.put('/api/universities/approveRSO/:rso_id', async (req, res) => {
    try {
        const { rso_id } = req.params;

        const [result] = await pool.execute(
            'UPDATE RSOs SET status = ? WHERE rso_id = ? AND status = ?',
            ['active', rso_id, 'pending']
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'RSO not found or already approved' });
        }

        res.status(200).json({ message: 'RSO approved successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

server.get('/api/universities/getActiveStudentList', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM Students WHERE status = "active"');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

server.get('/api/universities/getPendingStudentList', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM Students WHERE status = "pending"');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

server.put('/api/universities/approveStudent/:student_id', async (req, res) => {
    try {
        const { student_id } = req.params;

        const [result] = await pool.execute(
            'UPDATE Students SET status = ? WHERE student_id = ? AND status = ?',
            ['active', student_id, 'pending']
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Student not found or already approved' });
        }

        res.status(200).json({ message: 'Student approved successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



//-------------------------------------------------------------------------------
//                                STUDENT ROUTES
//-------------------------------------------------------------------------------
server.post('/api/students/createStudent', async (req, res) => {
    try {
        const { first_name, last_name, university_id, user_id} = req.body; // Expect university_id from request body
        if (!first_name) {
            return res.status(400).json({ error: "Missing first_name" });
        } else if (!last_name) {
            return res.status(401).json({ error: "Missing last_name" });
        } else if (!user_id) {
            return res.status(402).json({ error: "Missing user_id" });
        } else if (!university_id) {
            return res.status(403).json({ error: "Missing university_id" });
        }

        const [result] = await pool.execute(
            'INSERT INTO Students (first_name, last_name, university_id, user_id) VALUES (?, ?, ?, ?)',
            [first_name, last_name, university_id, user_id]
        );

        res.status(201).json({ student_id: result.insertId });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

server.get('/api/students/getStudentStatus', async (req, res) => {
    try {
        const { user_id } = req.query;

        if (!user_id) {
            return res.status(400).json({ error: "Missing user_id parameter" });
        }

        const [rows] = await pool.execute('SELECT status FROM Students WHERE user_id = ?', [user_id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Student not found" });
        }

        const { status } = rows[0];

        if (status === 'active') {
            return res.status(200).json({ message: "Student is active" });
        } else if (status === 'pending') {
            return res.status(400).json({ error: "Student status is pending" });
        } else {
            return res.status(500).json({ error: "Unexpected status value" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

server.post('/api/students/joinRSO', async (req, res) => {
    try {
        const { user_id, rso_id } = req.body;

        // Validate input
        if (!user_id || !rso_id) {
            return res.status(400).json({ error: 'User ID and RSO ID are required' });
        }

        // Insert the student into the RSO_Memberships table with default status 'pending'
        const [result] = await pool.execute(
            `INSERT INTO RSO_Memberships (user_id, rso_id) VALUES (?, ?)
             ON DUPLICATE KEY UPDATE status = 'active'`, 
            [user_id, rso_id]
        );

        res.status(201).json({ message: 'Request to join RSO submitted', membership_id: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'User already requested to join this RSO' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

server.get('/api/students/getUniId/:user_id', async (req, res) => {
    try {
        const user_id = req.params.user_id;

        if (!user_id) {
            return res.status(400).json({ error: "Missing user_id in query parameters" });
        }

        const [rows] = await pool.execute('SELECT university_id FROM Students WHERE user_id = ?', [user_id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(rows[0]); // Return user data
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});



//-------------------------------------------------------------------------------
//                                RSO ROUTES
//-------------------------------------------------------------------------------
server.post('/api/rsos/createRSO', authenticateToken, async (req, res) => {
    try {
        const { name, university_id, rso_admin } = req.body;

        // Start a transaction to ensure consistency
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Insert the new RSO
            const [rsoResult] = await connection.execute(
                'INSERT INTO RSOs (name, university_id, rso_admin) VALUES (?, ?, ?)',
                [name, university_id, rso_admin]
            );

            // Update the user's role to 'rso_admin'
            await connection.execute(
                'UPDATE Users SET role = ? WHERE user_id = ?',
                ['rso_admin', rso_admin]
            );

            // Commit transaction
            await connection.commit();
            connection.release();

            res.status(201).json({ rso_id: rsoResult.insertId, message: "RSO created and user promoted to RSO admin." });
        } catch (error) {
            await connection.rollback(); // Rollback on failure
            connection.release();
            throw error;
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

server.get('/api/rsos/getRSOStatus', async (req, res) => {
    try {
        const { rso_id } = req.query;

        if (!rso_id) {
            return res.status(400).json({ error: "Missing rso_id parameter" });
        }

        const [rows] = await pool.execute('SELECT status FROM RSOs WHERE rso_id = ?', [rso_id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "RSO not found" });
        }

        const { status } = rows[0];

        if (status === 'active') {
            return res.status(200).json({ message: "RSO is active" });
        } else if (status === 'pending') {
            return res.status(400).json({ error: "RSO status is pending" });
        } else {
            return res.status(500).json({ error: "Unexpected status value" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

server.get('/api/rsos/getRSOId/:user_id', async (req, res) => {
    try {
        const user_id = req.params.user_id;

        if (!user_id) {
            return res.status(400).json({ error: "Missing user_id in query parameters" });
        }

        const [rows] = await pool.execute('SELECT rso_id FROM RSOs WHERE rso_admin = ?', [user_id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(rows[0]); // Return user data
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

//-------------------------------------------------------------------------------
//                                EVENT ROUTES
//-------------------------------------------------------------------------------
server.post('/api/events/createEvent', [authenticateToken, validateEvent], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const {
            name, description, category, date_time, building_id, contact_phone, contact_email,
            visibility, university_id, rso_id, rso_admin
        } = req.body;
        
        const [result] = await pool.execute(
            `INSERT INTO Events (name, description, category, date_time, building_id, contact_phone, contact_email, visibility,
                university_id, rso_id, rso_admin) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, description, category, date_time, building_id, contact_phone, contact_email,
             visibility, university_id, rso_id, rso_admin]
        );
        res.status(201).json({ event_id: result.insertId });
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

server.get('/api/events/getEventList', authenticateToken, async (req, res) => {
    try{
        const { university_id, rso_id } = req.body;
        let query = 'SELECT * FROM Events WHERE 1=1';
        const params = [];

        if (university_id) {
            query += ' AND university_id = ?';
            params.push(university_id);
        }

        if (rso_id) {
            query += ' AND rso_id = ?';
            params.push(rso_id);
        }

        const [rows] = await pool.execute(query, params);
        res.json(rows);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

server.get('/api/events/getUniLevelEvents/:user_id', authenticateToken, async (req, res) => {
    try {
        const { user_id } = req.params;

        const query = `
            SELECT e.* 
            FROM Events e
            JOIN Universities u ON e.university_id = u.university_id
            WHERE u.user_id = ?
        `;
        
        const [rows] = await pool.execute(query, [user_id]);
        res.status(201).json({ message: "University events retrieved successfully.", data: rows });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

server.get('/api/events/getRSOLevelEvents/:user_id', authenticateToken, async (req, res) => {
    try {
        const { user_id } = req.params;

        // Step 1: Get the RSOs where the user is the rso_admin
        const rsoQuery = `SELECT rso_id FROM RSOs WHERE rso_admin = ? AND status = 'active'`;
        const [rsoRows] = await pool.execute(rsoQuery, [user_id]);

        if (rsoRows.length === 0) {
            return res.status(404).json({ message: "No RSOs found for this admin." });
        }

        // Extract RSO IDs
        const rsoIds = rsoRows.map(row => row.rso_id);

        // Step 2: Fetch events from those RSOs
        const eventQuery = `
            SELECT DISTINCT e.* 
            FROM Events e
            WHERE e.rso_id IN (${rsoIds.map(() => '?').join(',')})  
        `;

        const [eventRows] = await pool.execute(eventQuery, rsoIds);

        res.status(202).json({ message: "RSO admin events retrieved successfully.", data: eventRows });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

server.get('/api/events/getStudentLevelEvents/:user_id', authenticateToken, async (req, res) => {
    try {
        const { user_id } = req.params;

        // First, get the RSOs the student is a member of
        const membershipQuery = `
            SELECT rso_id FROM RSO_Memberships 
            WHERE user_id = ? AND status = 'active'
        `;
        const [memberships] = await pool.execute(membershipQuery, [user_id]);

        // Extract RSO IDs from the result
        const rsoIds = memberships.map(m => m.rso_id);

        // Construct the query to get events
        let query = `
            SELECT DISTINCT e.* 
            FROM Events e
            LEFT JOIN Universities u ON e.university_id = u.university_id
            LEFT JOIN Students s ON s.user_id = ? AND s.university_id = u.university_id
            WHERE e.visibility = 'public'
            OR (e.visibility = 'private' AND s.status = 'active')
        `;

        let params = [user_id];

        // If the user has RSO memberships, add the condition to get RSO-specific events
        if (rsoIds.length > 0) {
            query += ` OR (e.visibility = 'rso' AND e.rso_id IN (${rsoIds.map(() => '?').join(',')}))`;
            params = [...params, ...rsoIds];
        }

        const [rows] = await pool.execute(query, params);
        res.status(203).json({ message: "Student events retrieved successfully.", data: rows });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


server.put('/api/events/:event_id', authenticateToken, async (req, res) => {
    try{
        const { event_id } = req.params;
        const updates = req.body;
        
        //check permission for user
        const [event] = await pool.execute(
            'SELECT * FROM Events WHERE event_id = ?',
            [event_id]
        );

        if (event[0].created_by !== req.user.user_id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized to update this event' });
        }

        const [result] = await pool.execute(
            'UPDATE Events SET ? WHERE event_id = ?',
            [updates, event_id]
        );
        res.json({ updated: result.affectedRows > 0 });
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});



//-------------------------------------------------------------------------------
//                                COMMENTS ROUTES
//-------------------------------------------------------------------------------
server.post('/api/comments/addComment', authenticateToken, async (req, res) => {
    try {
        const { event_id, comment, user_id } = req.body;

        if (!event_id || !comment) {
            return res.status(400).json({ error: "Event ID and comment are required." });
        }

        const [result] = await pool.execute(
            'INSERT INTO EventComments (event_id, user_id, comment) VALUES (?, ?, ?)',
            [event_id, user_id, comment]
        );

        res.status(201).json({ comment_id: result.insertId, message: "Comment added successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

server.put('/api/comments/updateComment', authenticateToken, async (req, res) => {
    try {
        const { comment_id, comment, user_id } = req.body;


        if (!comment) {
            return res.status(400).json({ error: "Comment cannot be empty." });
        }

        // Ensure user can only edit their own comment
        const [existingComment] = await pool.execute(
            'SELECT user_id FROM EventComments WHERE comment_id = ?',
            [comment_id]
        );

        if (existingComment.length === 0) {
            return res.status(404).json({ error: "Comment not found." });
        }

        if (existingComment[0].user_id !== user_id) {
            return res.status(403).json({ error: "You can only edit your own comments." });
        }

        await pool.execute(
            'UPDATE EventComments SET comment = ? WHERE comment_id = ?',
            [comment, comment_id]
        );

        res.status(200).json({ message: "Comment updated successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

server.delete('/api/comments/deleteComment', authenticateToken, async (req, res) => {
    try {
        const { comment_id, user_id } = req.body;


        // Ensure user can only delete their own comment
        const [existingComment] = await pool.execute(
            'SELECT user_id FROM EventComments WHERE comment_id = ?',
            [comment_id]
        );

        if (existingComment.length === 0) {
            return res.status(404).json({ error: "Comment not found." });
        }

        if (existingComment[0].user_id !== user_id) {
            return res.status(403).json({ error: "You can only delete your own comments." });
        }

        await pool.execute(
            'DELETE FROM EventComments WHERE comment_id = ?',
            [comment_id]
        );

        res.status(200).json({ message: "Comment deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

server.get('/api/comments/getCommentList/:event_id', authenticateToken, async (req, res) => {
    try {
        const { event_id } = req.params;

        if (!event_id) {
            return res.status(400).json({ error: "Missing event_id parameter" });
        }

        const [rows] = await pool.execute(
            'SELECT * FROM EventComments WHERE event_id = ?',
            [event_id]
        );

        res.json({ message: "Comments retrieved successfully", comments: rows });
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ error: error.message });
    }
});


//-------------------------------------------------------------------------------
//                                RATING ROUTES
//-------------------------------------------------------------------------------
server.post('/api/ratings/addOrUpdateRating', authenticateToken, async (req, res) => {
    try {
        const { event_id, user_id, rating } = req.body;

        if (!event_id || !user_id || !rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: "Invalid input. Event ID, User ID, and valid rating (1-5) are required." });
        }

        // Use INSERT ... ON DUPLICATE KEY UPDATE
        await pool.execute(`
            INSERT INTO EventRatings (event_id, user_id, rating)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE rating = VALUES(rating), created_at = CURRENT_TIMESTAMP
        `, [event_id, user_id, rating]);

        res.status(200).json({ message: "Rating submitted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

server.get('/api/ratings/getAverage/:event_id', async (req, res) => {
    try {
        const { event_id } = req.params;

        const [rows] = await pool.execute(
            `SELECT ROUND(AVG(rating), 2) AS average_rating FROM EventRatings WHERE event_id = ?`,
            [event_id]
        );

        const avg = rows[0]?.average_rating;

        res.status(200).json({ event_id, average_rating: avg ?? null });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

server.get('/api/ratings/getUserRating/:event_id/:user_id', async (req, res) => {
    try {
        const { event_id, user_id } = req.params;

        const [rows] = await pool.execute(
            `SELECT rating FROM EventRatings WHERE event_id = ? AND user_id = ?`,
            [event_id, user_id]
        );

        res.status(200).json({ rating: rows[0]?.rating ?? null });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});




//-------------------------------------------------------------------------------
//                                BUILDING ROUTES
//-------------------------------------------------------------------------------
server.post('/api/buildings/addBuildings', async (req, res) => {
    const { buildings, university_id } = req.body; 

    if (!Array.isArray(buildings) || buildings.length === 0 || !university_id) {
        return res.status(400).json({ error: 'Invalid request. Provide buildings array and university_id.' });
    }

    try {
        const connection = await pool.getConnection();
        const sql = `INSERT INTO Buildings (name, latitude, longitude, university_id) VALUES ?`;

        const values = buildings.map(building => [
            building.name,
            building.lat,
            building.lng,
            university_id
        ]);

        await connection.query(sql, [values]);
        connection.release();

        res.status(201).json({ message: 'Buildings inserted successfully!', count: buildings.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



//error handling
server.use(errorHandler);