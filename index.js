const express = require('express');

const dbRouter = require('./data/db-Router');

const server = express();



server.use(express.json());
server.use('/api/posts', dbRouter);

server.get('/', (req, res) => {
    res.send(`
        <h2>Hello!!<h2/>
        <p>You made it to the API!<p/>
    `);
});

const port = 5000;
server.listen(port, () => {
    console.log(`\n*** Server Running on http://localhost:${port} ***\n`);
});