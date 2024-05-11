import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { db } from "../firebase"; // Adjust this import according to your file structure
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

const MeetingDetail = ({ navigation }) => {
  const [meetingName, setMeetingName] = useState("");
  const [meetingDate, setMeetingDate] = useState(new Date());
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const handleSaveMeetingDetails = async () => {
    if (!meetingName || !meetingDate) {
      Alert.alert("Error", "Please fill all the fields.");
      return;
    }

    const meetingLink = await createDailyCoMeeting(); // Create the meeting room and get the link
    if (!meetingLink) return; // Stop if the meeting room wasn't created successfully

    try {
      const meetingsColRef = collection(
        db,
        "meeting",
        currentUser.uid,
        "meetings"
      );

      const meetingRef = await addDoc(meetingsColRef, {
        host: currentUser.uid,
        meetingName,
        meetingDate,
        meetingTime,
        meetingLink, // Use the generated link
        payee: [],
        status: "not_started",
      });

      Alert.alert("Success", "Meeting details saved successfully.");
      navigation.goBack();
    } catch (error) {
      console.error("Error saving meeting details: ", error);
      Alert.alert("Error", "Could not save meeting details.");
    }
  };

  async function createDailyCoMeeting() {
    try {
      const response = await fetch("http://172.20.5.193:8080/create-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      return data.url; // assuming your backend returns { url: "meeting URL here" }
    } catch (error) {
      console.error("Failed to create Daily.co room:", error);
      Alert.alert("Error", "Failed to create meeting room.");
      return null; // handle error appropriately
    }
  }

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || meetingDate;
    setShowDatePicker(Platform.OS === "ios");
    setMeetingDate(currentDate);
  };

  return (
    <View contentContainerStyle={styles.container}>
      <View style={styles.customHeader}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={30} color="#000" />
        </TouchableOpacity>
      </View>
      <Text style={styles.headerText}>Enter Meeting Details</Text>

      <Text style={styles.label}>Meeting Name:</Text>
      <TextInput
        style={styles.input}
        value={meetingName}
        onChangeText={setMeetingName}
        placeholder="e.g., Weekly Stand-up"
      />

      <Text style={styles.label}>Meeting Date:</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.inputText}>{meetingDate.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={meetingDate}
          mode={"date"}
          is24Hour={true}
          display="default"
          onChange={onChangeDate}
          minimumDate={new Date()}
        />
      )}

      <Text style={styles.label}>Meeting Time:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={meetingTime}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => setMeetingTime(itemValue)}
          mode="dropdown"
        >
          {Array.from({ length: 24 }, (_, i) => (
            <Picker.Item key={i} label={`${i}:00`} value={`${i}:00`} />
          ))}
        </Picker>
      </View>

      {/* Meeting Link */}
      {/* <Text style={styles.label}>Meeting Link:</Text>
        <TextInput
          style={styles.input}
          value={meetingLink}
          onChangeText={setMeetingLink}
          placeholder="https://"
        /> */}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSaveMeetingDetails}
      >
        <Text style={styles.buttonText}>Save Meeting Details</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "stretch",
    padding: 20,
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
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: "4%",
    marginBottom: 20,
    alignSelf: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderColor: "white",
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderColor: "#4CAF50",
    borderWidth: 2,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  inputText: {
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
  },
  button: {
    backgroundColor: "#4CAF50",
    width: "100%",
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
    marginBottom: "7%",
    marginTop: 5,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MeetingDetail;