import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Make sure to install this package
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const handleResetPassword = () => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert(
          "Check your email",
          "A link to reset your password has been sent to your email address."
        );
      })
      .catch((error) => {
        const errorMessage = error.message;
        // Handle errors here
        Alert.alert("Error", errorMessage);
      });
  };

  return (
    <View style={styles.container}>
      {/* Back Icon */}
      <TouchableOpacity
        style={styles.backIcon}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={30} color="#000" />
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.header}>Reset Password</Text>
        <Text style={styles.instruction}>
          Please enter your email address to receive a link to create a new
          password via email.
        </Text>

        {/* Email Input Field */}
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="Enter your email"
          keyboardType="email-address"
        />

        {/* Reset Password Button */}
        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 50, // Adjust the padding as needed
    backgroundColor: "#ffe6e6",
  },
  backIcon: {
    position: "absolute",
    top: 35, // Adjust top and left as per the design requirements
    left: 10,
    zIndex: 10, // Make sure the touchable opacity appears above other elements
  },
  content: {
    marginTop: "45%", // Adjust the margin as needed
    width: "80%",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  instruction: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  button: {
    backgroundColor: "#4CAF50",
    width: "100%",
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
    marginBottom: "7%",
    marginTop: 17,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ForgotPassword;
