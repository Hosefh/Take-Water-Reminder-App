import React, { useState, useEffect } from "react";
import {
	Text,
	View,
	StyleSheet,
	Button,
	TouchableOpacity,
	ScrollView,
	Alert,
} from "react-native";
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
	deleteDoc,
	updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import * as Notifications from "expo-notifications";
import { presentNotificationAsync } from "expo-notifications";

const ReminderScreen = () => {
	const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
	const [selectedTime, setSelectedTime] = useState("");
	const [selectedDays, setSelectedDays] = useState([]);
	const [isDrawerOpen, setDrawerOpen] = useState(false);
	const [reminders, setReminders] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [lastReminderTime, setLastReminderTime] = useState(null);
	const [reminded, setReminded] = useState(false);
	const [reminderCount, setReminderCount] = useState(0);
	const [previousReminderCount, setPreviousReminderCount] = useState(0);
	const [deletePressed, setDeletePressed] = useState(false);

	useEffect(() => {
		getReminders();
		if (!reminded && reminders.length > 0) {
			countRemindersRemindedToday(reminders);
			setPreviousReminderCount(reminderCount);
		}
	}, [reminders, reminded]);

	const requestPermissions = async () => {
		const { status } = await Notifications.requestPermissionsAsync();
		if (status !== "granted") {
			alert("Notification permissions are required to use this feature.");
		}
	};

	useEffect(() => {
		requestPermissions();
	}, []);

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

	const formatTime = (time) => {
		const hours = time.getHours();
		const minutes = time.getMinutes();
		const ampm = hours >= 12 ? "PM" : "AM";
		const formattedHours = hours % 12 || 12;
		return `${formattedHours.toString().padStart(2, "0")}:${minutes
			.toString()
			.padStart(2, "0")} ${ampm}`;
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

			const selectedHour = selectedTime.getHours();
			const selectedMinutes = selectedTime.getMinutes();

			const reminderData = {
				time: selectedTime.getTime(), // Save selectedTime as a timestamp
				days: selectedDays,
				reminded: false,
			};

			// console.log("selected time: " + selectedTime);

			await addDoc(collection(firestore, "reminders"), reminderData);

			// Schedule the thank you message notification
			presentNotificationAsync({
				title: "Water Intake Reminder",
				body: "Thank you for letting me remind you",
				trigger: {
					seconds: 2, // Send the thank you message 2 seconds after setting the reminder
				},
				// You can add other options like sound, badge, etc. here
			});

			// Display data to card
			setSelectedDays([]);
			setSelectedTime("");

			setIsLoading(false);

			setDrawerOpen(false);
		} catch (error) {
			console.error("Error saving reminder:", error.message);
			setIsLoading(false);
		}
	};

	const sendReminderNotification = (reminder) => {
		const { time } = reminder;
		const scheduledTime = new Date(time);

		try {
			presentNotificationAsync({
				title: "Water Intake Reminder",
				body: "Its time to drink water!",
				// allowWhileIdle: true,
			});

			// Update reminded state
			setReminded(false);
		} catch (error) {
			console.error("Error sending notification:", error);
		}
	};

	// const countRemindersRemindedToday = async (reminders) => {
	// 	const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	// 	const d = new Date();
	// 	const currentDay = weekday[d.getDay()];

	// 	try {
	// 	  for (const reminder of reminders) {
	// 		const { time, days } = reminder;
	// 		const scheduledTime = new Date(time);
	// 		const scheduledDay = scheduledTime.getDay();

	// 		if (
	// 		  days.includes(currentDay) &&
	// 		  scheduledDay === d.getDay() &&
	// 		  !reminded
	// 		) {
	// 		  const currentTime = new Date();
	// 		  if (scheduledTime < currentTime) {
	// 			// sendReminderNotification(reminder);
	// 				console.log('Inom nag tubig waa ka!');
	// 			if (!lastReminderTime || scheduledTime > lastReminderTime) {
	// 				  setLastReminderTime(scheduledTime);
	// 			}
	// 			setReminded(true);
	// 		  }
	// 		}
	// 	  }
	// 	} catch (error) {
	// 	  console.error("Error counting reminders reminded today:", error);
	// 	}
	//   };
	const countRemindersRemindedToday = async (reminders) => {
		const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		const d = new Date();
		const currentDay = weekday[d.getDay()];

		let count = 0;

		for (const reminder of reminders) {
			const { time, days } = reminder;
			const scheduledTime = new Date(time);
			const scheduledDay = scheduledTime.getDay();

			// Check if the reminder is scheduled for today and has already been reminded
			if (days.includes(currentDay) && scheduledDay === d.getDay()) {
				const currentTime = new Date();
				if (scheduledTime < currentTime) {
					count++;
					if (!lastReminderTime || scheduledTime > lastReminderTime) {
						setLastReminderTime(scheduledTime);
					}
				}
			}
		}
		// console.log('New Reminder COunt', count);
		setReminderCount(count);
		pahinumdom();
	};

	const pahinumdom = () => {
		// console.log('PreviousCount',previousReminderCount)
		// if (reminderCount !== previousReminderCount) {
		// 	console.log('Inom na oii');
		// }
		try {
			// console.log("DeletePressed?", deletePressed);
			if (reminderCount !== previousReminderCount && deletePressed === false) {
				presentNotificationAsync({
					title: "Water Intake Reminder",
					body: "Hello, Time to drink your water!",
					allowWhileIdle: true,
				});
			}
		} catch (error) {
			console.error("Error sending notification:", error);
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

					// console.log("DeletePressed on Get?", deletePressed);
					setDeletePressed(false);
				} else {
					console.log("No reminder data found");
				}
			});

			setReminders(remindersData);
		} catch (error) {
			console.error("Error getting reminders:", error);
		}
	};

	const handleDelete = async (id) => {
		setDeletePressed(true);
		try {
			const app = getFirebaseApp();
			const firestore = getFirestore(app);

			await deleteDoc(doc(firestore, "reminders", id));
			getReminders();
		} catch (error) {
			console.error("Error deleting reminder:", error);
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
							<Text style={styles.selectButtonText}>
								{selectedTime ? formatTime(selectedTime) : "Select Time"}
							</Text>
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
						<Text>No reminders found</Text>
					) : (
						reminders.map((reminder) => (
							<TouchableOpacity key={reminder.id} style={styles.card}>
								<Text style={styles.timeText}>
									{reminder.time ? formatTime(new Date(reminder.time)) : ""}
								</Text>
								<Text style={styles.daysText}>
									{reminder.days ? reminder.days.join(", ") : ""}
								</Text>
								<Ionicons
									name="trash-outline"
									size={24}
									color="rgba(51, 110, 123, 1)"
									onPress={() =>
										Alert.alert(
											"Delete Reminder",
											"Are you sure you want to delete this reminder?",
											[
												{
													text: "Cancel",
													style: "cancel",
												},
												{
													text: "OK",
													onPress: () => handleDelete(reminder.id),
												},
											],
											{ cancelable: true }
										)
									}
									style={styles.deleteIcon}
								/>
							</TouchableOpacity>
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
		backgroundColor: "rgba(255, 255, 255,0.9)",
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
	deleteIcon: {
		position: "absolute",
		bottom: 8,
		right: 8,
	},
});

export default ReminderScreen;
