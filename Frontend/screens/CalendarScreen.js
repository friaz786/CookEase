import React, { useState } from "react";
import {
  Alert,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";

const CalendarScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState("");

  const onDayPress = (day) => {
    const date = new Date(day.dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      Alert.alert("Invalid Date", "Please select a future date.");
    } else {
      const formattedDate = new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);

      setSelectedDate(formattedDate);
    }
  };

  const onCreateMealPlan = () => {
    if (!selectedDate) {
      Alert.alert(
        "No Date Selected",
        "You must select a date to create a meal plan."
      );
    } else {
      navigation.navigate("createmealplan", { date: selectedDate });
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
      <Text style={styles.title}>Select date for Meal Plan</Text>
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
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onCreateMealPlan}>
          <Text style={styles.buttonText}>Create Meal Plan</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: -60,
    marginBottom: 10,
    color: "#212121",
  },
  backIcon: {
    position: "absolute",
    top: 40,
    left: 20,
    //marginTop: "-30%",
    
  },
  buttonContainer: {
    width: "100%", // Take the full width of the container
    alignItems: "center", // Center-align the button horizontally
  },
  button: {
    backgroundColor: "#4CAF50",
    width: "80%",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
  },
});

export default CalendarScreen;
