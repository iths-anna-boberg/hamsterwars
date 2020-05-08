const admin = require("firebase-admin");
const serviceAccount = require('serviceaccount.json');
const firebaseConfig = require('./config.js');


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: firebaseConfig.databaseURL
});

const db = admin.firestore();


module.exports = { db }