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
import Icon from "react-native-vector-icons/Ionicons";
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
      const meetingsColRef = collection(db, "meeting", currentUser.uid, "meetings");
  
      const meetingRef = await addDoc(meetingsColRef, {
        host: currentUser.uid,
        meetingName,
        meetingDate,
        meetingTime,
        meetingLink, // Use the generated link
        payee: [],
        status: "not_started"
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
      const response = await fetch('http://192.168.1.65:8080/create-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error('Network response was not ok.');
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
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Back Icon */}
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={30} color="#000" />
        </TouchableOpacity>
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "stretch",
    padding: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
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
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MeetingDetail;
