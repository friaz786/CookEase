import React, { useState } from "react";
import {
  Alert,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import {
  getAuth,
  updateEmail,
  updatePassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import UserModel from "../models/UserModel";
import Icon from "react-native-vector-icons/Ionicons";

const EditProfile = ({ navigation }) => {
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  const handleChangePassword = async () => {
    if (password.trim() === "") {
      Alert.alert("Error", "Password cannot be empty.");
      return;
    }

    try {
      console.log(password);
      await updatePassword(user, password);
      Alert.alert("Success", "Password updated successfully");
    } catch (error) {
      console.error("Error updating password:", error);
      Alert.alert("Error", error.message);
    }
  };

  const handleUpdatePhoneNumber = async () => {
    if (phoneNumber.trim() === "") {
      Alert.alert("Error", "Phone number cannot be empty.");
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { phoneNumber });
      Alert.alert("Success", "Phone number updated successfully.");
    } catch (error) {
      console.error("Error updating phone number:", error);
      Alert.alert("Error", error.message);
    }
  };

  const handleUpdateName = async () => {
    if (name.trim() === "") {
      Alert.alert("Error", "Name cannot be empty.");
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { name });
      Alert.alert("Success", "Name updated successfully.");
    } catch (error) {
      console.error("Error updating name:", error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.header}>Edit Profile</Text>
        {/* Email Input and Button */}
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.sec}>
        {/* Password Input and Button */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.passwordtext}>Update Password</Text>
        </TouchableOpacity>

        {/* Phone Input and Button */}
        <TextInput
          style={styles.input}
          placeholder="Phone"
          onChangeText={setPhoneNumber}
          value={phoneNumber}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleUpdatePhoneNumber}
        >
          <Text style={styles.phonetext}>Update Phone</Text>
        </TouchableOpacity>

        {/* Name Input and Button */}
        <TextInput
          style={styles.input}
          placeholder="Name"
          onChangeText={setName}
          value={name}
        />
        <TouchableOpacity style={styles.button} onPress={handleUpdateName}>
          <Text style={styles.nametext}>Update Name</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
  sec: {
    marginTop: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    borderColor: "white",
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
  },
  backIcon: {
    position: "absolute",
    top: 35, // Adjust top and left as per the design requirements
    left: 10,
    zIndex: 10, // Make sure the touchable opacity appears above other elements
  },
  button: {
    backgroundColor: "#4CAF50",
    width: "40%",
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
    marginBottom: "17%",
    marginTop: "2%",
    shadowColor: "black",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  passwordtext: {
    color: "white",
    fontWeight: "bold",
  },
  phonetext: {
    color: "white",
    fontWeight: "bold",
  },
  nametext: {
    color: "white",
    fontWeight: "bold",
  },
});

export default EditProfile;
