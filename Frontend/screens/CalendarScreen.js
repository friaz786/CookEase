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
    <View style={styles.container}>
     <View style={styles.customHeader}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={30} color="#000" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: "flex-end" }}></View>
      </View>
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
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: '5%',
    color: "#212121",
    //alignSelf: 'center',
  },
  backIcon: {
    padding: 10,
    marginTop: 20,
    marginLeft: 1,
  },
  customHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#4CAF50",
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    width: "95%",
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
    marginHorizontal: "10%",
    alignSelf: 'center',
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

export default CalendarScreen;
