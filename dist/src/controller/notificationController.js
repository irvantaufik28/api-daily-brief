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
const NotificationService_1 = require("../service/NotificationService");
// Kirim notifikasi ke semua admin
const sendNotificationToAdmins = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { senderId, title, body, type, objectId } = req.body;
        if (!senderId || !title || !body || !type || !objectId) {
            return res.status(400).json({ message: "Missing senderId, title, body or type" });
        }
        const notif = yield NotificationService_1.NotificationService.sendNotificationToAdminGroup(senderId, title, body, type, objectId);
        res.status(200).json({ message: "Notification sent", data: notif });
    }
    catch (error) {
        next(error);
    }
});
// Tandai satu notif admin sebagai read berdasarkan notifId
const markAsRead = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notifId = req.params.notifId;
        if (!notifId) {
            return res.status(400).json({ message: "Notification ID is required" });
        }
        const result = yield NotificationService_1.NotificationService.markNotificationAsRead(notifId);
        res.status(200).json({ message: "Notification marked as read", data: result });
    }
    catch (error) {
        next(error);
    }
});
// Tandai semua notif admin sebagai read
const markAllAsRead = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield NotificationService_1.NotificationService.markAllNotificationsAsRead();
        res.status(200).json({ message: "All notifications marked as read", data: result });
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    sendNotificationToAdmins,
    markAsRead,
    markAllAsRead,
};
//# sourceMappingURL=notificationController.js.map