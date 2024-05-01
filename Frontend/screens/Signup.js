import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth"; // Importing necessary functions
import { doc, setDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../firebase"; // Import db from your firebase.js
import UserModel from "../models/UserModel";
// import {app} from './firebase';

const Signup = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isChef, setIsChef] = useState(false);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const auth = getAuth();
  const cuisines = [
    { id: 1, name: "Italian" },
    { id: 2, name: "French" },
    { id: 3, name: "Japanese" },
    { id: 4, name: "Chinese" },
    { id: 5, name: "Indian" },
  ];

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Prepare the user data with the selected cuisines array
      const userData = {
        name: name,
        phoneNumber: phoneNumber,
        role: isChef ? "chef" : "normal-user",
        cuisines: selectedCuisines, // This should be an array of selected cuisines
        followers: [], // Initialize followers as an empty array
        following: [],
        subscribers: [],
        subscribedTo: []
      };

      // Save the user data to Firestore
      await setDoc(doc(db, "users", user.uid), userData);
      Alert.alert("User registered successfully");
      navigation.navigate("login");
    } catch (error) {
      console.error("Error during signup:", error);
      setErrorMessage(error.message);
    }
  };

  const toggleCuisine = (cuisineName) => {
    setSelectedCuisines((currentCuisines) => {
      if (currentCuisines.includes(cuisineName)) {
        // Remove the cuisine from the array
        return currentCuisines.filter((c) => c !== cuisineName);
      } else {
        // Add the cuisine to the array
        return [...currentCuisines, cuisineName];
      }
    });
  };

  return (
    <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={true}>
        <SafeAreaView style={styles.container}>
          <TouchableOpacity
            style={styles.backIcon}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={30} color="#000" />
          </TouchableOpacity>
          {/* Header */}
          <Text style={styles.header}>Create New Account</Text>
          {/* Name Input */}
          <TextInput
            style={styles.input}
            onChangeText={setName}
            value={name}
            placeholder="Name"
          />

          {/* Email Input */}
          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            placeholder="Email"
            keyboardType="email-address"
          />

          {/* Phone Number Input */}
          <TextInput
            style={styles.input}
            onChangeText={setPhoneNumber}
            value={phoneNumber}
            placeholder="Phone Number"
            keyboardType="phone-pad"
          />

          {/* Password Input */}
          <TextInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            placeholder="Password"
            secureTextEntry={true}
          />
          <View style={styles.registerAsChefCheckbox}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setIsChef(!isChef)}
            >
              <View style={isChef ? styles.chefCheckboxChecked : {}} />
            </TouchableOpacity>
            <Text
              style={styles.checkboxLabel}
              onPress={() => setIsChef(!isChef)}
            >
              Do you want to register as a chef?
            </Text>
          </View>

          <View>
            <Text style={styles.selectCuisine}>
              Select your Preferred Cuisine:
            </Text>
            <View style={styles.cuisinesContainer}>
              {cuisines.map((cuisine) => (
                <TouchableOpacity
                  key={cuisine.id}
                  style={styles.checkboxContainer}
                  onPress={() => toggleCuisine(cuisine.name)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      selectedCuisines.includes(cuisine.name)
                        ? styles.checkboxChecked
                        : {},
                    ]}
                  >
                    {selectedCuisines.includes(cuisine.name) && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>{cuisine.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <Text
            style={styles.linkText}
            onPress={() => navigation.navigate("login")}
          >
            Already Registered? Login here
          </Text>
          {/* Signup Button */}
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

// ... Include your styles and any other necessary code here ...

// ... styles and export ...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center", // This centers children horizontally in the container
    justifyContent: "center", // Adjusted to align children to start, useful for forms
    padding: 20,
    backgroundColor: "#ffe6e6",
  },
  backIcon: {
    position: "absolute",
    top: 45, // Adjust top and left as per the design requirements
    left: 10,
    zIndex: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
    //marginTop: "10%",
  },
  input: {
    width: "80%",
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignSelf: "center", // Ensure it centers itself in the parent
  },
  registerAsChefCheckbox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 5,
    width: "80%", // Set a width to contain the checkboxes nicely
  },
  cuisinesContainer: {
    flexDirection: "row", // Align items in a row
    flexWrap: "wrap", // Allow items to wrap to next line
    justifyContent: "center", // Center items horizontally
    width: "100%", // Take up full width to utilize space
    marginBottom: 20,
    marginLeft: 40,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 5, // Added margin for spacing between checkboxes
    width: "45%",
  },
  checkbox: {
    width: 24,
    height: 24,
    marginRight: 8,
    borderWidth: 2,
    borderColor: "#ddd", // Default border color
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  checkboxChecked: {
    borderWidth: 2,
    borderColor: "#4CAF50",
    backgroundColor: "#4CAF50",
  },
  chefCheckboxChecked: {
    borderWidth: 2,
    height: 12,
    width: 12,
    borderColor: "#4CAF50",
    backgroundColor: "#4CAF50",
  },
  checkboxLabel: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: "#333",
  },
  button: {
    width: "80%",
    padding: 10,
    alignItems: "center",
    justifyContent: "center", // Ensure text within button is centered
    borderRadius: 10,
    backgroundColor: "#4CAF50",
    shadowColor: "black",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignSelf: "center",
    marginBottom: "2%",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkText: {
    color: "#ff6f69", // Pastel pink
    paddingBottom: 25,
  },
  selectCuisine: {
    fontSize: 16,
    paddingBottom: 15,
    fontWeight: "bold",
    marginLeft: 35,
    paddingTop: 25
  },
});

export default Signup;
