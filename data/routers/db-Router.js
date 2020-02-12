const express = require('express');

const db = require('../db');

const router = express.Router();

router.post('/', (req, res) => {
    const dbInfo = req.body;
    
    if(dbInfo.title === undefined || dbInfo.contents === undefined ){
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else {
        db
            .insert(dbInfo)
            .then(inserted => {
                db
                    .findById(inserted.id)
                    .then(found => res.status(201).json(found))
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({ error: "There was an error while saving the post to the database" });
                    });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: "There was an error while saving the post to the database" });
            });
    }
});

router.post('/:id/comments', (req, res) => {
    const comment = req.body;
    const {id} = req.params;

    if(comment.post_id !== id) {
        res.status(404).json({ message: "The post with the specified ID does not exist." });
    }
    else if (comment.text === undefined) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." });
    } else {
        db
            .insertComment(comment)
            .then(inserted => {
                db
                    .findCommentById(inserted.id)
                    .then(found => res.status(201).json(found))
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({ error: "There was an error while saving the comment to the database" });
                    });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: "There was an error while saving the comment to the database" });
            });
    }
});

router.get('/', (req, res) => {
    db
        .find()
        .then(found => {
            res.status(200).json(found);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "The posts information could not be retrieved." });
        });
});


router.get('/:id', (req, res) => {
    const {id} = req.params;

    db
        .findById(id)
        .then(found => {
            if(found === undefined) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            } else {
                res.status(200).json(found)
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "The post information could not be retrieved." });
        });
});

router.get('/:id/comments', (req, res) => {
    const {id} = req.params;

    router.findById(id)
    .then(found => {
        if(found === []) {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        } else {
            db
                .findPostComments(id)
                .then(found => {
                    res.status(200).json(found);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ error: "The comments information could not be retrieved." });
                });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: "The comments information could not be retrieved." });
    })
});

router.delete('/:id', (req, res) => {
    const {id} = req.params;

    db
        .remove(id)
        .then(removed => {
            if(removed){
                res.status(200).json({ message: 'post removed' });
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "The post could not be removed" });
        })
})

router.put('/:id', (req, res) => {
    const {id} = req.params;
    const newPost = req.body;

    router
        .findById(id)
        .then(found => {
            if (found === []) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            } else {
                if(newPost.title === undefined || newPost.contents === undefined) {
                    res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
                } else {
                    db.update(id, newPost)
                        .then(updated => {
                            if (updated) {
                                res.status(200).json({ message: 'post updated' });
                            } else {
                                res.status(404).json({ message: "The post with the specified ID does not exist." })
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({ error: "The post information could not be modified." });
                        });       
                }
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "The post information could not be modified." });
        });
});


module.exports = router;