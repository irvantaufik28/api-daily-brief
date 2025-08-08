import { realtimeDb } from "../application/firebase";
export class NotificationService {

    static async sendNotificationToAdminGroup(senderId: number, title: string, body: string, type: string, objectId: number) {
        const ref = realtimeDb.ref("notifications/admin");
        const newNotifRef = ref.push();

        await newNotifRef.set({
            senderId,
            title,
            type,
            objectId,
            body,
            read: false,
            createdAt: new Date().toISOString(),
        });

        return { id: newNotifRef.key, senderId, title, body };
    }


    // Tandai satu notifikasi sebagai read
    static async markNotificationAsRead(notifId: string) {
        const notifRef = realtimeDb.ref(`notifications/admin/${notifId}`);

        // Cek dulu apakah notif ada
        const snapshot = await notifRef.once("value");
        if (!snapshot.exists()) {
            throw new Error("Notification not found");
        }

        await notifRef.update({ read: true });

        return { success: true };
    }

    // (Optional) Tandai semua notifikasi admin sebagai read
    static async markAllNotificationsAsRead() {
        const ref = realtimeDb.ref("notifications/admin");
        const snapshot = await ref.once("value");

        if (!snapshot.exists()) return { success: true };

        const updates: Record<string, any> = {};
        snapshot.forEach(childSnap => {
            updates[`${childSnap.key}/read`] = true;
        });

        await ref.update(updates);
        return { success: true };
    }
}
