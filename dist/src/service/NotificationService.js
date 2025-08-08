"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const firebase_1 = require("../application/firebase");
class NotificationService {
    static sendNotificationToAdminGroup(senderId, title, body, type, objectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ref = firebase_1.realtimeDb.ref("notifications/admin");
            const newNotifRef = ref.push();
            yield newNotifRef.set({
                senderId,
                title,
                type,
                objectId,
                body,
                read: false,
                createdAt: new Date().toISOString(),
            });
            return { id: newNotifRef.key, senderId, title, body };
        });
    }
    // Tandai satu notifikasi sebagai read
    static markNotificationAsRead(notifId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notifRef = firebase_1.realtimeDb.ref(`notifications/admin/${notifId}`);
            // Cek dulu apakah notif ada
            const snapshot = yield notifRef.once("value");
            if (!snapshot.exists()) {
                throw new Error("Notification not found");
            }
            yield notifRef.update({ read: true });
            return { success: true };
        });
    }
    // (Optional) Tandai semua notifikasi admin sebagai read
    static markAllNotificationsAsRead() {
        return __awaiter(this, void 0, void 0, function* () {
            const ref = firebase_1.realtimeDb.ref("notifications/admin");
            const snapshot = yield ref.once("value");
            if (!snapshot.exists())
                return { success: true };
            const updates = {};
            snapshot.forEach(childSnap => {
                updates[`${childSnap.key}/read`] = true;
            });
            yield ref.update(updates);
            return { success: true };
        });
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=NotificationService.js.map