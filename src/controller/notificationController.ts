import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../service/NotificationService';

// Kirim notifikasi ke semua admin
const sendNotificationToAdmins = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { senderId, title, body, type, objectId } = req.body;
    if (!senderId || !title || !body || !type ||!objectId) {
      return res.status(400).json({ message: "Missing senderId, title, body or type" });
    }

    const notif = await NotificationService.sendNotificationToAdminGroup(senderId, title, body, type, objectId);
    res.status(200).json({ message: "Notification sent", data: notif });
  } catch (error) {
    next(error);
  }
};

// Tandai satu notif admin sebagai read berdasarkan notifId
const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notifId = req.params.notifId;
    console.log(notifId)
    if (!notifId) {
      return res.status(400).json({ message: "Notification ID is required" });
    }

    const result = await NotificationService.markNotificationAsRead(notifId);
    res.status(200).json({ message: "Notification marked as read", data: result });
  } catch (error) {
    next(error);
  }
};

// Tandai semua notif admin sebagai read
const markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await NotificationService.markAllNotificationsAsRead();
    res.status(200).json({ message: "All notifications marked as read", data: result });
  } catch (error) {
    next(error);
  }
};

export default {
  sendNotificationToAdmins,
  markAsRead,
  markAllAsRead,
};
