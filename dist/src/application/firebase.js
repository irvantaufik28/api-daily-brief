"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.realtimeDb = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT env var is not set");
}
const serviceAccountJson = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
// Konversi string private_key: ganti '\\n' (dua karakter) jadi '\n' (newline sebenarnya)
serviceAccountJson.private_key = serviceAccountJson.private_key.replace(/\\n/g, '\n');
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccountJson),
    databaseURL: process.env.FIREBASE_URL_DB,
});
exports.realtimeDb = firebase_admin_1.default.database();
exports.default = firebase_admin_1.default;
//# sourceMappingURL=firebase.js.map