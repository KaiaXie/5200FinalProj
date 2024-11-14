const mysql = require('mysql2');

// 创建数据库连接
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',       // 替换为您的数据库用户名
    password: 'Gold0410!', // 替换为您的数据库密码
    database: 'FinalProj'
});

// 连接到数据库
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});

module.exports = db;