require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const port = 3000;
const apiRoutes = require('./api');

app.use(express.json());
app.use('/api', apiRoutes);

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// 提供静态文件服务
app.use(express.static(path.join(__dirname, '../frontend')));

// 将根路径重定向到 index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// 登录API
app.post('/api/login', (req, res) => {
    const { first_name, last_name, password } = req.body;
    const query = 'CALL user_login(?, ?, ?, @uid); SELECT @uid AS user_id';

    db.query(query, [first_name, last_name, password], (error, results) => {
        if (error) return res.status(500).send(error);
        const userId = results[1][0].user_id;
        if (userId) {
            res.json({ success: true, userId });
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }
    });
});

// 注册API
app.post('/api/signup', (req, res) => {
    const { first_name, last_name, password } = req.body;
    const query = 'CALL user_signup(?, ?, ?, @uid); SELECT @uid AS user_id';

    db.query(query, [first_name, last_name, password], (error, results) => {
        if (error) return res.status(500).send(error);
        res.json({ success: true, userId: results[1][0].user_id });
    });
});

// 更新用户信息API
app.post('/api/updateProfile', (req, res) => {
    const { userId, fieldName, newValue } = req.body;
    const query = 'CALL update_user_info(?, ?, ?)';
    
    db.query(query, [userId, fieldName, newValue], (error) => {
        if (error) return res.status(500).send(error);
        res.json({ success: true });
    });
});

// 收藏/取消收藏菜品API
app.post('/api/toggleFavoriteDish', (req, res) => {
    const { userId, dishId, action } = req.body;
    const query = action === 'add' ? 'CALL add_favorite_dish(?, ?)' : 'CALL remove_favorite_dish(?, ?)';
    
    db.query(query, [userId, dishId], (error) => {
        if (error) return res.status(500).send(error);
        res.json({ success: true });
    });
});

// 收藏/取消收藏游乐设施API
app.post('/api/toggleFavoriteRide', (req, res) => {
    const { userId, rideId, action } = req.body;
    const query = action === 'add' ? 'CALL add_favorite_ride(?, ?)' : 'CALL remove_favorite_ride(?, ?)';
    
    db.query(query, [userId, rideId], (error) => {
        if (error) return res.status(500).send(error);
        res.json({ success: true });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
