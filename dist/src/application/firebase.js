"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.realtimeDb = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const serviceAccountKey_json_1 = __importDefault(require("../storage/firebase/serviceAccountKey.json"));
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccountKey_json_1.default),
    databaseURL: process.env.FIREBASE_URL_DB // ganti sesuai dari config Firebase
});
exports.realtimeDb = firebase_admin_1.default.database();
exports.default = firebase_admin_1.default;
//# sourceMappingURL=firebase.js.map