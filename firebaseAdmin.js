const admin = require("firebase-admin");
const serviceAccount = require("./app/lib/delaqua-cy-firebase-adminsdk-9qnvv-503cb722ed.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
