import admin from "firebase-admin";
import serviceAccount from "../storage/firebase/serviceAccountKey.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: process.env.FIREBASE_URL_DB// ganti sesuai dari config Firebase
});

export const realtimeDb = admin.database();
export default admin;
