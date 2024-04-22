import React, { useRef, useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ImageBackground,
  Image,
  ScrollView
} from "react-native";
import { ProgressBar } from "react-native-paper";
import LottieView from "lottie-react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import userIcon from "../assets/images/userIcon.png";
import CardImage from "../assets/images/card_background.jpg";

import { getFirebaseApp } from "../utils/config";
import {
	getFirestore,
	collection,
	doc,
	setDoc,
	addDoc,
	getDocs,
	deleteDoc,
} from "firebase/firestore";

const Dashboard = ({ navigation }) => {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState(null);
	const [showDropdown, setShowDropdown] = useState(false);
	const [reminders, setReminders] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [reminderCount, setReminderCount] = useState(0);
	const [lastCountedDay, setLastCountedDay] = useState(null);
	const [lastReminderTime, setLastReminderTime] = useState(null);
	const [reminderHistory, setReminderHistory] = useState([]);
	const animation = useRef(null);

	// useEffect(() => {
	//   const intervalId = setInterval(() => {
	//     getReminders();
	// 		countRemindersRemindedToday(reminders);
	// 	}, 5000);

	// 	return () => {
	// 		clearInterval(intervalId);
	// 	};
	// }, [isLoading]);

	useEffect(() => {
		getReminders();
		if (reminders.length > 0) {
			countRemindersRemindedToday(reminders);
			getReminderHistory();
		}
	}, [reminders]);

	const handleLogout = () => {
		// try {
		//   await signOut(); // Sign out the user using Firebase auth
		//   console.log('User logged out successfully');
		//   // You can navigate to the login screen or any other screen after logout if needed
		// } catch (error) {
		//   console.error('Error logging out:', error.message);
		// }
		navigation.navigate("Login");
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
				} else {
					console.log("No reminder data found");
				}
			});

			// Set the reminders state
			setReminders(remindersData);

			// Count reminders reminded today
			await countRemindersRemindedToday(remindersData);
		} catch (error) {
			console.error("Error getting reminders:", error);
		}
	};

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

		setReminderCount(count);
	};

	const getReminderHistory = () => {
		const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		const d = new Date();
		const currentDay = weekday[d.getDay()];

		const todayReminders = reminders.filter((reminder) => {
			const { time, days } = reminder;
			const scheduledTime = new Date(time);
			const scheduledDay = scheduledTime.getDay();
			return days.includes(currentDay) && scheduledDay === d.getDay();
		});

		setReminderHistory(todayReminders);
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.welcomeText}>Welcome User!</Text>
				<TouchableOpacity onPress={() => setShowDropdown(!showDropdown)}>
					<Image
						source={require("../assets/images/userIcon.png")} // Replace with your user icon image
						style={styles.userIcon}
					/>
				</TouchableOpacity>
			</View>
			{showDropdown && (
				<View style={styles.dropdown}>
					<TouchableOpacity style={styles.dropdownItem} onPress={handleLogout}>
						<Text style={styles.dropdownItemText}>
							Exit App <Ionicons name="exit-outline" size={20} color="black" />
						</Text>
					</TouchableOpacity>
					{/* Add more dropdown items as needed */}
				</View>
			)}
			<ImageBackground source={CardImage} style={styles.card}>
				{/* <Text style={styles.cardTextHeader}>Good Day, User</Text> */}
				<Text style={styles.cardTextHeader}>Estimated Volume</Text>
				<Text style={styles.cardTextNumber}>{reminderCount}</Text>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<ProgressBar
						progress={0.4}
						color={"white"}
						style={{ flex: 1, height: 8 }}
					/>
					<Text style={styles.cardText}>
						Total glass of water consumed today
					</Text>
				</View>
			</ImageBackground>
			<View style={styles.main}>
				<Text style={styles.mainHeaderText}>My Activity</Text>
				<Text style={styles.mainBodyText}>Total glass of water consumed</Text>
				<TouchableOpacity style={styles.activityCard}>
          <Text style={styles.activityCardText}>{reminderHistory.length}</Text>
					<LottieView
						autoPlay
						ref={animation}
						style={styles.lottie}
						// Find more Lottie files at https://lottiefiles.com/featured
						source={require("../assets/images/waterReminder.json")}
					/>
				</TouchableOpacity>
			</View>
			
      <Text style={styles.mainHeaderText}>Reminder History..</Text>
      <ScrollView>
				{reminderHistory.map((reminder, index) => (
					<Text key={index} style={styles.mainBodyText}>
						{`${index + 1}: ${new Date(reminder.time).toLocaleTimeString()}`}
					</Text>
				))}
			</ScrollView>
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
	// top: {
	//   backgroundColor: "rgba(3, 138, 255, 0.5)",
	// },
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
	},
	welcomeText: {
		fontSize: 22,
		fontWeight: "bold",
	},
	userIcon: {
		width: 50,
		height: 50,
	},
	dropdown: {
		position: "absolute",
		top: 60,
		right: 20,
		backgroundColor: "white",
		borderRadius: 5,
		elevation: 5,
		zIndex: 999,
	},
	dropdownItem: {
		paddingVertical: 10,
		paddingHorizontal: 20,
	},
	dropdownItemText: {
		fontSize: 16,
		fontWeight: "bold",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
	},
	logoutIcon: {
		width: 20,
		height: 20,
	},
	// lottie: {
	//   width: 150,
	//   height: 150,
	//   justifyContent: "flex-start",
	//   alignItems: "flex-start",
	//   overflow: "hidden",
	// },
	card: {
		width: "100%",
		height: 200,
		borderRadius: 10,
		justifyContent: "space-around",
		alignItems: "start",
		overflow: "hidden",
		backgroundColor: "white", // Adjust opacity here (0 = fully transparent, 1 = fully opaque)
	},
	cardTextHeader: {
		fontSize: 18,
		fontWeight: "bold",
		color: "white",
    // marginLeft: 10,
    paddingLeft: 10,
		padding: 8,
	},
	cardText: {
		fontSize: 14,
		fontWeight: "bold",
		color: "white",
    // marginLeft: 10,
    paddingLeft: 10,
		padding: 8,
	},
	cardTextNumber: {
		fontSize: 82,
		color: "white",
		fontWeight: "bold",
		paddingLeft: 20,
	},
	activityCard: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: "#f0f0f0",
		padding: 20,
		borderRadius: 10,
	},
	activityCardText: {
		fontSize: 82,
		fontWeight: "bold",
    // marginLeftt: 10,
    paddingLeft: 10,
	},
	lottie: {
		width: 150,
		height: 150,
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
		padding: 4,
		fontSize: 16,
	},
});

export default Dashboard;
