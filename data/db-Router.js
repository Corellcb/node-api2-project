const express = require('express');

const db = require('./db');

const router = express.Router();

router.get('/', (req, res) => {
    db.find()
    .then(found => {
        res.status(200).json(found);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ errorMessage: "Oops! Looks like we had an issue on our end." });
    })
})

module.exports = router;