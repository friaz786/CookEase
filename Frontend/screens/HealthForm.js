import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Switch,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { db } from "../firebase"; // Adjust the path as necessary
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

const HealthForm = ({ navigation }) => {
  const [birthday, setBirthday] = useState(new Date());
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [hasDiabetes, setHasDiabetes] = useState(false);
  const [hasBloodPressure, setHasBloodPressure] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [bmi, setBmi] = useState("");
  const [bmiCategory, setBmiCategory] = useState("");

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthday;
    setShowDatePicker(Platform.OS === "ios");
    setBirthday(currentDate);
  };

  const calculateBMI = () => {
    const heightInMeters = height / 100;
    const bmiValue = weight / heightInMeters ** 2;
    setBmi(bmiValue.toFixed(2));

    let category = "";
    if (bmiValue < 18.5) {
      category = "Underweight";
    } else if (bmiValue >= 18.5 && bmiValue <= 24.9) {
      category = "Normal weight";
    } else if (bmiValue >= 25 && bmiValue <= 29.9) {
      category = "Overweight";
    } else {
      category = "Obesity";
    }
    setBmiCategory(category);
  };
  const saveData = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      // Reference to the user's document in the "users" collection
      const userRef = doc(db, "users", user.uid);

      try {
        // Update the user's document with the new health data
        await updateDoc(userRef, {
          healthData: {
            birthday: birthday.toLocaleDateString("en-US"), // Or format as needed
            age,
            height,
            weight,
            hasDiabetes,
            hasBloodPressure,
            bmi,
            bmiCategory,
          },
        });
        alert("Health data saved successfully!");
        navigation.navigate("Home");
      } catch (error) {
        console.error("Error updating document: ", error);
        alert("Failed to save health data.");
      }
    } else {
      alert("No user logged in.");
    }
  };

  return (
    <>
      <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Your Health Profile</Text>
            <TextInput
              style={styles.input}
              placeholder="Age"
              keyboardType="numeric"
              value={age}
              onChangeText={setAge}
            />
            <TextInput
              style={styles.input}
              placeholder="Height (cm)"
              keyboardType="numeric"
              value={height}
              onChangeText={setHeight}
            />
            <TextInput
              style={styles.input}
              placeholder="Weight (kg)"
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
            <View style={styles.switchContainer}>
              <Text style={styles.label}>
                Do you have Diabetes? {"                          "}
              </Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={hasDiabetes ? "#007AFF" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={setHasDiabetes}
                value={hasDiabetes}
              />
            </View>
            <View style={styles.switchContainer}>
              <Text style={styles.label}>
                {" "}
                Do you have High Blood Pressure?{"     "}
              </Text>
              <Switch
                style={styles.switch}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={hasBloodPressure ? "#007AFF" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={setHasBloodPressure}
                value={hasBloodPressure}
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={calculateBMI}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 10,
                  borderRadius: 5,
                }}
              >
                <Text style={{ color: "white", fontSize: 16 }}>
                  Calculate BMI
                </Text>
              </TouchableOpacity>
            </View>
            {bmi && (
              <Text style={styles.bmiText}>
                BMI: {bmi} - {bmiCategory}
              </Text>
            )}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={saveData}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 5,
                  fontWeight: "bold",
                }}
              >
                <Text style={{ color: "white", fontSize: 16 }}>Save</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "white", // A light grey background color for contrast
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    borderColor: "white",
    borderWidth: 1,
    padding: 10,
    marginBottom: "1%",
    marginTop: "2%",
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    //marginLeft: "5%",
  },
  switch: {},
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonContainer: {
    backgroundColor: "#4CAF50",
    width: "80%",
    alignItems: "center",
    borderRadius: 10,
    padding: 1,
    marginBottom: "5%",
    marginTop: 17,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    //marginLeft: "9%",
  },
  bmiText: {
    marginTop: "2%",
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF", // Use the system blue color for highlighting the BMI result
    textAlign: "center",
  },
});

export default HealthForm;
