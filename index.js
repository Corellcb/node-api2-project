const express = require('express');
const server = express();

const db = require('./data/db');

server.use(express.json());

server.get('/', (req, res) => {
    res.send(`
        <h2>Hello!!<h2/>
        <p>You made it to the API!<p/>
    `);
});

const port = 5000;
server.listen(port, () => {
    console.log(`\n*** Server Running on http://localhost:${port} ***\n`);
})