import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, TouchableOpacity, ScrollView } from "react-native";
import PushNotification from "react-native-push-notification";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import Drawer from "react-native-drawer";
import { getFirebaseApp } from "../utils/config";
import {
	getFirestore,
	collection,
	doc,
	setDoc,
	addDoc,
	getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import * as Notifications from "expo-notifications";

const ReminderScreen = () => {
	const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
	const [selectedTime, setSelectedTime] = useState("");
	const [selectedDays, setSelectedDays] = useState([]);
	const [isDrawerOpen, setDrawerOpen] = useState(false);
	const [reminders, setReminders] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		getReminders();
	}, [isLoading]);

	useEffect(() => {
		const subscription = Notifications.addNotificationResponseReceivedListener(
			(response) => {
				console.log(response.notification);
				// Handle notification interaction...
			}
		);

		return () => {
			subscription.remove();
		};
	}, []);

	const requestPermissions = async () => {
		const { status } = await Notifications.requestPermissionsAsync();
		if (status !== "granted") {
			alert("Notification permissions are required to use this feature.");
		}
	};

	useEffect(() => {
		requestPermissions();
	}, []);

	const scheduleReminderNotification = async (reminder) => {
		await Notifications.scheduleNotificationAsync({
			content: {
				title: "Reminder",
				body: "Time to do drink your water!",
			},
			trigger: {
				date: reminder.time,
			},
		});
	};

	const showTimePicker = () => {
		setTimePickerVisibility(true);
	};

	const hideTimePicker = () => {
		setTimePickerVisibility(false);
	};

	const handleTimeConfirm = (time) => {
		setSelectedTime(time);
		hideTimePicker();
	};

	const handleDaySelect = (day) => {
		const updatedDays = selectedDays.includes(day)
			? selectedDays.filter((d) => d !== day)
			: [...selectedDays, day];
		setSelectedDays(updatedDays);
	};

	const renderDayButton = (day) => {
		const isSelected = selectedDays.includes(day);
		return (
			<TouchableOpacity
				onPress={() => handleDaySelect(day)}
				style={isSelected ? styles.selectedDayButton : styles.dayButton}
			>
				<Text
					style={
						isSelected ? styles.selectedDayButtonText : styles.dayButtonText
					}
				>
					{day}
				</Text>
			</TouchableOpacity>
		);
	};

	const saveReminder = async () => {
		try {
			setIsLoading(true);
			const app = getFirebaseApp();
			const firestore = getFirestore(app);
			const auth = getAuth(app);

			const user = auth.currentUser;
			if (!user) {
				throw new Error("User not authenticated");
			}

			const reminderData = {
				time: selectedTime,
				days: selectedDays,
			};

			await addDoc(collection(firestore, "reminders"), reminderData);

			// Schedule the notification
			await scheduleReminderNotification(reminderData);

			// display data to card
			setSelectedDays([]);
			setSelectedTime("");

			setIsLoading(false);

			setDrawerOpen(false);
		} catch (error) {
			console.error("Error saving reminder:", error.message);
			setIsLoading(false);
		}
	};

	const getReminders = async () => {
		try {
			const app = getFirebaseApp();
			const firestore = getFirestore(app);

			const remindersCollection = collection(firestore, "reminders");

			const remindersSnapshot = await getDocs(remindersCollection);

			const remindersData = [];

			remindersSnapshot.forEach((doc) => {
				if (doc.exists()) {
					const reminderData = doc.data();
					remindersData.push({ id: doc.id, ...reminderData });

					console.log("Reminder Data:", reminderData);
				} else {
					console.log("No reminder data found");
				}
			});

			setReminders(remindersData);
		} catch (error) {
			console.error("Error getting reminders:", error);
		}
	};

	const toggleDrawer = () => {
		setDrawerOpen(!isDrawerOpen);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.headerText}>Scheduled Reminders</Text>
			<Text style={styles.subHeaderText}>
				Create a reminder schedule for you.
			</Text>
			<Drawer
				open={isDrawerOpen}
				onClose={() => setDrawerOpen(false)}
				type="overlay"
				content={
					<View style={styles.drawerContent}>
						<Text style={styles.drawerTitle}>Select Time</Text>
						<TouchableOpacity
							onPress={showTimePicker}
							style={styles.selectButton}
						>
							<Text style={styles.selectButtonText}>{selectedTime ? selectedTime.toLocaleTimeString() : "Select Time"}</Text>
						</TouchableOpacity>
						<DateTimePickerModal
							isVisible={isTimePickerVisible}
							mode="time"
							onConfirm={handleTimeConfirm}
							onCancel={hideTimePicker}
						/>
						<Text style={styles.drawerTitle}>Select Days</Text>
						<View style={styles.dayButtons}>
							{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
								<View key={day} style={styles.dayButtonContainer}>
									{renderDayButton(day)}
								</View>
							))}
						</View>
						<Button
							title={"Save"}
							onPress={saveReminder}
							disabled={isLoading}
						/>
					</View>
				}
			>
				<ScrollView>
					{reminders.length === 0 ? (
						<Text></Text>
					) : (
						reminders.map((reminder) => (
							<View key={reminder.id} style={styles.card}>
								<Text style={styles.timeText}>
									{reminder.time && reminder.time.toDate
										? reminder.time.toDate().toLocaleTimeString()
										: ""}
								</Text>
								<Text style={styles.daysText}>
									{reminder.days ? reminder.days.join(", ") : ""}
								</Text>
							</View>
						))
					)}
				</ScrollView>
			</Drawer>
			<TouchableOpacity onPress={toggleDrawer} style={styles.floatingButton}>
				<Text style={styles.floatingButtonLabel}>+</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "flex-start",
		alignItems: "stretch",
		padding: 10,
	},
	headerText: {
		fontSize: 22,
		fontWeight: "bold",
	},
	subHeaderText: {
		fontSize: 16,
	},
	drawerContent: {
		flex: 1,
		padding: 20,
		backgroundColor: "rgba(255, 255, 255,0.9)"
	},
	drawerTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
	},
	selectButton: {
		paddingVertical: 10,
		backgroundColor: "#DDDDDD",
		borderRadius: 5,
		marginBottom: 10,
	},
	selectButtonText: {
		textAlign: "center",
		fontWeight: "bold",
		fontSize: 28,
	},
	dayButtons: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	dayButtonContainer: {
		marginHorizontal: 5,
		marginVertical: 2,
	},
	dayButton: {
		paddingVertical: 8,
		paddingHorizontal: 12,
		backgroundColor: "#DDDDDD",
		borderRadius: 5,
		marginVertical: 5,
		marginHorizontal: 2,
	},
	selectedDayButton: {
		paddingVertical: 8,
		paddingHorizontal: 12,
		backgroundColor: "blue",
		borderRadius: 5,
		marginVertical: 5,
		marginHorizontal: 2,
	},
	dayButtonText: {
		textAlign: "center",
		color: "black",
	},
	selectedDayButtonText: {
		textAlign: "center",
		color: "white",
	},
	addBtn: {
		borderRadius: 5,
		marginVertical: 5,
		marginHorizontal: 2,
		padding: 2,
	},
	card: {
		width: "100%",
		height: 100,
		borderRadius: 10,
		justifyContent: "space-around",
		alignItems: "start",
		overflow: "hidden",
		backgroundColor: "white",
		padding: 8,
		marginTop: 14,
	},
	timeText: {
		fontSize: 30,
		fontWeight: "bold",
	},
	daysText: {
		fontSize: 18,
	},
	floatingButton: {
		position: "absolute",
		bottom: 16,
		right: 16,
		backgroundColor: "rgba(51, 110, 123, 1)",
		width: 56,
		height: 56,
		borderRadius: 28,
		justifyContent: "center",
		alignItems: "center",
		elevation: 3,
	},
	floatingButtonLabel: {
		color: "white",
		fontSize: 24,
		fontWeight: "bold",
	},
});

export default ReminderScreen;
