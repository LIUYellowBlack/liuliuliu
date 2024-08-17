const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql');

const app = express();

// 设置body-parser中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 设置session中间件
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// 连接MySQL数据库
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'liuliuliu',
    database: 'user_management'
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL connected...');
});

// 设置端口
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// 获取用户列表
app.get('/api/users', (req, res) => {
    let sql = 'SELECT * FROM users';
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// 获取分页用户列表
app.get('/api/users/pagination', (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let offset = (page - 1) * limit;
    let sql = 'SELECT * FROM users LIMIT ?, ?';
    let query = db.query(sql, [offset, limit], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// 添加新用户
app.post('/api/users', (req, res) => {
    let data = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    };
    let sql = 'INSERT INTO users SET ?';
    let query = db.query(sql, data, (err, result) => {
        if (err) throw err;
        res.send({
            id: result.insertId,
            ...data
        });
    });
});

// 删除用户
app.delete('/api/users/:id', (req, res) => {
    let sql = 'DELETE FROM users WHERE id = ?';
    let query = db.query(sql, req.params.id, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});
// 更新用户信息
app.put('/api/users/:id', (req, res) => {
    let sql = 'UPDATE users SET username = ?, password = ?, email = ? WHERE id = ?';
    let data = [
        req.body.username,
        req.body.password,
        req.body.email,
        req.params.id
    ];
    let query = db.query(sql, data, (err, result) => {
        if (err) throw err;
        res.send('User updated...');
    });
});

// 提供静态文件服务
app.use(express.static('public'));
