const express = require("express");
const mssql = require("mssql");

const app = express();

const dbConfig = {
    user: "your_username",
    password: "your_password",
    server: "your_server",
    database: "your_database",
    options: {
        encrypt: false, // Change it to true if you're using encryption
        trustServerCertificate: true,
    },
};

// Create a connection pool
const pool = new mssql.ConnectionPool(dbConfig);
const poolConnect = pool.connect();

poolConnect
    .then((pool) => {
        console.log("MSSQL 연결 완료");
    })
    .catch((err) => {
        console.error("Error connecting to MSSQL:", err);
    });

// main - FullCalendar 화면
app.get("/main", async (req, res) => {
    try {
        const request = pool.request();
        const result = await request.query(`
            SELECT id, UserName as title, UserType, StartDate as start, CONVERT(CHAR(10), DATEADD(DAY, 1, EndDate), 23) as [end]
            FROM tblTest 
            ORDER BY StartDate, UserName
        `);
        console.log("Result: ", result.recordset);
        res.json(result.recordset);
    } catch (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

const PORT = process.env.PORT || 8088;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
