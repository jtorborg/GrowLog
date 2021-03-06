const router = require('express').Router();
const config = require('../db/connections');
const knex = require('knex')(config.development);

// find user in the DB by ID
function findUserById(googleID, userName, userEmail, accessToken, refreshToken) {
  return new Promise(function (resolve, reject) {

    knex.select()
        .from('users')
        .where('google_id', googleID)
        .then(function (user) {
          resolve(user[0]);
        }).catch(function (err) {
          console.log('Error Querying the DB', err);
          return reject(err);
        });

  });
};

// create new user in DB after it is not found by ID
function createNewUser(googleID, userName, userEmail, accessToken, refreshToken) {
  return new Promise(function (resolve, reject) {

    var newUser = {
      google_id: googleID,
      google_name: userName,
      google_email: userEmail,
      access_token: accessToken,
      refresh_token: refreshToken
    };

    console.log('newUser', newUser);

    knex.insert(newUser)
        .into('users')
        .returning('*')
        .then(function (user) {
          resolve(user[0]);
        }).catch(function (err) {
          console.log('Error Querying the DB', err);
          return reject(err);
        });

  });
};

// update access and refresh tokens in the DB
function updateTokens(googleID, userName, userEmail, accessToken, refreshToken) {
  return new Promise(function (resolve, reject) {

    var newTokens = {
      google_name: userName,
      google_email: userEmail,
      access_token: accessToken,
      refresh_token: refreshToken
    };

    knex('users').where('google_id', googleID)
                 .update(newTokens)
                 .returning('*')
                 .then(function (user) {
                    resolve(user[0]);
                  }).catch(function (err) {
                    console.log('Error Querying the DB', err);
                    return reject(err);
                  });
  });
};

// exports the three functions
module.exports = {
  findUserById: findUserById,
  createNewUser: createNewUser,
  updateTokens: updateTokens
};
