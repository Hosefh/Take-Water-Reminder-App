import React, { useEffect } from 'react';
import { Text, View, StyleSheet } from "react-native"
import { scheduleNotificationAsync, addNotificationReceivedListener, presentNotificationAsync } from 'expo-notifications';


const Test2 = () => {

//   useEffect(() => {
//     const sendTestNotification = async () => {
//       try {
//         await presentNotificationAsync({
//           title: 'Test Notification',
//           body: 'This is a test notification.',
//         });
//         console.log('Test notification sent successfully');
//       } catch (error) {
//         console.error('Error sending test notification:', error);
//       }
//     };

//     sendTestNotification();
//   }, []);

//   useEffect(() => {
//     const subscription = addNotificationReceivedListener((notification) => {
//         // Handle the notification here (e.g., display it to the user)
//         console.log('Notification received while app is in foreground:', notification);
//     });

//     return () => {
//         subscription.remove();
//     };
// }, []);

//   useEffect(() => {
//     const scheduleTestNotification = async () => {
//         try {
//             const notificationContent = {
//                 content: {
//                     title: 'Test Notification',
//                     body: 'This is a test notification.',
//                 },
//                 trigger: {
//                     seconds: 2, // Send the notification 5 seconds from now
//                 },
//             };
//             await scheduleNotificationAsync(notificationContent);
//             console.log('Test notification sent successfully');
//         } catch (error) {
//             console.error('Error sending test notification:', error);
//         }
//     };

//     scheduleTestNotification();
// }, []);
  
  return (
    <View style={styles.container}>
      <Text style={styles.mainBodyText}>Settings will be available soon.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
    padding: 10,
  },
  main: {
    padding: 4,
    marginTop: 4,
  },
  mainHeaderText: {
    marginTop: 4,
    padding: 2,
    fontSize: 20,
    fontWeight: "bold",
  },
  mainBodyText: {
    padding: 2,
    fontSize: 16,
  },
})

export default Test2