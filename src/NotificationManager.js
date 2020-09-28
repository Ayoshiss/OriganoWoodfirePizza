import React, {Component} from 'react';
import {Text, View, Platform} from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

class NotificationManager extends Component {
  configure = (onRegister, onNotification, onOpenNotification, senderID) => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        onRegister(token.token);
      },
      onNotification: function (notification) {
        alert(notification.message);
        if (Platform.OS === 'ios') {
          if (notification.data.openedInForeground) {
            notification.userInteraction = true;
          }
        }
        if (Platform.OS === 'android') {
          notification.userInteraction = true;
        }
        if (notification.userInteraction) {
          onOpenNotification(notification);
        } else {
          onNotification(notification);
        }
        // process the notification

        if (Platform.OS === 'ios') {
          if (!notification.data.openedInForeground) {
            notification.finish('backgroundFetchResultNoData');
          }
        } else {
          notification.finish('backgroundFetchResultNoData');
        }
      },
      // ANDROID ONLY : GCM or FCM Sender ID
      senderID: senderID,
    });
  };
  _buildAndroidNotification = (id, title, message, data = {}, options = {}) => {
    return {
      id: id,
      autoCancel: true,
      largeIcon: options.largeIcon || 'ic_launcher',
      smallIcon: options.smallIcon || 'ic_launcher',
      bigText: message || '',
      subText: title || '',
      vibrate: options.vibrate || false,
      vibration: options.vibration || 300,
      priority: options.priority || 'high',
      importance: options.importance || 'high',
      data: data,
    };
  };
  _buildIOSNotification = (id, title, message, data = {}, options = {}) => {
    return {
      alertAction: options.alertAction || 'view',
      category: options.category || '',
      userInfo: {
        id: id,
        item: data,
      },
    };
  };
  showNotification = (id, title, message, data = {}, options = {}) => {
    console.log('Hello');
    console.log(id, title, message, data, options);
    PushNotification.localNotification({
      /*Android only properties */
      ...this._buildAndroidNotification(id, title, message, data, options),
      /*IOS only properties */
      ...this._buildAndroidNotification(id, title, message, data, options),
      /*IOS and Android properties */
      title: title || '',
      message: message || '',
      playSound: options.playSound || false,
      soundName: options.soundName || 'default',
      userInteraction: false, //If the notification was opened by the user from the notification area or not
    });
  };
  cancelAllLocalNotification = () => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.removeAllDeliveredNotifications();
    } else {
      PushNotification.cancelAllLocalNotifications();
    }
  };
  unregister = () => {
    PushNotification.unregister();
  };
}
export const notificationManager = new NotificationManager();
