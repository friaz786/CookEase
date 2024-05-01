import React, { useState } from "react";
import {
  Alert,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import EventSearch from "./EventSearch";

const EventCalendar = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [eventName, setEventName] = useState("");

  const onDayPress = (day) => {
    const date = new Date(day.dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      Alert.alert("Invalid Date", "Please select a future date.");
    } else {
      setSelectedDate(day.dateString);
    }
  };

  const onCreateEventPlan = () => {
    if (!selectedDate) {
      Alert.alert(
        "No Date Selected",
        "You must select a date to create an event plan."
      );
    } else if (!eventName.trim()) {
      Alert.alert("Event Name Missing", "Please enter an event name.");
    } else {
      // Assuming 'CreateEventPlan' is the route for your event plan creation screen
      // Pass both eventName and selectedDate to the next screen
      navigation.navigate("searchrecipe", { eventName, date: selectedDate });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backIcon}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={30} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>Enter Event Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Event Name"
        value={eventName}
        onChangeText={setEventName}
      />
      <Text style={styles.title}>Select Date for Event</Text>
      <Calendar
        onDayPress={onDayPress}
        markedDates={{
          [selectedDate]: {
            selected: true,
            disableTouchEvent: true,
            selectedDotColor: "orange",
          },
        }}
        theme={{
          selectedDayBackgroundColor: "#4CAF50",
          todayTextColor: "#FF9800",
          arrowColor: "#4CAF50",
          monthTextColor: "#212121",
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 16,
        }}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("EventSearch", { date: selectedDate, eventName })
        }
      >
        <Text style={styles.buttonText}>Create Event Plan</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    color: "#212121",
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderColor: "white",
    borderWidth: 1,
    padding: 10,
    marginBottom: "3%",
    marginTop: "2%",
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButton: {
    alignSelf: "flex-start",
    marginLeft: 10,
    marginTop: 10,
    padding: 10,
  },
  backButtonText: {
    color: "#007AFF",
    fontSize: 18,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: "center",
    marginTop: 20,
  },
  buttonText: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
  },
});

export default EventCalendar;
