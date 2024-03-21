import React, { useState } from "react";
import { Text, View, StyleSheet, Button, TouchableOpacity } from "react-native";
import PushNotification from "react-native-push-notification";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import Drawer from "react-native-drawer";

const ReminderScreen = () => {
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

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

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  return (
    <View style={styles.container}>
      <Button title={isDrawerOpen ? 'Close' : 'Add New'} onPress={toggleDrawer} />
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
          </View>
        }
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>No reminders added.</Text>
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
});

export default ReminderScreen;
