import admin from "firebase-admin";

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT env var is not set");
}

const serviceAccountJson = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Konversi string private_key: ganti '\\n' (dua karakter) jadi '\n' (newline sebenarnya)
serviceAccountJson.private_key = serviceAccountJson.private_key.replace(/\\n/g, '\n');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountJson),
  databaseURL: process.env.FIREBASE_URL_DB,
});

export const realtimeDb = admin.database();
export default admin;
