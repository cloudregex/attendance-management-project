import NotificationToken from '../model/notificationToken.model.js';
import admin from '../config/firebase.js';

// Save FCM token representing a device
export const saveToken = async (req, res) => {
  try {
    const { token, userId } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    // Upsert logic: if token exists, update its userId, otherwise insert
    const [notificationToken, created] = await NotificationToken.findOrCreate({
      where: { token },
      defaults: { userId }
    });

    if (!created && userId !== undefined) {
      notificationToken.userId = userId;
      await notificationToken.save();
    }

    return res.status(200).json({ message: 'Token saved successfully', data: notificationToken });
  } catch (error) {
    console.error('Error in saveToken:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Send a push notification
export const sendNotification = async (req, res) => {
  try {
    const { title, body, imageUrl } = req.body;

    if (!title || !body) {
       return res.status(400).json({ message: 'Title and body are required' });
    }

    // Get all valid tokens
    const tokensResult = await NotificationToken.findAll();
    const tokens = tokensResult.map(t => t.token);
    
    console.log(`[Broadcast] Found ${tokens.length} notification tokens.`);

    if (tokens.length === 0) {
       return res.status(404).json({ message: 'No notification tokens found to send to' });
    }

    // check if firebase admin is ready
    if (!admin.apps.length) {
       console.error('[Broadcast] Firebase Admin not initialized!');
       return res.status(500).json({ message: 'Firebase Admin not configured on server' });
    }

    const payload = {
      notification: {
        title,
        body,
        ...(imageUrl && { image: imageUrl })
      },
      tokens
    };

    console.log('[Broadcast] Sending multicast payload via FCM...');
    const response = await admin.messaging().sendEachForMulticast(payload);
    console.log(`[Broadcast] Done. Success: ${response.successCount}, Failure: ${response.failureCount}`);

    if (response.failureCount > 0) {
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          console.error(`[Broadcast] Token ${idx} failure:`, resp.error);
        }
      });
    }

    // Provide logging for successful/failed messages
    return res.status(200).json({
       message: 'Notifications sent',
       successCount: response.successCount,
       failureCount: response.failureCount
    });

  } catch (error) {
    console.error('[Broadcast] Error in sendNotification:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
