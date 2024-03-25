import React, { useState } from "react";
import { Text, View, StyleSheet, Button, TouchableOpacity } from "react-native";
import PushNotification from "react-native-push-notification";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import Drawer from "react-native-drawer";
import { getFirebaseApp } from "../utils/config";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const ReminderScreen = () => {
	const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
	const [selectedTime, setSelectedTime] = useState("");
	const [selectedDays, setSelectedDays] = useState([]);
	const [isDrawerOpen, setDrawerOpen] = useState(false);
	const [reminders, setReminders] = useState([]);

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

      await setDoc(doc(firestore, "reminders", "documentId"), reminderData);

      // display data to card
      const newReminder = { time: selectedTime, days: selectedDays };
      setReminders([...reminders, newReminder]);
      
      setDrawerOpen(false)
		} catch (error) {
			console.error("Error saving reminder:", error.message);
		}
	};

	const toggleDrawer = () => {
		setDrawerOpen(!isDrawerOpen);
	};

	return (
		<View style={styles.container}>
			<Button
				title={isDrawerOpen ? "Close" : "Add New"}
				onPress={toggleDrawer}
				style={styles.addBtn}
			/>
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
							<Text style={styles.selectButtonText}>Select Time</Text>
						</TouchableOpacity>
						<View>
							<Text>
								Selected Time:{" "}
								{selectedTime ? selectedTime.toLocaleTimeString() : ""}
							</Text>
						</View>
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
						<Button title={"Save"} onPress={saveReminder} />
					</View>
				}
			>
				<View
					// style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
				>
					{reminders.length === 0 ? (
						<Text>No reminders added.</Text>
					) : (
						reminders.map((reminder, index) => (
							<View key={index} style={styles.card}>
								<Text style={styles.timeText}>{`${reminder.time.toLocaleTimeString()}`}</Text>
								<Text>{`${reminder.days.join(", ")}`}</Text>
							</View>
						))
					)}
				</View>
			</Drawer>
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
	drawerContent: {
		flex: 1,
		padding: 20,
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
    backgroundColor: "white", // Adjust opacity here (0 = fully transparent, 1 = fully opaque)
    padding: 8,
    marginTop: 14
  },
  timeText: {
    fontSize: 30,
    fontWeight: "bold",
  }
});

export default ReminderScreen;
