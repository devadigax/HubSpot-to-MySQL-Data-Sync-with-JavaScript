const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const config = require('./config.json');

const app = express();
const port = 3000;

const mysqlConfig = config.mysql;

const pool = mysql.createPool({
  host: mysqlConfig.host,
  user: mysqlConfig.user,
  password: mysqlConfig.password,
  database: mysqlConfig.database,
  connectionLimit: 10,
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/data', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;

    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM contacts LIMIT ? OFFSET ?', [limit, offset]);
    connection.release();

    res.json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/data/count', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [countRows] = await connection.query('SELECT COUNT(*) AS count FROM contacts');
    connection.release();

    const totalCount = countRows[0].count;
    res.json(totalCount);
  } catch (error) {
    console.error('Error fetching data count:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
