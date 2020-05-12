const admin = require("firebase-admin");
const serviceAccount = require('./serviceaccount.json');
const firebaseConfig = require('./config.js');



admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: firebaseConfig.databaseURL,
  storageBucket: firebaseConfig.storageBucket
});

const db = admin.firestore();
const fieldValue = admin.firestore.FieldValue;
const storage = admin.storage();


module.exports = { db, fieldValue, storage }