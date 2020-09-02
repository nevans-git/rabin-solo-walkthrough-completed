const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
  rejectUnauthenticated,
  rejectNonAdmin
} = require('../modules/authentication-middleware');
/**
 * GET route template
 */
// PROTECT THIS ROUTE!
router.get('/', (req, res) => {
  // This route *should* get all pets for the logged in user
  if (req.isAuthenticated()) {
    console.log('/pet GET route');
    console.log('Is User logged in?', req.isAuthenticated());
    console.log('user info', req.user);// req.user is a reflection of user table

    let queryText = `SELECT * FROM "pet" WHERE "user_id" = $1`;
    pool.query(queryText, [req.user.id]).then((result) => {
      res.send(result.rows);
    }).catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
  } else {
    res.sendStatus(403);
  }

});

// This route *should* add a pet for the logged in user
router.post('/', rejectUnauthenticated, rejectNonAdmin, (req, res) => {
  console.log('/pet POST route');
  console.log(req.body);
  console.log('is authenticated?', req.isAuthenticated());
  console.log('user', req.user);

  const queryText = `INSERT INTO "pet" ("firstname", "user_id")
                      VALUES ($1, $2)`;

  pool.query(queryText, [req.body.firstname, req.user.id])
  then((result) => {
    res.sendStatus(201)
  }).catch((error) => {
    console.log(error);
    res.sendStatus(500);
  });

  // res.sendStatus(200);

});

module.exports = router;
