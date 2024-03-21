import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import LottieView from "lottie-react-native";

import userIcon from "../assets/images/userIcon.png";
import CardImage from "../assets/images/drink.jpg";

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const animation = useRef(null);

  const handleLogout = () => {
    // Perform logout logic here
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, USER!</Text>
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
            <Text style={styles.dropdownItemText}>Logout</Text>
          </TouchableOpacity>
          {/* Add more dropdown items as needed */}
        </View>
      )}
      <ImageBackground source={CardImage} style={styles.card}>
        <Text style={styles.cardText}>Stay hydrated, stay refreshed.</Text>
      </ImageBackground>
      <View style={styles.main}>
        <Text style={styles.mainHeaderText}>My Activity</Text>
        <Text style={styles.mainBodyText}>Water intake estimated volume</Text>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardText}>Records</Text>
          <LottieView
            autoPlay
            ref={animation}
            style={styles.lottie}
            // Find more Lottie files at https://lottiefiles.com/featured
            source={require("../assets/images/waterReminder.json")}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.main}>
        <Text style={styles.mainHeaderText}>Reminder History..</Text>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardText}>Records</Text>
          <LottieView
            autoPlay
            ref={animation}
            style={styles.lottie}
            // Find more Lottie files at https://lottiefiles.com/featured
            source={require("../assets/images/waterReminder.json")}
          />
        </TouchableOpacity>
      </View>
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
    fontSize: 24,
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
  },
  logoutIcon: {
    width: 20,
    height: 20,
  },
  lottie: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    justifyContent: "space-around",
    alignItems: "start",
    overflow: "hidden",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust opacity here (0 = fully transparent, 1 = fully opaque)
  },
  cardText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    // textShadowColor: "black", // Shadow color
    // textShadowOffset: { width: 1, height: 1 }, // Shadow offset
    // textShadowRadius: 2, // Shadow blur radius
    marginLeft: 10,
    marginTop: 140,
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
});

export default Dashboard;
